<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Message;
use App\Models\Provider;
use App\Models\Conversation;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class TTSController extends Controller
{

    public function index()
    {
        return Inertia::render('TextToSpeech');
    }
    public function generateSpeech(Request $request)
    {
        $request->validate([
            'text' => 'required|string|max:300',
            'voice' => 'required|string|in:alloy,echo,fable,onyx,nova,shimmer',
        ]);

        $user = Auth::user();
        $subscriber = Subscription::where('user_id', $user->id)->first();
        if ($subscriber && $subscriber->audio_limit <= 0) {
            return response()->json(['error' => 'Audio limit exceeded'], 200);
        }

        $provider = Provider::where('name', 'openai')->first();
        $openAiApiKey = $provider->api_key;

        

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $openAiApiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/audio/speech', [
            'model' => 'tts-1',
            'input' => $request->text,
            'voice' => $request->voice,
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to generate speech'], 500);
        }

        $fileName = uniqid() . '.mp3';
        $filePath = "tts_speech/$fileName";
        Storage::disk('public')->put($filePath, $response->body());
        
        $user = Auth::user();
        $conversation = Conversation::where('user_id', $user->id)
            ->where('title', 'Text to Speech')
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_id' => $user->id,
                'title' => 'Text to Speech',
                'type'    => $request->input('conversation_type') ?? null
            ]);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender' => 'user',
            'type' => 'text',
            'content' => $request->text,
        ]);

        // Store message
        $assistantMessage = Message::create([
            'conversation_id' => $conversation->id,
            'sender' => 'assistant',
            'type' => 'audio',
            'content' => $filePath, // Store path
        ]);

        if($assistantMessage){
            $subscriber = User::with('plan')->find($user->id);
            $userSubscription = $subscriber->activeSubscription()->first();
            if($userSubscription){
                $userSubscription->decrement('audio_limit');
            }
        }



        return response()->json([
            'message' => 'Speech generated successfully',
            'conversation_id' => $conversation->id,
            'audio_url' => asset("storage/$filePath"),
        ]);
    }
}
