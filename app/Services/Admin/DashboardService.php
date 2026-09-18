<?php

namespace App\Services\Admin;

use App\Enums\CourseStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Ebook;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Date;

class DashboardService
{
    public function data(): array
    {
        return ['stats' => ['students' => User::query()->where('role', UserRole::Student->value)->count(), 'courses' => Course::query()->count(), 'publishedCourses' => Course::query()->where('status', CourseStatus::Published->value)->count(), 'teachers' => Teacher::query()->count(), 'ebooks' => Ebook::query()->count(), 'enrollments' => CourseEnrollment::query()->count()], 'charts' => ['enrollments' => $this->trend(), 'courseStatuses' => array_map(fn ($status) => ['status' => $status->value, 'label' => ucfirst($status->value), 'value' => Course::query()->where('status', $status->value)->count()], CourseStatus::cases()), 'topCourses' => Course::query()->withCount('enrollments')->orderByDesc('enrollments_count')->limit(5)->get(['id', 'title'])->map(fn ($course) => ['title' => $course->title, 'value' => $course->enrollments_count])->all()]];
    }

    private function trend(): array
    {
        $first = Date::now()->startOfMonth()->subMonths(5);

        return collect(range(0, 5))->map(fn ($offset) => ['label' => $first->addMonths($offset)->format('M Y'), 'value' => CourseEnrollment::query()->whereBetween('enrolled_at', [$first->addMonths($offset)->startOfMonth(), $first->addMonths($offset)->endOfMonth()])->count()])->all();
    }
}
