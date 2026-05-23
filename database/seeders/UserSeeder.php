<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = new User();
        $user->name = 'John Doe';
        $user->email = 'test@gmail.com';
        $user->password = bcrypt('12345678');
        $user->planId = 1;
        $user->save();
    }
}
