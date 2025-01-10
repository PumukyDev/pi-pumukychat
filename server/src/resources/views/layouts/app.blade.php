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

    <!-- Remove default html style to make page to look the same in different browsers -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/taks-custom-base-css/taks-custom-base.css">

    <!-- Load "Inter" font-family -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

    <!-- Cargar estilos y scripts con Vite -->
    @vite([
        'resources/css/main.css',
        'resources/css/light.css',
        'resources/js/particles.js',
        'resources/js/check_scroll.js',
    ])

            <!--'resources/css/dark.css',-->

</head>
<body>
    <canvas id="particleCanvas"></canvas>

    @include('layouts.header') <!-- Header Section -->

    <!-- Main Content -->
    <main>
        @yield('content')
    </main>

    @include('layouts.footer') <!-- Footer Section -->
</body>
</html>
