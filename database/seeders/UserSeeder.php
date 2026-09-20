<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $this->saveUser([
            'name' => 'Admin Edoo',
            'phone' => '081233914116',
            'email' => 'admin@gmail.com',
            'password' => 'admin123',
            'email_verified_at' => now(),
            'role' => UserRole::Admin->value,
        ]);

        $this->saveUser([
            'name' => 'Budi Santoso',
            'phone' => '081233914117',
            'email' => 'budi@example.test',
            'password' => ' ',
            'email_verified_at' => now(),
            'role' => UserRole::Student->value,
        ]);

        $this->saveUser([
            'name' => 'Citra Lestari',
            'phone' => '081233914118',
            'email' => null,
            'password' => 'student123',
            'role' => UserRole::Student->value,
        ]);
    }

    /** @param array<string, mixed> $attributes */
    private function saveUser(array $attributes): void
    {
        $user = User::query()->firstOrNew(['phone' => $attributes['phone']]);

        $user->forceFill($attributes)->save();
    }
}
