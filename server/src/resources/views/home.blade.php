@extends('layouts.app')

@section('title', 'PumukyDev - Página Principal')

@section('content')
    <h1>My Projects</h1>

    <div class="projects">
        <!-- Proyecto: Dotfiles -->
        <div class="project-card" onclick="window.location.href='https://github.com/PumukyDev/PumuArch'">
            <h3>Dotfiles</h3>
            <p>Arch Linux dotfiles with Qtile WM</p>
            <ul class="features">
                <li>Includes alacritty, bash, dunst, fish, kitty, picom, and rofi custom configurations</li>
                <li>Organized to facilitate automation with Stow</li>
            </ul>
            <div class="tags">
                <span class="tag">Python</span>
                <span class="tag">Shell</span>
            </div>
        </div>

        <!-- Proyecto: HashArt -->
        <div class="project-card" onclick="window.location.href='https://github.com/PumukyDev/HashArt'">
            <h3>HashArt</h3>
            <p>Program to write words and phrases into hashes</p>
            <ul class="features">
                <li>Developed a script that converts each letter of a word or phrase into its corresponding hash representation</li>
                <li>Provides a simple way to create code-like art for creative purposes or to embed in projects</li>
            </ul>
            <div class="tags">
                <span class="tag">Python</span>
            </div>
        </div>

        <!-- Proyecto: URL Shortener -->
        <div class="project-card" onclick="window.location.href='https://github.com/PumukyDev/web-server/tree/main/htdocs/shortener'">
            <h3>URL Shortener</h3>
            <p>A simple tool to shorten URLs for easier sharing and tracking</p>
            <ul class="features">
                <li>Generates short URLs from long links by hashing them and uploading both URL to IONOS txt records</li>
                <li>You can use it in an easy way on this page</li>
            </ul>
            <div class="tags">
                <span class="tag">HTML</span>
                <span class="tag">PHP</span>
                <span class="tag">Bash</span>
            </div>
        </div>

        <!-- Proyecto: Web Monitoring -->
        <div class="project-card" onclick="window.location.href='https://github.com/PumukyDev/web-server/tree/main/config/monitoring'">
            <h3>Web Monitoring</h3>
            <p>Setup for monitoring web server performance and metrics</p>
            <ul class="features">
                <li>Configured Apache Exporter to collect server performance metrics such as request count, response time, and server status</li>
                <li>Used Prometheus to scrape metrics from Apache Exporter</li>
                <li>Created Grafana dashboards to visualize the data and monitor the server's health in real-time</li>
            </ul>
            <div class="tags">
                <span class="tag">Grafana</span>
                <span class="tag">Prometheus</span>
                <span class="tag">Apache</span>
            </div>
        </div>
    </div>
@endsection
