<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogData extends Model
{
    use HasFactory;

    protected $table = 'blog_data';
    protected $fillable = [
        'user_id', 'topic', 'main_keyword', 'related_keywords',
        'title', 'meta_description', 'outline', 'blog_post'
    ];

    protected $casts = [
        'related_keywords' => 'array',
        'outline' => 'array',
    ];
}
