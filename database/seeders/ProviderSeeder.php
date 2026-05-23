<?php

namespace Database\Seeders;

use App\Models\Provider;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provider = new Provider();
        $provider->name = 'openai';
        $provider->url = 'https://api.openai.com/v1/chat/completions'; // Replace with your actual OpenAI API key
        $provider->save();
        
        $provider = new Provider();
        $provider->name = 'claude';
        $provider->url = 'https://api.anthropic.com/v1/messages';
        $provider->save();

        $provider = new Provider();
        $provider->name = 'groq';
        $provider->url = 'https://api.groq.com/openai/v1/chat/completions';
        $provider->save();

        $provider = new Provider();
        $provider->name = 'deepseek';
        $provider->url = 'https://openrouter.ai/api/v1/chat/completions';
        $provider->save();

        $provider = new Provider();
        $provider->name = 'gemini';
        $provider->url = 'https://openrouter.ai/api/v1/chat/completions';
        $provider->save();

        $provider = new Provider();
        $provider->name = 'stability';
        $provider->url = 'https://api.together.xyz/v1/images/generations';
        $provider->save();

        $provider = new Provider();
        $provider->name = 'flux';
        $provider->url = 'https://api.together.xyz/v1/images/generations';
        $provider->save();

        $provider = new Provider();
        $provider->name = 'openaiImage';
        $provider->url = 'https://api.openai.com/v1/images/generations';
        $provider->save();

        $provider = new Provider();
        $provider->name = 'stability Pro';
        $provider->url = 'https://api.stability.ai';
        $provider->save();

    }
}
