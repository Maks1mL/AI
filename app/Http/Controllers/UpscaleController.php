<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use App\Models\Provider;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UpscaleController extends Controller
{
    /**
     * Upscale an image using the Stability API.
     *
     * Expects an image file in the "image" field.
     * Returns both the original image (base64‑encoded) and the upscaled image.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upscale(Request $request)
    {
        $request->validate([
            'image' => 'required|image'
        ]);

        // Retrieve the uploaded image file.
        $imageFile = $request->file('image');
        $imagePath = $imageFile->getPathName();
        // Read original file content and encode as base64 (for comparison)
        $originalImageContent = file_get_contents($imagePath);
        $originalBase64 = base64_encode($originalImageContent);

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
                'title'   => 'Image Upscale',
                'type'    => $request->input('conversation_type') ?? null
            ]);
        }

        // Save the user's message.
        Message::create([
            'conversation_id' => $conversation->id,
            'sender'          => 'user',
            'type'            => 'text',
            'content'         => 'Upscale image',
        ]);
        $provider = Provider::where('name', 'stability Pro')->first();
        if (!$provider) {
            return response()->json(['error' => 'STABILITY_API_KEY environment variable is not set'], 500);
        }
        $stabilityApiKey = $provider->api_key;
        if (!$stabilityApiKey) {
            return response()->json(['error' => 'STABILITY_API_KEY environment variable is not set'], 500);
        }

        

        // Build the Upscale API URL.
        $url = "https://api.stability.ai/v2beta/stable-image/upscale/fast";

        // Initialize cURL.
        $curl = curl_init();
        $headers = [
            "authorization: Bearer " . $stabilityApiKey,
            "accept: image/*",
        ];

        // Create POST fields (using CURLFile for the uploaded image).
        $postFields = [
            "image" => new \CURLFile(
                $imagePath,
                $imageFile->getMimeType(),
                $imageFile->getClientOriginalName()
            ),
            "output_format" => "webp",
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
            return response()->json(['error' => 'Error upscaling image, HTTP code ' . $httpCode], $httpCode);
        }

        // Encode the upscaled image response as base64.
        $upscaledBase64 = base64_encode($response);

        $assistantMessage = Message::create([
            'conversation_id' => $conversation->id,
            'sender'          => 'assistant',
            'type'            => 'image',
            'content'         => $upscaledBase64,
        ]);

        if ($assistantMessage) {
            $userSubscription = $subscriber->activeSubscription()->first();
            $userSubscription->decrement('image_limit');
        }

        return response()->json([
            'original_image_base64' => $originalBase64,
            'upscaled_image_base64' => $upscaledBase64,
        ]);
    }
}
