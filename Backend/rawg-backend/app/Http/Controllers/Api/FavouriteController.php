<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favourite;
use Illuminate\Http\Request;
use App\Models\Game;

class FavouriteController extends Controller
{
    public function index(Request $request) {
        $favourites = $request->user()->favouriteGames;

        return response()->json($favourites);
    }

    public function store(Request $request) {
        $request->validate([
            'rawg_id' => 'required|integer',
            'name' => 'required|string',
            'slug' => 'required|string',
            'background_image' => 'nullable|string',
            'rating' => 'nullable|numeric',
            'released' => 'nullable|date',
            'platforms' => 'nullable|array',
            'genres' => 'nullable|array',
        ]);

        $game = Game::firstOrCreate(
            ['rawg_id' => $request->rawg_id],
            [
                'name' => $request->name,
                'slug' => $request->slug,
                'description' => $request->description,
                'background_image' => $request->background_image,
                'rating' => $request->rating,
                'released' => $request->released,
                'platforms' => $request->platforms,
                'genres' => $request->genres,
            ]
        );

        $exists = Favourite::where('user_id', $request->user()->id)
            ->where('game_id', $game->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'status' => 'Game already in favourites',
            ], 409);
        }

        Favourite::create([
            'user_id' => $request->user()->id,
            'game_id' => $game->id,
        ]);

        return response()->json([
            'status'=> 'Game has been added to favourites',
        ], 201);
    }

    public function destroy(Request $request, $rawgId) {
        $game = Game::where('rawg_id', $rawgId) -> first();

        if(!$game) {
            return response()->json([
                'status'=> 'Game not found',
            ], 404);
        }

        $deleted = Favourite::where('user_id', $request->user()->id) 
            -> where('game_id', $game->id) 
            -> delete();

        if ($deleted) {
            return response()->json([
                'status'=> 'Favourite was not found',
            ], 404);
        }

        return response() -> json([
            'status'=> 'Game removed from favourites',
        ]);
    }
}
