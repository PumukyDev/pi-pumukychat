<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class KeyController extends Controller
{
    public function store(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $request->validate([
            'public_key' => 'required|string',
        ]);

        $user->public_key = $request->input('public_key');
        $user->save();

        return response()->json(['message' => 'Public key stored successfully.']);
    }
}
