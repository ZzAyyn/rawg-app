<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'rawg_id',
        'name',
        'slug',
        'description',
        'background_image',
        'rating',
        'released',
        'platforms',
        'genres',
        'screenshots',
    ];

    protected $casts = [
        'platforms'=> 'array',
        'genres'=> 'array',
        'screenshots'=> 'array',
        'ratings'=> 'array',
        'released'=> 'array',
    ];

    public function favourites(){
        return $this->hasMany(Favourite::class);
    }

    public function favouritedBy(){
        return $this->belongsToMany(User::class, 'favourites');
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }
}
