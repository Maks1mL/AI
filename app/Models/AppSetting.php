<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    
    protected $table = 'app_setting';
    protected $fillable = [
        'companyName',
        'tagLine',
        'address',
        'phone',
        'email',
        'website',
        'footer',
        'bin',
        'mushak',
        'logo',
        'STRIPE_KEY',
        'STRIPE_SECRET',
        'STRIPE_WEBHOOK',
    ];
}
