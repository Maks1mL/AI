<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan_id',
        'starts_at',
        'ends_at',
        'chat_limit',
        'image_limit',
        'audio_limit',
    ];

    protected $dates = ['starts_at', 'ends_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function isActive()
    {
        $now = now();
        return $this->starts_at <= $now && $this->ends_at >= $now;
    }
}
