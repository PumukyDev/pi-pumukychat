<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShortenedUrl extends Model
{
    // Table name
    protected $table = 'url_shortener';

    // Columns
    protected $fillable = ['original_url', 'shortened_url'];

    // Function to generate the short URL
    public static function generateShortenedUrl($originalUrl)
    {
        // Create a hash
        $shortenedUrl = substr(hash('sha256', $originalUrl), 0, 6);

        // Save it in the database
        return self::create([
            'original_url' => $originalUrl,
            'shortened_url' => $shortenedUrl
        ]);
    }
}
