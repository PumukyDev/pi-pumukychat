@extends('layouts.app')

@section('title', 'PumukyDev - Chat')

@section('content')
    <h1>Encrypted Chat</h1>

    <!-- Check login status of a user -->
    @if (Route::has('login'))
        <nav>
            @auth
                <p>The chat is not working at the moment, please be patient</p>
            @else
                <a href="{{ route('login') }}">Log in</a>

                @if (Route::has('register'))
                    <a href="{{ route('register') }}">Register</a>
                @endif
            @endauth
        </nav>
    @endif

@endsection
