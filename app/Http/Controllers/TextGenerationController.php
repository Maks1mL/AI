<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Plan;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Message;
use App\Models\Provider;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class TextGenerationController extends Controller
{
    public function index()
    {


        // ['id' => 'gpt-3.5-turbo-0125', 'provider' => 'openai', 'name' => 'OpenAI GPT-3.5 Turbo'],
        // ['id' => 'gpt-4o',            'provider' => 'openai', 'name' => 'OpenAI GPT-4o'],
        // ['id' => 'gpt-4o-mini',       'provider' => 'openai', 'name' => 'OpenAI GPT-4o-mini'],

        // ['id' => 'dall-e-3',            'provider' => 'openaiImage',   'name' => 'DALL‑E‑3'],
        // ['id' => 'dall-e-2',            'provider' => 'openaiImage',   'name' => 'DALL‑E‑2'],


        // Define text generation models
        $textModels = [
            ['id' => 'claude-3-5-sonnet-20241022', 'provider' => 'claude', 'name' => 'Claude 3.5 Sonnet'],
            ['id' => 'claude-3-5-haiku-20241022',    'provider' => 'claude', 'name' => 'Claude 3.5 Haiku'],
            ['id' => 'claude-3-opus-20240229',         'provider' => 'claude', 'name' => 'Claude 3 Opus'],
            ['id' => 'llama-3.3-70b-versatile', 'provider' => 'groq', 'name' => 'LLaMA 3.3 70B Versatile'],
            ['id' => 'mixtral-8x7b-32768',        'provider' => 'groq', 'name' => 'Mixtral 8x7b'],
            ['id' => 'deepseek/deepseek-r1', 'provider' => 'deepseek', 'name' => 'DeepSeek R1'],
            ['id' => 'deepseek/deepseek-chat', 'provider' => 'deepseek', 'name' => 'DeepSeek V3'],
            ['id' => 'google/gemini-2.0-flash-thinking-exp:free', 'provider' => 'gemini', 'name' => 'Gemini 2.0 Flash'],
        ];

        // Define image generation models
        $imageModels = [
            ['id' => 'stable-diffusion-xl', 'provider' => 'stability','name' => 'Stable Diffusion XL'],
            ['id' => 'flux.1-schnell',      'provider' => 'flux',     'name' => 'Flux.1 Schnell'],
        ];

        return Inertia::render('Generate', [
            'textModels'  => $textModels,
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

        $user = Auth::user();
        $subscriber = User::with('plan')->find($user->id);
        $model  = $request->input('model');
        $prompt = $request->input('prompt');

        // Determine if the request is for image generation.
        $imageModelsList = ['dall-e-3', 'dall-e-2', 'stable-diffusion-xl', 'flux.1-schnell'];
        $isImage = in_array($model, $imageModelsList);
        $isChat  = !$isImage;

        // Determine usage limits and select a plan.
        if ($subscriber->activeSubscription()->exists()) {
            $subscription = $subscriber->activeSubscription()->first();
            $startPeriod = $subscription->starts_at;
            $endPeriod = $subscription->ends_at;
        } else {
            return response()->json(['error' => 'No active subscription'], 400);
        }

        $chatCount = Message::whereHas('conversation', function ($q) use ($user, $startPeriod, $endPeriod) {
            $q->where('user_id', $user->id)
              ->whereBetween('created_at', [$startPeriod, $endPeriod]);
        })
        ->where('sender', 'assistant')
        ->where('type', 'text')
        ->count();

        $imageCount = Message::whereHas('conversation', function ($q) use ($user, $startPeriod, $endPeriod) {
            $q->where('user_id', $user->id)
              ->whereBetween('created_at', [$startPeriod, $endPeriod]);
        })
        ->where('sender', 'assistant')
        ->where('type', 'image')
        ->count();

        if ($isChat && $chatCount >= $subscription->chat_limit) {
            return response()->json(['error' => 'Chat limit exceeded'], 200);
        }
        if ($isImage && $imageCount >= $subscription->image_limit) {
            return response()->json(['error' => 'Image limit exceeded'], 200);
        }

        // Retrieve or create a conversation.
        $conversation = null;
        if ($request->filled('conversation_id')) {
            $conversation = \App\Models\Conversation::where('user_id', $subscriber->id)
                ->find($request->input('conversation_id'));
        }
        if (!$conversation) {
            $conversation = \App\Models\Conversation::create([
                'user_id' => $subscriber->id,
                'title'   => substr($prompt, 0, 50),
                'type'    => $request->input('conversation_type') ?? null
            ]);
        }

        // Save the user's message.
        Message::create([
            'conversation_id' => $conversation->id,
            'sender'          => 'user',
            'type'            => 'text',
            'content'         => $prompt,
        ]);

        // Determine which model is selected and then look up its provider record dynamically.
        if ($isImage) {
            $selectedModel = collect([
                ['id' => 'dall-e-3', 'provider' => 'openaiImage'],
                ['id' => 'dall-e-2', 'provider' => 'openaiImage'],
                ['id' => 'stable-diffusion-xl', 'provider' => 'stability'],
                ['id' => 'flux.1-schnell', 'provider' => 'flux'],
            ])->firstWhere('id', $model);
        } else {
            $selectedModel = collect([
                ['id' => 'gpt-3.5-turbo-0125', 'provider' => 'openai'],
                ['id' => 'gpt-4o',            'provider' => 'openai'],
                ['id' => 'gpt-4o-mini',       'provider' => 'openai'],
                ['id' => 'claude-3-5-sonnet-20241022', 'provider' => 'claude'],
                ['id' => 'claude-3-5-haiku-20241022',    'provider' => 'claude'],
                ['id' => 'claude-3-opus-20240229',         'provider' => 'claude'],
                ['id' => 'llama-3.3-70b-versatile', 'provider' => 'groq'],
                ['id' => 'mixtral-8x7b-32768',        'provider' => 'groq'],
                ['id' => 'deepseek/deepseek-r1', 'provider' => 'deepseek'],
                ['id' => 'deepseek/deepseek-chat', 'provider' => 'deepseek'],
                ['id' => 'google/gemini-2.0-flash-thinking-exp:free', 'provider' => 'gemini'],
            ])->firstWhere('id', $model);
        }

        if (!$selectedModel) {
            return response()->json(['error' => 'Invalid model selected'], 400);
        }

        // Look up the provider record from the database based on the provider key.
        $providerRecord = Provider::where('name', $selectedModel['provider'])->first();
        if (!$providerRecord) {
            return response()->json(['error' => 'Provider configuration not found'], 500);
        }
        $url = $providerRecord->url;
        $secret = $providerRecord->api_key;

        // Branch based on whether it's image or text generation.
        if ($isImage) {
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
                    $response = Http::withHeaders([
                        'Authorization' => "Bearer $secret",
                        'Content-Type'  => 'application/json',
                    ])->post($url, $payload);
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
                    $response = Http::withHeaders([
                        'Authorization' => "Bearer $secret",
                        'Content-Type'  => 'application/json'
                    ])->post($url, $payload);
                    break;
                case 'flux.1-schnell':
                    $payload = [
                        'prompt' => $prompt,
                        'model'  => "black-forest-labs/FLUX.1-schnell",
                        'n'      => 1,
                        'size'   => '1024x1024',
                        'response_format' => 'b64_json'
                    ];
                    
                    $response = Http::withHeaders([
                        'Authorization' => "Bearer $secret",
                        'Content-Type'  => 'application/json',
                    ])->post($url, $payload);
                    break;
                default:
                    return response()->json(['error' => 'Invalid image model selected'], 400);
            }

            if ($response->successful()) {
                $data = $response->json();
                $image_base64 = $data['data'][0]['b64_json'] ?? null;
                if ($image_base64) {
                    $assistantMessage =  Message::create([
                        'conversation_id' => $conversation->id,
                        'sender'          => 'assistant',
                        'type'            => 'image',
                        'content'         => $image_base64,
                    ]);
        
                    if ($assistantMessage) {
                        $userSubscription = $subscriber->activeSubscription()->first();
                        if ($isChat) {
                            $userSubscription->decrement('chat_limit');
                        } else {
                            $userSubscription->decrement('image_limit');
                        }
                    }
                    return response()->json([
                        'image_base64'    => $image_base64,
                        'conversation_id' => $conversation->id,
                    ]);
                } else {
                    return response()->json(['error' => 'No image generated.'], 500);
                }
            } else {
                return response()->json(['error' => 'Error generating image'], 500);
            }
        } else {
            // For text generation, branch based on the provider.
            switch ($selectedModel['provider']) {
                case 'openai':
                    $payload = [
                        'model' => $model,
                        'messages' => [
                            ['role' => 'user', 'content' => $prompt],
                        ]
                    ];
                    $response = Http::withHeaders([
                        'Authorization' => "Bearer $secret",
                        'Content-Type'  => 'application/json',
                    ])->post($url, $payload);
                    if ($response->successful()) {
                        $data = $response->json();
                        $responseText = trim($data['choices'][0]['message']['content'] ?? 'No caption generated.');
                    } else {
                        return response()->json(['error' => 'Error generating text with OpenAI'], 500);
                    }
                    break;
                case 'claude':
                    $payload = [
                        "model" => "claude-3-5-sonnet-20241022",
                        "max_tokens" => 1024,
                        "messages" => [
                            ["role" => "user", "content" => $prompt]
                        ]
                    ];
                    $response = Http::withHeaders([
                        'x-api-key'    => $secret,
                        'Content-Type' => 'application/json',
                        'anthropic-version' => '2023-06-01',
                    ])->post($url, $payload);
                    if ($response->successful()) {
                        $data = $response->json();
                        $responseText = $data['content'][0]['text'] ?? 'No caption generated.';
                    } else {
                        return response()->json(['error' => 'Error generating text with Anthropic Claude'], 500);
                    }
                    break;
                case 'groq':
                    $payload = [
                        'model' => $model,
                        'messages' => [
                            ['role' => 'user', 'content' => $prompt],
                        ],
                    ];
                    $response = Http::withHeaders([
                        'Authorization' => "Bearer $secret",
                        'Content-Type'  => 'application/json',
                    ])->post($url, $payload);
                    if ($response->successful()) {
                        $data = $response->json();
                        $responseText = trim($data['choices'][0]['message']['content'] ?? 'No caption generated.');
                    } else {
                        return response()->json(['error' => 'Error generating text with LLaMA/Groq'], 500);
                    }
                    break;
                case 'deepseek':
                    $payload = [
                        'model' => $model,
                        'messages' => [
                            ['role' => 'user', 'content' => $prompt],
                        ],
                    ];
                    $response = Http::withHeaders([
                        'Authorization' => "Bearer $secret",
                        'Content-Type'  => 'application/json',
                    ])->post($url, $payload);
                    if ($response->successful()) {
                        $data = $response->json();
                        $responseText = trim($data['choices'][0]['message']['content'] ?? 'No caption generated.');
                    } else {
                        return response()->json(['error' => 'Error generating text with DeepSeek'], 500);
                    }
                    break;
                case 'gemini':
                    $payload = [
                        'model' => $model,
                        'messages' => [
                            ['role' => 'user', 'content' => $prompt],
                        ],
                    ];
                    $response = Http::withHeaders([
                        'Authorization' => "Bearer $secret",
                        'Content-Type'  => 'application/json',
                    ])->post($url, $payload);
                    if ($response->successful()) {
                        $data = $response->json();
                        $responseText = trim($data['choices'][0]['message']['content'] ?? 'No caption generated.');
                    } else {
                        return response()->json(['error' => 'Error generating text with Gemini'], 500);
                    }
                    break;
                default:
                    return response()->json(['error' => 'Invalid model selected'], 400);
            }
            
            // Save the assistant message as text.
           $assistantMessage =  Message::create([
                'conversation_id' => $conversation->id,
                'sender'          => 'assistant',
                'type'            => 'text',
                'content'         => $responseText,
            ]);

            if ($assistantMessage) {
                $userSubscription = $subscriber->activeSubscription()->first();
                if ($isChat) {
                    $userSubscription->decrement('chat_limit');
                } else {
                    $userSubscription->decrement('image_limit');
                }
            }

            return response()->json([
                'text'            => $responseText,
                'conversation_id' => $conversation->id,
            ]);
        }
    }
}
