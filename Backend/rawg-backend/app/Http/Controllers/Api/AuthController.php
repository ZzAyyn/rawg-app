<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;


class AuthController extends Controller
{
    public function register(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email'=> 'required|string|email|max:255|unique:users',
            'password'=> 'required|string|min:8|confirmed'
        ]);

        $user = User::create([
            'name'=> $request->name,
            'email'=> $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'=> $user,
            'token'=> $token,
        ], 201);
    }

    public function login(Request $request){
        $request->validate([
            'email'=> 'required|email',
            'password'=> 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email'=> ['The provided credentials are incorrect.']
            ]);
        }

        $token = $user->createToken('auth_token') -> plainTextToken;

        return response()->json([
            'user'=> $user,
            'token'=> $token,
        ]);
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request){
        return response() -> json([
            'id' => $request -> user() -> id,
            'name' => $request -> user() -> name,
            'email' => $request -> user() -> email,
            'email_notifications' => $request -> user() -> email_notifications,
            'created_at' => $request -> user() -> created_at,
        ]);
    }

    public function unsubscribe (Request $request) {
        $token = $request -> query('token');

        if (!$token) {
            return response() -> json([
                'status' => 'Invalid unsubscribe link.',
            ], 400);
        }

        $user = User::where('unsubscribe_token', $token) -> first();

        if(!$user) {
            return response() -> json([
                'status' => 'Invalid unsubscribe link.',
            ], 404);
        }

        $user -> update([
            'email_notifications' => false,
        ]);

        return response() -> json([
            'status' => 'You have been unsubscribed from weekly notifications.',
        ]);
    }

    public function updateEmailPreferences(Request $request) {
        $request -> validate([
            'email_notifications' => 'required|boolean',
        ]);

        $request -> user() -> update([
            'email_notifications' => $request -> email_notifications,
        ]);

        return response() -> json([
            'status' => 'Email preferences updated successfully.',
            'email_notifications' => $request -> user() -> email_notifications,
        ]);
    }

}
