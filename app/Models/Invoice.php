<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    
    protected $table = 'invoice';
    protected $fillable = [
        'subscription_id',
        'amount',
        'paid_at',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function getFormattedDateAttribute()
    {
        return $this->created_at->format('M d, Y');
    }
}
