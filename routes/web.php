<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmailVerificationController;

Route::get('/email/verify/{id}', [EmailVerificationController::class, 'verify'])
    ->name('email.verify');

Route::get('/{any?}', function () {
    return view('master');
})->where('any', '.*');
