<?php

// app/Http/Controllers/UserListController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserListController extends Controller
{
    public function showUsers()
    {
        $users = User::all();
        return view('chat', compact('users'));
    }
}
