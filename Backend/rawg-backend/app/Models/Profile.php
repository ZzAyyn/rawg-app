<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        "user_id",
        "bio",
        "avatar",
        "date_of_birth",
        "location",
        "favourite_genre",
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
