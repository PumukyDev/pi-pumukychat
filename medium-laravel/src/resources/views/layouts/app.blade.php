<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Page Title -->
    <title>@yield('title', 'PumukyDev - Página Principal')</title>

    <!-- Favicon -->
    <link rel="icon" href="{{ asset('images/favicon.png') }}">

    <!-- Cargar estilos y scripts con Vite -->
    @vite([
        'resources/css/main.css',
        'resources/css/light.css',
        'resources/css/dark.css',
        'resources/js/particles.js',
        'resources/js/check_scroll.js'
    ])

</head>
<body>
    @include('layouts.header') <!-- Header Section -->

    <!-- Main Content -->
    <main>
        @yield('content')
    </main>

    @include('layouts.footer') <!-- Footer Section -->
</body>
</html>
