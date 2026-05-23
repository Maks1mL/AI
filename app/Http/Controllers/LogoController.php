<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use App\Models\Provider;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class LogoController extends Controller
{
    /**
     * Generate a logo using the OpenAI DALL-E API.
     *
     * Expects the following parameters:
     * - prompt: the base subject for the logo (e.g., "Acme Corp")
     * - type: logo type (e.g., Modern, Vintage, etc.)
     * - style: logo style (e.g., Minimal, Detailed, etc.)
     * - color: logo color (e.g., Blue, Red, etc.)
     * - direction: additional text direction (optional)
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generate(Request $request)
    {
        $data = $request->validate([
            'prompt'    => 'required|string',
            'type'      => 'required|string',
            'style'     => 'required|string',
            'color'     => 'required|string',
            'direction' => 'nullable|string',
        ]);

         // Build the final prompt.
         $basePrompt = $data['prompt'];
         $type = $data['type'];
         $style = $data['style'];
         $color = $data['color'];
         $direction = isset($data['direction']) && trim($data['direction']) !== '' 
             ? " Direction: " . $data['direction'] 
             : "";
         $finalPrompt = "Logo for {$basePrompt}. Type: {$type}. Style: {$style}. Color: {$color}.{$direction}";
 

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
                'title'   => substr($finalPrompt, 0, 50),
                'type'    => $request->input('conversation_type') ?? null
            ]);
        }

        // Save the user's message.
        Message::create([
            'conversation_id' => $conversation->id,
            'sender'          => 'user',
            'type'            => 'text',
            'content'         => $finalPrompt,
        ]);

       
        $provider = Provider::where('name', 'openai')->first();
        if (!$provider) {
            return response()->json(['error' => 'STABILITY_API_KEY environment variable is not set'], 500);
        }

        $openAiApiKey = $provider->api_key;
        if (!$openAiApiKey) {
            return response()->json(['error' => 'OpenAI API key not set'], 500);
        }

        // Build the payload.
        $payload = [
            "model" => "dall-e-2",
            "prompt" => $finalPrompt,
            "n" => 1,
            "size" => "1024x1024"
        ];

        // Call the OpenAI API.
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => "Bearer {$openAiApiKey}",
        ])->post("https://api.openai.com/v1/images/generations", $payload);

        if (!$response->successful()) {
            return response()->json(['error' => 'Error generating logo, HTTP code ' . $response->status()], $response->status());
        }

        $dataResponse = $response->json();
        // OpenAI API returns a URL inside data array.
        if (!isset($dataResponse['data'][0]['url'])) {
            return response()->json(['error' => 'Unexpected API response'], 500);
        }
        $imageUrl = $dataResponse['data'][0]['url'];

        // Download the generated image.
        $imageResponse = Http::get($imageUrl);
        if (!$imageResponse->successful()) {
            return response()->json(['error' => 'Error downloading generated logo'], 500);
        }
        $logoBase64 = base64_encode($imageResponse->body());

        $assistantMessage = Message::create([
            'conversation_id' => $conversation->id,
            'sender'          => 'assistant',
            'type'            => 'image',
            'content'         => $logoBase64,
        ]);

        if ($assistantMessage) {
            $userSubscription = $subscriber->activeSubscription()->first();
            $userSubscription->decrement('image_limit');
        }


        return response()->json([
            'logo_base64' => $logoBase64,
            'conversation_id' => $conversation->id,
        ]);
    }
}
