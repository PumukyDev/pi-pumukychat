@extends('layouts.app')

@section('title', 'PumukyDev - Chat')

@section('content')
    <h1>Encrypted Chat</h1>

    <!-- Check login status of a user -->
    @if (Route::has('login'))
        <nav>
            @auth
                <div class="center">
                    <p>The chat is not working at the moment, please be patient</p>
                </div>
                <div>
                    <h2>User id:</h2>
                    <ul>
                    @foreach($users as $user)
                        <li>{{ $user->id }}</li>
                    @endforeach
                    </ul>
                </div>
            @else
                <div class="center">
                    <p>Please log in to access the chat features.</p>
                </div>
                </div class="center">
                    <div id="login-register">
                        <button>
                            <a href="{{ route('login') }}">Log in</a>
                        </button>
                        @if (Route::has('register'))
                            <button>
                                <a href="{{ route('register') }}">Register</a>
                            </button>
                        @endif
                    </div>
                </div>
            @endauth
        </nav>
    @endif

@endsection
