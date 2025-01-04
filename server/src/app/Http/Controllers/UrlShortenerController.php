<?php

namespace App\Http\Controllers;

use App\Models\ShortenedUrl;
use Illuminate\Http\Request;

class UrlShortenerController extends Controller
{
    // Show the form to input the long URL
    public function index()
    {
        return view('shortener');  // Show the view with the form
    }

    // Handle form submission and generate shortened URL
    public function store(Request $request)
    {
        // Validate the incoming request to ensure the URL is valid
        $request->validate([
            'long_url' => 'required|url',  // Ensure the URL is valid
        ]);

        // Generate the shortened URL using the model's method
        $shortenedUrl = ShortenedUrl::generateShortenedUrl($request->input('long_url'));

        // Return the view with the shortened URL data
        return view('shortener', ['shortenedUrl' => $shortenedUrl]);
    }
}
