<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    
    protected $table = 'plan';
    protected $fillable = ['name', 'price', 'chat_limit', 'image_limit', 'audio_limit','stripe_price_id'];
    
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
