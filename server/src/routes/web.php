<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UrlShortenerController;
use App\Http\Controllers\UserListController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;

Route::get('/', function () {
    return view('home');
});

Route::get('/c', function () {
    return view('welcome');
});


Route::get('/chat2', function () {
    event(new \App\Events\PublicMessage());
    dd('Public event executed successfully');
});

Route::get('/private-chat', function () {
    event(new \App\Events\PrivateMessage(\Illuminate\Support\Facades\Auth::user()));
    dd('Private event executed successfully');
});


Route::get('/chat', [UserListController::class, 'index'])->middleware('auth')->name('chat');
Route::get('/message/{id}', [MessageController::class, 'showForm'])->name('message.form');
Route::post('/message/{id}', [MessageController::class, 'storeMessage'])->name('message.store');


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
