<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RawgService;
use Illuminate\Http\Request;

class GameController extends Controller
{
    protected $rawgService;

    public function __construct(RawgService $rawgService) {
        $this->rawgService = $rawgService;
    }

    public function index(Request $request) {
        $games = $this->rawgService->getGames(
            page: $request->get("page",1),
            pageSize: $request->get('page_size', 20), 
            search: $request->get('search'),
            ordering: $request->get('ordering'),
        );

        if (!$games) {
            return response()->json ([
                'status' => 'error - Failed to fetch games',
            ], 500);
        }

        return response()->json($games);
    }

    public function show($id) {
        $game = $this->rawgService->getGame($id);

        if (!$game) {
            return response()->json([
                'status'=> 'Game does not exist!',
            ], 404);
        }
        return response()->json($game);
    }

    public function screenshots($id) {
        $screenshots = $this->rawgService->getGameScreenshots($id);
        if(!$screenshots) {
            return response()->json([
                'status'=> 'Game screenshots cannot be fetched or is unavailable',
            ], 404);
        }

        return response()->json($screenshots);
    }

    public function genres() {
        $genres = $this->rawgService->getGenres();
        if(!$genres) {
            return response()->json([
                'status'=> 'Game genre cannot be fetched',
            ], 500);
        }

        return response()->json($genres);
    }

    public function platforms() {
        $platforms = $this->rawgService->getPlatforms();
        if(!$platforms) {
            return response()->json([
                'status'=> 'Game platforms cannot be fetched',
            ], 500);
        }

        return response()->json($platforms);
    }
}
