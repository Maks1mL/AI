<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailConfig extends Model
{
    
    protected $table = 'email_config';
    protected $fillable = [
        'emailConfigName',
        'emailHost',
        'emailPort',
        'emailUser',
        'emailPass',
    ];
}
