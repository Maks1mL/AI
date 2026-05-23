<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AppSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $appSetting = new AppSetting();
        $appSetting->companyName = 'Unified AI Model SaaS';
        $appSetting->tagLine = 'The future is now';
        $appSetting->address = '123 Main St, San Francisco, CA 94111';
        $appSetting->phone = '415-555-1234';
        $appSetting->email = 'test@gmail.com';
        $appSetting->website = 'https://omegasolutions.com';
        $appSetting->footer = '© 2025 OpenAI';
        $appSetting->bin = '123456789';
        $appSetting->mushak = '123456789';
        $appSetting->logo = 'openai.png';
        $appSetting->STRIPE_KEY = '';
        $appSetting->STRIPE_SECRET = '';
        $appSetting->STRIPE_WEBHOOK = '';

        $appSetting->save();
    }
}
