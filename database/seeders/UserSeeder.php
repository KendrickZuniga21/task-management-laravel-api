<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'System Admin',
            'email' => 'admin@test.com',
            'password' => 'password',
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Project Manager',
            'email' => 'manager@test.com',
            'password' => 'password',
            'role' => 'manager',
            'is_active' => true,
        ]);

        User::factory(8)->create([
            'role' => 'member',
            'is_active' => true,
        ]);
    }
}