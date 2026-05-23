<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use App\Models\Provider;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Img2ImgController extends Controller
{
    /**
     * Generate an image-to-image transformation using the Stability API.
     *
     * Expects a file upload (init_image) and a text prompt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generate(Request $request)
    {
        // Validate required fields
        $request->validate([
            'init_image'    => 'required|image',
            'prompt'        => 'required|string',
        ]);

        // Ensure the user is authenticated.
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $subscriber = User::with('plan')->find($user->id);

        // Determine usage limits and select a plan.
        if ($subscriber->activeSubscription()->exists()) {
            $subscription = $subscriber->activeSubscription()->first();
            $startPeriod = $subscription->starts_at;
            $endPeriod = $subscription->ends_at;
        } else {
            return response()->json(['error' => 'No active subscription'], 400);
        }
        
        if ($subscription->image_limit <= 0) {
            return response()->json(['error' => 'Image limit exceeded'], 200);
        }

        $conversation = null;
        if ($request->filled('conversation_id')) {
            $conversation = Conversation::where('user_id', $subscriber->id)
                ->find($request->input('conversation_id'));
        }
        if (!$conversation) {
            $conversation = Conversation::create([
                'user_id' => $subscriber->id,
                'title'   => 'Image-to-Image Transformation',
                'type'    => $request->input('conversation_type') ?? null
            ]);
        }

        // Save the user's message.
        Message::create([
            'conversation_id' => $conversation->id,
            'sender'          => 'user',
            'type'            => 'text',
            'content'         => $request->input('prompt'),
        ]);


        // Retrieve the STABILITY_API_KEY from your configuration (.env)
        $provider = Provider::where('name', 'stability Pro')->first();
        if (!$provider) {
            return response()->json(['error' => 'STABILITY_API_KEY environment variable is not set'], 500);
        }

        $stabilityApiKey = $provider->api_key;
        if (!$stabilityApiKey) {
            return response()->json(['error' => 'STABILITY_API_KEY environment variable is not set'], 500);
        }

        // Retrieve the uploaded file.
        $initImage = $request->file('init_image');
        $initImagePath = $initImage->getPathName();

        // Set parameters, using defaults if not provided.
        $imageStrength = $request->input('image_strength', 0.35);
        $cfgScale      = $request->input('cfg_scale', 7);
        $samples       = $request->input('samples', 1);
        $steps         = $request->input('steps', 30);
        $prompt        = $request->input('prompt');

        // Build the Stability API URL.
        $baseUrl = $provider->url;
        $url = $baseUrl . '/v1/generation/stable-diffusion-v1-6/image-to-image';

        // Set up cURL options.
        $curl = curl_init();
        $headers = [
            'Accept: image/png',
            'Authorization: Bearer ' . $stabilityApiKey,
        ];

        // Build the POST fields using CURLFile for the image.
        $postFields = [
            'init_image' => new \CURLFile(
                $initImagePath,
                $initImage->getMimeType(),
                $initImage->getClientOriginalName()
            ),
            'init_image_mode' => 'IMAGE_STRENGTH',
            'image_strength'  => $imageStrength,
            'text_prompts[0][text]' => $prompt,
            'cfg_scale'       => $cfgScale,
            'samples'         => $samples,
            'steps'           => $steps,
        ];

        curl_setopt_array($curl, [
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $postFields,
            CURLOPT_HTTPHEADER     => $headers,
        ]);

        $response = curl_exec($curl);
        if (curl_errno($curl)) {
            $error_msg = curl_error($curl);
            curl_close($curl);
            return response()->json(['error' => $error_msg], 500);
        }
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($httpCode !== 200) {
            return response()->json(['error' => 'Error generating image, HTTP code ' . $httpCode], $httpCode);
        }

        // Encode the binary PNG response as base64.
        $imageBase64 = base64_encode($response);

        // Optionally, create a new conversation and message record.
        $assistantMessage = Message::create([
            'conversation_id' => $conversation->id,
            'sender'          => 'assistant',
            'type'            => 'image',
            'content'         => $imageBase64,
        ]);

        if ($assistantMessage) {
            $userSubscription = $subscriber->activeSubscription()->first();
            $userSubscription->decrement('image_limit');
        }

        return response()->json([
            'image_base64'    => $imageBase64,
            'conversation_id' => $conversation->id,
        ]);
    }
}
