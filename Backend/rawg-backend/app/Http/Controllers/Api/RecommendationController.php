<?php

namespace App\Http\Controllers\Api;

use App\Actions\GetRecommendationsAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function index (Request $request) {
        $user = $request -> user();

        $action = new GetRecommendationsAction();
        $recommendations = $action -> handle($user);

        return response() -> json($recommendations);
    }
}
