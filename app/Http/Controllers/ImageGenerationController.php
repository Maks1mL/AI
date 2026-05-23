<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Models\Message;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ImageGenerationController extends Controller
{
    public function index()
    {
        $imageModels = [
            ['id' => 'dall-e-3',            'provider' => 'openaiImage', 'name' => 'DALL‑E‑3'],
            ['id' => 'dall-e-2',            'provider' => 'openaiImage', 'name' => 'DALL‑E‑2'],
            ['id' => 'stable-diffusion-xl', 'provider' => 'stability',   'name' => 'Stable Diffusion XL'],
            ['id' => 'flux.1-schnell',      'provider' => 'flux',        'name' => 'Flux.1 Schnell'],
        ];

        return Inertia::render('ImageGenerate', [
            'imageModels' => $imageModels,
        ]);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'model'  => 'required|string',
            'prompt' => 'required|string',
            'conversation_id' => 'sometimes|nullable|integer',
        ]);
        // Check if user is authenticated
    
        $user = Auth::user();
        $subscriber = User::with('plan')->find($user->id);
        $model  = $request->input('model');
        $prompt = $request->input('prompt');

        $imageModels = ['dall-e-3', 'dall-e-2', 'stable-diffusion-xl', 'flux.1-schnell'];
        if (!in_array($model, $imageModels)) {
            return response()->json(['error' => 'Invalid image model'], 400);
        }

        if (!$subscriber->activeSubscription()->exists()) {
            return response()->json(['error' => 'No active subscription'], 400);
        }

        $subscription = $subscriber->activeSubscription()->first();
        $startPeriod = $subscription->starts_at;
        $endPeriod = $subscription->ends_at;

        $imageCount = Message::whereHas('conversation', function ($q) use ($user, $startPeriod, $endPeriod) {
            $q->where('user_id', $user->id)
                ->whereBetween('created_at', [$startPeriod, $endPeriod]);
        })->where('sender', 'assistant')->where('type', 'image')->count();

        if ($imageCount >= $subscription->image_limit) {
            return response()->json(['error' => 'Image limit exceeded'], 200);
        }

        // Conversation
        $conversation = $request->filled('conversation_id')
            ? Conversation::where('user_id', $subscriber->id)->find($request->input('conversation_id'))
            : Conversation::create([
                'user_id' => $subscriber->id,
                'title'   => substr($prompt, 0, 50),
                'type'    => 'image'
            ]);

        // Save user prompt
        Message::create([
            'conversation_id' => $conversation->id,
            'sender'          => 'user',
            'type'            => 'text',
            'content'         => $prompt,
        ]);

        // Get provider
        $providerMap = [
            'dall-e-3' => 'openaiImage',
            'dall-e-2' => 'openaiImage',
            'stable-diffusion-xl' => 'stability',
            'flux.1-schnell' => 'flux'
        ];
        $providerKey = $providerMap[$model];
        $provider = Provider::where('name', $providerKey)->first();
        if (!$provider) {
            return response()->json(['error' => 'Provider not found'], 500);
        }

        // Payload logic
        switch ($model) {
            case 'dall-e-3':
            case 'dall-e-2':
                $payload = [
                    'prompt' => $prompt,
                    'model'  => $model,
                    'n'      => 1,
                    'size'   => '1024x1024',
                    'response_format' => 'b64_json',
                ];
                break;
            case 'stable-diffusion-xl':
                $payload = [
                    "model" => "stabilityai/stable-diffusion-xl-base-1.0",
                    "prompt" => $prompt,
                    "height" => 1024,
                    "width" => 1024,
                    "steps" => 50,
                    "n" => 1,
                    "seed" => 5843,
                    "response_format" => "b64_json"
                ];
                break;
            case 'flux.1-schnell':
                $payload = [
                    'prompt' => $prompt,
                    'model'  => "black-forest-labs/FLUX.1-schnell",
                    'n'      => 1,
                    'size'   => '1024x1024',
                    'response_format' => 'b64_json'
                ];
                break;
        }

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$provider->api_key}",
            'Content-Type'  => 'application/json'
        ])->post($provider->url, $payload);

        if ($response->successful()) {
            $data = $response->json();
            $imageBase64 = $data['data'][0]['b64_json'] ?? null;

            if (!$imageBase64) {
                return response()->json(['error' => 'Image not generated'], 500);
            }

            Message::create([
                'conversation_id' => $conversation->id,
                'sender' => 'assistant',
                'type' => 'image',
                'content' => $imageBase64,
            ]);

            $subscription->decrement('image_limit');

            return response()->json([
                'image_base64' => $imageBase64,
                'conversation_id' => $conversation->id,
            ]);
        }

        return response()->json(['error' => 'Failed to generate image'], 500);
    }
}
