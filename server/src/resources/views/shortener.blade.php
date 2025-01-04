@extends('layouts.app')

@section('title', 'PumukyDev - Página Principal')

@section('content')
    <h1>URL shortener</h1>
    <div id="url-shortener">
        <form action="/shortener" method="POST">
            @csrf
            <label for="long_url">URL to shorten:</label>
            <input type="url" id="long_url" name="long_url" required>
            <button type="submit">Shorten</button>
        </form>

        @if(isset($shortenedUrl))
            <span><b>Shortened URL: </b><a href="https://pumukydev.com/{{ $shortenedUrl->shortened_url }}" target="_blank"> https://pumukydev.com/{{ $shortenedUrl->shortened_url }}</a></span>
        @endif
    </div>

@endsection
