<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Message;
use App\Models\Provider;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ImageAnalysisController extends Controller
{
    /**
     * Show the form for uploading an image.
     */
    public function showForm()
    {
        return Inertia::render('ImageUpload');
    }

    /**
     * Handle the image upload and analysis.
     */
    public function analyzeImage(Request $request)
    {
        $request->validate([
            // 'image' => 'required|mimes:jpeg,png,jpg,webp|max:5120', // Accept multiple image formats
            'prompt' => 'nullable|string|max:300'
        ]);

        $user = Auth::user();

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


        $userPrompt = $request->input('prompt') ?? "What is in this image?";

        // Fetch OpenAI API key from providers table
        $provider = Provider::where('name', 'openai')->first();
        if (!$provider) {
            return response()->json(['error' => 'AI provider not configured'], 500);
        }
        $apiKey = $provider->api_key;

        // Store the image
        $imagePath = $request->file('image')->store('public/uploads');
        $relativePath = str_replace('public/', '', $imagePath);
        $imageUrl = asset("storage/$relativePath");

        //store the original image
        $originalImage = $request->file('image');
        $originalImagePath = 'uploads/image_analyze' . time() . '.webp';
        Storage::disk('public')->put($originalImagePath, file_get_contents($originalImage));


        // Convert image to Base64
        $imageContent = Storage::get($imagePath);
        $base64Image = base64_encode($imageContent);

        // OpenAI API request payload
        $payload = [
            'model' => 'gpt-4o-mini',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => $userPrompt,
                        ],
                        [
                            'type' => 'image_url',
                            'image_url' => [
                                'url' => 'data:image/jpeg;base64,' . $base64Image,
                            ],
                        ],
                    ],
                ],
            ],
        ];

        // Send request to OpenAI API
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', $payload);


        if ($response->failed()) {
            return response()->json(['error' => 'Failed to analyze the image'], 500);
        }

        $result = $response->json();
        if (!isset($result['choices'][0]['message']['content'])) {
            return response()->json(['error' => 'Unexpected API response'], 500);
        }

        // Create or fetch conversation
        $conversation = Conversation::where('user_id', $user->id)
            ->where('title', 'Image Analysis')
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_id' => $user->id,
                'title' => 'Image Analysis',
                'type'    => $request->input('conversation_type') ?? null
            ]);
        }

        // Store user request as a message
        Message::create([
            'conversation_id' => $conversation->id,
            'sender' => 'user',
            'type' => 'text',
            'content' => $userPrompt,
            'filePath' => $originalImagePath,
        ]);

        // Store AI response as a message
        $aiResponse = $result['choices'][0]['message']['content'] ?? 'No response received.';
        Message::create([
            'conversation_id' => $conversation->id,
            'sender' => 'assistant',
            'type' => 'image',
            'content' => $aiResponse,
        ]);

        // Decrement user's image analysis limit if applicable

        if ($subscriber->activeSubscription()->exists()) {
            $userSubscription = $subscriber->activeSubscription()->first();
            $userSubscription->decrement('image_limit');
        }


        return response()->json([
            'message' => 'Image analyzed successfully',
            'conversation_id' => $conversation->id,
            'image_url' => $imageUrl,
            'ai_response' => $aiResponse,
        ]);
    }
}
