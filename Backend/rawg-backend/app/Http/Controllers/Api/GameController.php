<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Game;

class GameController extends Controller
{
    public function index (Request $request) {
        $query = Game::query();

        // search feature using name
        if ($request -> has('search') && $request -> search) {
            $query -> where('name', 'like', '%' . $request -> search . '%');
        }

        // filter using genre
        if ($request -> has('genres') && $request -> genres) {
            $query -> whereJsonContains('genres', ['slug' => $request -> genres]);
        }

        // filter using platform id
        if ($request ->has('platforms') && $request -> platforms) {
            $query -> whereJsonContains('platforms', [
                'platform' => ['id' => (int) $request -> platforms]
            ]);
        }

        $query -> orderBy('rating', 'desc');

        $pageSize = $request -> get('page_size', 20);
        $games = $query -> paginate($pageSize);

        return response() -> json ([
            'count' => $games -> total(),
            'next' => $games -> nextPageUrl(),
            'previous' => $games -> previousPageUrl(),
            'results' => $games -> items(),
        ]);
    }

    public function show($id) {
        $game = Game::where('slug', $id)
            ->orWhere('rawg_id', $id)
            ->first();
        
        if (!$game) {
            return response() -> json([
                'status' => 'Game does not exist!',
            ], 404);
        }

        return response()->json([
            'id' => $game->rawg_id,
            'slug' => $game->slug,
            'name' => $game->name,
            'description_raw' => $game->description,
            'background_image' => $game->background_image,
            'rating' => $game->rating,
            'released' => $game->released,
            'platforms' => $game->platforms,
            'genres' => $game->genres,
            'metacritic' => null,
        ]);
    }

    public function screenshots($id) {
        $game = Game::where('slug', $id)
            ->orWhere('rawg_id', $id)
            ->first();

        if (!$game) {
            return response()->json([
                'status' => 'Game not found',
            ], 404);
        }

        return response()->json([
            'results' => $game->screenshots ?? [],
        ]);
    }

    public function genres() {
        $genres = Game::whereNotNull('genres')
            ->get()
            ->pluck('genres')
            ->flatten(1)
            ->unique('id')
            ->values();

        return response()->json([
            'results' => $genres,
        ]);
    }

    public function platforms() {
        $platforms = Game::whereNotNull('platforms')
            ->get()
            ->pluck('platforms')
            ->flatten(1)
            ->map(fn($p) => $p['platform'] ?? $p)
            ->unique('id')
            ->values();

        return response()->json([
            'results' => $platforms,
        ]);
    }
}
