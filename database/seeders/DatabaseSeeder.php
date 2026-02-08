<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles and permissions first
        $this->call([
            RolesSeeder::class,
        ]);

        // Create default admin user
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin@attendance.local',
            'phone' => '0000000000',
            'password' => Hash::make('password'),
            'pin' => Hash::make('1234'),
            'member_id' => 'ADMIN001',
        ]);
        $admin->assignRole('admin');
    }
}

