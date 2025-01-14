<?php

// app/Http/Controllers/UserListController.php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class UserListController extends Controller
{
    public function index()
    {
        // Get users and messages
        $users = User::all();
        $messages = Message::where('recipient_id', Auth::id())->get();

        // Send users and messages to the view (chat)
        return view('chat', compact('users', 'messages'));
    }
}
