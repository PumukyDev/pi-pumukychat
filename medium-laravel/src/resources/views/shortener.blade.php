@extends('layouts.app')

@section('title', 'PumukyDev - Página Principal')

@section('content')
    <h1>URL shortener</h1>
    <div id="url-shortener">
        <form action="index.php" method="POST">
            <label for="long_url">URL to shorten:</label>
            <input type="url" id="long_url" name="long_url" required/>
            <button type="submit">Shorten</button>
        </form>

        <?php if (isset($message)) { ?>
            <div class="message"><?= $message; ?></div>
        <?php } ?>
    </div>

@endsection
