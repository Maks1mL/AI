<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use App\Models\Provider;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BackgroundRemoverController extends Controller
{
    /**
     * Remove the background from an image using the Stability API.
     *
     * Expects an image file in the "image" field.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function remove(Request $request)
    {
        $request->validate([
            'image' => 'required|image'
        ]);

        //store the original image
        $originalImage = $request->file('image');
        $originalImagePath = 'uploads/background_removed_' . time() . '.webp';
        Storage::disk('public')->put($originalImagePath, file_get_contents($originalImage));
    
        


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
                'title'   => 'Background Removal',
                'type'    => $request->input('conversation_type') ?? null,
            ]);
        }

        // Save the user's message.
        Message::create([
            'conversation_id' => $conversation->id,
            'sender'          => 'user',
            'type'            => 'text',
            'content'         => 'Remove background',
            'filePath'        =>  $originalImagePath,
        ]);

        // Retrieve the Stability API key from configuration or .env file

        $provider = Provider::where('name', 'stability Pro')->first();
        if (!$provider) {
            return response()->json(['error' => 'STABILITY_API_KEY environment variable is not set'], 500);
        }
        $stabilityApiKey = $provider->api_key;
        if (!$stabilityApiKey) {
            return response()->json(['error' => 'STABILITY_API_KEY environment variable is not set'], 500);
        }

        // Get the uploaded image file and its temporary path
        $imageFile = $request->file('image');
        $imagePath = $imageFile->getPathName();

        // Set the API endpoint URL
        $url = "https://api.stability.ai/v2beta/stable-image/edit/remove-background";

        // Initialize cURL
        $curl = curl_init();
        $headers = [
            "authorization: Bearer " . $stabilityApiKey,
            "accept: image/*",
        ];

        // Create POST fields using CURLFile for the image upload.
        $postFields = [
            "image" => new \CURLFile($imagePath, $imageFile->getMimeType(), $imageFile->getClientOriginalName()),
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
            return response()->json(['error' => 'Error removing background, HTTP code ' . $httpCode], $httpCode);
        }

        // Encode the returned binary image as base64.
        $imageBase64 = base64_encode($response);

        //store the $imageBase64 in the system and save the path in the database
        $imagePath = 'uploads/background_removed_' . time() . '.webp';
        Storage::disk('public')->put($imagePath, base64_decode($imageBase64));
        // Save the assistant's message with the image.
     


       
        $assistantMessage = Message::create([
            'conversation_id' => $conversation->id,
            'sender'          => 'assistant',
            'type'            => 'image',
            'content'         => $imageBase64,
            'filePath'        => $imagePath,
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
