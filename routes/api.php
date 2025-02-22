<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserAuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\EventRegistrationController;
use App\Http\Controllers\Api\UserEventController;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('register', [UserAuthController::class, 'register']);
        Route::post('login', [UserAuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [UserAuthController::class, 'logout']);
            Route::post('refresh-token', [UserAuthController::class, 'refresh']);
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('events', EventController::class);
        Route::apiResource('event-registrations', EventRegistrationController::class);
        Route::get('users-with-events', [UserEventController::class, 'index']);
    });
});
