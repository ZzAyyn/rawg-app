<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($gameId){
        $game = Game::where('rawg_id', $gameId)->first();

        if(!$game) {
            return response()->json([
                'status'=> 'Game was not found in the database',
            ], 404);
        }

        $reviews = $game->reviews()->with('user:id,name')->get();

        return response()->json($reviews);
    }

    public function store(Request $request) {
        $request->validate([
            'rawg_id'=> 'required|integer',
            'name'=> 'required|string',
            'slug'=> 'required|string',
            'background_image'=> 'nullable|string',
            'rating'=> 'required|integer|min:1|max:10',
            'review_text'=> 'required|string|min:10|max:1000',
        ]);

        $game = Game::firstOrCreate(
            ['rawg_id' =>$request->rawg_id],
            [
                'name'=> $request->name,
                'slug'=> $request->slug,
                'background_image'=> $request->background_image,
            ]
        );

        $existingReview = Review::where('user_id', $request->user()->id)
            ->where('game_id', $game->id)
            ->exists();

        if($existingReview) {
            return response()->json([
                'status'=> 'You have posted a review on this game. Update it for a new one.',
            ], 409);
        }

        $review = Review::create([
            'user_id'=> $request->user()->id,
            'game_id'=> $game -> id,
            'rating' => $request->rating,
            'review_text'=> $request->review_text,
        ]);

        $review->load(
            'user:id,name', 
            'game:id,rawg_id,name,slug'
        );

        return response()->json($review, 201);
    }

    public function show($id) {
        $review = Review::with('user:id,name', 'game:id,rawg_id,name,slug')->find($id);

        if (!$review) {
            return response() -> json([
                'status'=> 'Review was not found',
            ], 404);
        }

        return response()->json($review, 200);
    }

    public function update(Request $request, $id) {
        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'status'=> 'Review was not found',
            ], 404);
        }

        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'status'=> 'You can only edit your own reviews',
            ], 403);
        }

        $request-> validate([
            'rating'=> 'required|integer|min:1|max:10',
            'review_text'=> 'required|string|min:10|max:1000',
        ]);
        
        $review-> update([
            'rating'=> $request->rating,
            'review_text'=> $request-> review_text,
        ]);

        $review->load(
            'user:id,name', 
            'game:id,rawg_id,name,slug'
        );

        return response()->json($review, 200);
    }


    public function destroy(Request $request, $id) {
        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'status'=> 'Review cannot be found',
            ], 404);
        }

        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'You can only delete your own review',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'status'=> 'Review has been deleted',
        ], 200);
    }

    public function myReviews(Request $request) {
        $reviews = $request->user()->reviews()->with('game:id,rawg_id,name,slug')->get();

        return response()->json($reviews, 200);
    }

} 
