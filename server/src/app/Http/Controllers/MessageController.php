<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function showForm($id)
    {
        // Get the recipient's data
        $recipient = User::findOrFail($id);

        // Pass the public key to the frontend
        return view('message-form', [
            'recipient' => $recipient,
        ]);
    }

    public function storeMessage(Request $request, $id)
    {
        // Validate the incoming request
        $request->validate([
            'message' => 'required|string',
        ]);

        // Save the encrypted message
        DB::table('messages')->insert([
            'sender_id' => \Illuminate\Support\Facades\Auth::user()->id,
            'recipient_id' => $id,
            'message' => $request->input('message'), // The encrypted message from the frontend
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('chat')->with('success', 'Message sent successfully!');
    }
}
