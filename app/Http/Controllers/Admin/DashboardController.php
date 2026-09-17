<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CourseStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Ebook;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()?->getRawOriginal('role') !== UserRole::Admin->value) {
            return to_route('home');
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'students' => User::query()->where('role', UserRole::Student->value)->count(),
                'courses' => Course::query()->count(),
                'publishedCourses' => Course::query()->where('status', CourseStatus::Published->value)->count(),
                'teachers' => Teacher::query()->count(),
                'ebooks' => Ebook::query()->count(),
                'enrollments' => CourseEnrollment::query()->count(),
            ],
            'charts' => [
                'enrollments' => $this->enrollmentTrend(),
                'courseStatuses' => $this->courseStatuses(),
                'topCourses' => $this->topCourses(),
            ],
        ]);
    }

    /** @return array<int, array{label: string, value: int}> */
    private function enrollmentTrend(): array
    {
        $firstMonth = Date::now()->startOfMonth()->subMonths(5);

        return collect(range(0, 5))
            ->map(function (int $offset) use ($firstMonth): array {
                $month = $firstMonth->addMonths($offset);

                return [
                    'label' => $month->format('M Y'),
                    'value' => CourseEnrollment::query()
                        ->whereBetween('enrolled_at', [$month->startOfMonth(), $month->endOfMonth()])
                        ->count(),
                ];
            })
            ->all();
    }

    /** @return array<int, array{status: string, label: string, value: int}> */
    private function courseStatuses(): array
    {
        return array_map(
            fn (CourseStatus $status): array => [
                'status' => $status->value,
                'label' => ucfirst($status->value),
                'value' => Course::query()->where('status', $status->value)->count(),
            ],
            CourseStatus::cases(),
        );
    }

    /** @return array<int, array{title: string, value: int}> */
    private function topCourses(): array
    {
        return Course::query()
            ->withCount('enrollments')
            ->orderByDesc('enrollments_count')
            ->orderBy('title')
            ->limit(5)
            ->get(['id', 'title'])
            ->map(fn (Course $course): array => [
                'title' => $course->title,
                'value' => $course->enrollments_count,
            ])
            ->all();
    }
}
