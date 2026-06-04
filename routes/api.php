<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\TaskController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('users')->group(function () {

        Route::get('', [UserController::class, 'index'])
            ->middleware('role:admin');

        Route::post('', [UserController::class, 'store'])
            ->middleware('role:admin,manager');

        Route::get('{id}', [UserController::class, 'show'])
            ->middleware('role:admin');

        Route::patch('{id}', [UserController::class, 'update'])
            ->middleware('role:admin');

        Route::patch('{id}/status', [UserController::class, 'toggleStatus'])
            ->middleware('role:admin');

    });

    Route::prefix('teams')->group(function () {

        Route::get('/', [TeamController::class, 'index'])
            ->middleware('role:admin,manager');

        Route::post('/', [TeamController::class, 'store'])
            ->middleware('role:admin,manager');

        Route::get('/{id}', [TeamController::class, 'show'])
            ->middleware('role:admin,manager');

        Route::post('/{id}/members', [TeamController::class, 'addMember'])
            ->middleware('role:admin,manager');

        Route::delete('/{id}/members/{userId}', [TeamController::class, 'removeMember'])
            ->middleware('role:admin,manager');
    });

    Route::prefix('teams/{team_id}/tasks')->group(function () {

        Route::get('/', [TaskController::class, 'index']);
        Route::post('/', [TaskController::class, 'store']);

    });

    Route::prefix('tasks')->group(function () {
        
        Route::get('/', [TaskController::class, 'all']);

        Route::get('/{id}', [TaskController::class, 'show']);
        Route::patch('/{id}', [TaskController::class, 'update']);
        Route::delete('/{id}', [TaskController::class, 'destroy']);
        Route::patch('/{id}/status', [TaskController::class, 'updateStatus']);
        
        Route::delete('/{id}/archive', [TaskController::class, 'archive']);
    });

});

