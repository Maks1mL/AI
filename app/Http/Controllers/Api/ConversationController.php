<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    // GET /conversations
    public function index(Request $request)
    {
        // Optionally filter by authenticated user.
        $user = Auth::user();
        $conversations = Conversation::where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->where('status', 'true')
            ->get();
        return response()->json(['conversations' => $conversations]);
    }

    // GET /conversations/{id}
    public function show(Request $request, $id)
    {
        $conversation = Conversation::with('messages')
            ->where('user_id', Auth::user()->id)
            ->where('status', 'true')
            ->findOrFail($id);
        $conversation->messages = $conversation->messages->sortBy('created_at')->values();
        return response()->json(['messages' => $conversation->messages]);
    }

    // POST /conversations
    public function store(Request $request)
    {
        $data = $request->validate([
            'prompt' => 'required|string',
        ]);

        $conversation = Conversation::create([
            'user_id' => Auth::user()->id,
            'title'   => substr($data['prompt'], 0, 50),
            'type'    => $request->input('conversation_type') ?? null
        ]);

        $conversation->messages()->create([
            'sender'  => 'user',
            'type'    => 'text',
            'content' => $data['prompt'],
        ]);

        return response()->json(['conversation' => $conversation], 201);
    }

    public function softDelete($id)
    {
        $conversation = Conversation::find($id);
        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        //delete all messages in the conversation
        $conversation->messages()->delete();
        $conversation->delete();

        return response()->json(['message' => 'Conversation deleted successfully']);
    }
}
