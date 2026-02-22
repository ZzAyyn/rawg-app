<?php

use App\Http\Controllers\Api\FavouriteController;
use App\Http\Controllers\Api\GameController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReviewController;

Route::post('/register', [AuthController::class,'register']);
Route::post('/login', [AuthController::class,'login']);


Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{id}', [GameController::class, 'show']);
Route::get('/games/{id}/screenshots', [GameController::class, 'screenshots']);
Route::get('/genres', [GameController::class, 'genres']);
Route::get('/platforms', [GameController::class, 'platforms']);

Route::get('/games/{gameId}/reviews', [ReviewController::class,'index']);
Route::get('/reviews/{id}', [ReviewController::class,'show']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/logout', [AuthController::class,'logout']);
    Route::get('/user', [AuthController::class,'user']);

    Route::get('/profile', [ProfileController::class,'show']);
    Route::post('/profile', [ProfileController::class,'store']);
    Route::delete('/profile', [ProfileController::class,'destroy']);

    Route::get('/favourites', [FavouriteController::class, 'index']);
    Route::post('/favourites', [FavouriteController::class, 'store']);
    Route::delete('/favourites/{rawgId}', [FavouriteController::class, 'destroy']);

    Route::get('/my-reviews', [ReviewController::class,'myReviews']);
    Route::post('/reviews', [ReviewController::class,'store']);
    Route::put('/reviews/{id}', [ReviewController::class,'update']);
    Route::delete('/reviews/{id}', [ReviewController::class,'destroy']);
});



