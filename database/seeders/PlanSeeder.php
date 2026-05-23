<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Plan::create([
            'name'        => 'Basic',
            'price'       => 5,
            'chat_limit'  => 10,
            'image_limit' => 3,
            'audio_limit' => 3,
            'stripe_price_id' => 'price_1QpTc24GWvtuq9jJljvLXXgP',
        ]);
        
        Plan::create([
            'name'        => 'Premium',
            'price'       => 10,
            'chat_limit'  => 30,
            'image_limit' => 6,
            'audio_limit' => 6,
            'stripe_price_id' => 'price_1QqAWf4GWvtuq9jJVeBqMbm9',
        ]);
    }
}
