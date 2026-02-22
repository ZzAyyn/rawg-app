<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request) {
        $profile = $request->user()->profile;

        if (!$profile) {
            return response()->json([
                "status"=> "Profile was not Found."
            ], 404);
        }

        return response()->json($profile);
    }

    public function store (Request $request) {
        $request->validate([
            "bio"=> "nullable|string|max:200",
            "avatar"=> "nullable|string|url",
            "date_of_birth"=> "nullable|date|before:today",
            "location"=> "nullable|string|max:255",
            "favourite_genre"=> "nullable|string|max:255",
        ]);

        $profile = Profile::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'bio'=> $request -> bio,
                'avatar'=> $request -> avatar,
                'date_of_birth'=> $request -> date_of_birth,
                'location'=> $request -> location,
                'favourite_genre'=> $request -> favourite_genre,
            ]
        );

        return response()->json($profile);
    }

    public function delete (Request $request) {
        $profile = $request -> user() -> profile;

        if (!$profile) {
            return response()->json([
                'status'=> 'Profile was not Found.'
            ], 404);
        }

        $profile->delete();

        return response()->json([
            'status'=> 'Profile has been deleted successfully.'
        ]);
    }
}


