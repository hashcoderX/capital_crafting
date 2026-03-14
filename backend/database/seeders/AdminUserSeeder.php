<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'info@capitalcrafting.space'],
            [
                'name' => 'CapitalCrafting Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
        );
    }
}
