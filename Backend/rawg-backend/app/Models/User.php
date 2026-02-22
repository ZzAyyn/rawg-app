<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use  HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array {
        return [
            'email_verified_at' => 'datetime',
            'password'=> 'hashed',
        ];
    }

    public function favourites() {
        return $this->hasMany(Favourite::class);
    }

    public function favouriteGames() {
        return $this->belongsToMany(Game::class, 'favorites');
    }

    public function profile() {
        return $this->hasOne(Profile::class);
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }

}
