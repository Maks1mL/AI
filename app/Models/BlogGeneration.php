<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogGeneration extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'data'];

    protected $casts = [
        'data' => 'array', // JSON Casting
    ];
}
