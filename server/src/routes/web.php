<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UrlShortenerController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
});

Route::get('/chat', function () {
    return view('chat');
})->name('chat');;

//Route::get('/dashboard', function () {
//    return view('dashboard');
//})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::get('/shortener', [UrlShortenerController::class, 'index']);
Route::post('/shortener', [UrlShortenerController::class, 'store']);
Route::get('/{shortened_url}', [UrlShortenerController::class, 'redirectToOriginal'])->where('shortened_url', '.*');

Route::fallback(function () {
    return view('errors.404');
});
