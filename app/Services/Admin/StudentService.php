<?php

namespace App\Services\Admin;

use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Models\User;

class StudentService
{
    public function paginate()
    {
        return User::query()->where('role', UserRole::Student)->withCount('enrollments')->withCount(['enrollments as completed_courses_count' => fn ($query) => $query->where('status', EnrollmentStatus::Completed)])->latest()->paginate(15);
    }

    public function create(array $data): void
    {
        User::create([...$data, 'role' => UserRole::Student]);
    }
}
