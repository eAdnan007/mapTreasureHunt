<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::group(['middleware' => ['web']], function () {

    Route::get('/', function () {
        return view('home');
    })->name('home');

    Route::get('game', function () {
        return view('game');
    })->name('game');

    Route::get('ranklist', function () {
        return view('ranklist');
    })->name('ranklist');

    Route::get('help', function () {
        return view('help');
    })->name('help');

    Route::auth();
});
