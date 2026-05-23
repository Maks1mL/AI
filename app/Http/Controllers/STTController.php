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

class STTController extends Controller
{
    public function index()
    {
        return Inertia::render('STTGenerate');
    }

    public function transcribeAudio(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:mp3,webm,ogg'
        ]);
        
        $user = Auth::user();
        $subscriber = Subscription::where('user_id', $user->id)->first();
        if ($subscriber && $subscriber->audio_limit <= 0) {
            return response()->json(['error' => 'Audio limit exceeded'], 200);
        }

        $provider = Provider::where('name', 'openai')->first();
        $openAiApiKey = $provider->api_key;

        $filePath = $request->file('file')->store('speech_uploads', 'public');

        //store the original audio
        $originalAudio = $request->file('file');
        $originalAudioPath = 'uploads/audio_transcribed_' . time() . '.' . $originalAudio->getClientOriginalExtension();
        Storage::disk('public')->put($originalAudioPath, file_get_contents($originalAudio));

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $openAiApiKey,
        ])->attach('file', Storage::disk('public')->get($filePath), basename($filePath))
          ->post('https://api.openai.com/v1/audio/transcriptions', [
              'model' => 'whisper-1',
              'response_format' => 'text',
          ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to transcribe audio'], 500);
        }

        $user = Auth::user();
        $conversation = Conversation::firstOrCreate([
            'user_id' => $user->id,
            'title' => 'Speech to Text',
            'type'    => $request->input('conversation_type') ?? null
        ]);

        if (!$conversation) {
            return response()->json(['error' => 'Failed to create conversation'], 500);
        }
        
        Message::create([
            'conversation_id' => $conversation->id,
            'sender' => 'user',
            'type' => 'audio',
            'content' => 'Transcribe audio',
            'filePath' => $originalAudioPath,
        ]);

        $assistantMessage = Message::create([
            'conversation_id' => $conversation->id,
            'sender' => 'assistant',
            'type' => 'audio',
            'content' => $response->body(),
        ]);

        if($assistantMessage){
            $subscriber = User::with('plan')->find($user->id);
            $userSubscription = $subscriber->activeSubscription()->first();
            if($userSubscription){
                $userSubscription->decrement('audio_limit');
            }
        }

        return response()->json([
            'message' => 'Transcription successful',
            'conversation_id' => $conversation->id,
            'transcription' => $response->body(),
            'audio_url' => asset("storage/$filePath"),
        ]);
    }
}
