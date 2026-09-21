<?php

namespace App\Services\Admin;

use App\Enums\EnrollmentStatus;
use App\Enums\ProgressStatus;
use App\Enums\UserRole;
use App\Models\CourseEnrollment;
use App\Models\CourseMaterialProgress;
use App\Models\User;

class StudentService
{
    public function paginate(array $filters)
    {
        return User::query()
            ->where('role', UserRole::Student)
            ->withCount('enrollments')
            ->withCount([
                'enrollments as completed_courses_count' => fn ($query) => $query
                    ->where('status', EnrollmentStatus::Completed),
            ])
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query
                ->where(fn ($query) => $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")))
            ->latest()
            ->paginate($filters['per_page'] ?? 15)
            ->withQueryString();
    }

    public function create(array $data): void
    {
        User::create([...$data, 'role' => UserRole::Student]);
    }

    public function progress(User $student): array
    {
        $enrollments = $student->enrollments()
            ->with([
                'course' => fn ($query) => $query
                    ->with('category:id,name')
                    ->withCount([
                        'materials as materials_count' => fn ($materials) => $materials
                            ->where('is_published', true),
                    ]),
            ])
            ->orderByDesc('last_activity_at')
            ->get();

        $completedMaterials = CourseMaterialProgress::query()
            ->where('user_id', $student->id)
            ->whereIn('course_id', $enrollments->pluck('course_id'))
            ->where('status', ProgressStatus::Completed)
            ->whereHas(
                'material',
                fn ($query) => $query->where('is_published', true),
            )
            ->selectRaw('course_id, count(*) as completed_materials')
            ->groupBy('course_id')
            ->pluck('completed_materials', 'course_id');

        return $enrollments
            ->map(fn (CourseEnrollment $enrollment) => [
                'id' => $enrollment->id,
                'course' => [
                    'id' => $enrollment->course?->id,
                    'title' => $enrollment->course?->title ?? 'Kelas dihapus',
                    'category' => $enrollment->course?->category?->name,
                ],
                'status' => $enrollment->status->value,
                'progress_percentage' => (float) $enrollment->progress_percentage,
                'materials_count' => $enrollment->course?->materials_count ?? 0,
                'completed_materials' => (int) ($completedMaterials[$enrollment->course_id] ?? 0),
                'enrolled_at' => $enrollment->enrolled_at?->toISOString(),
                'last_activity_at' => $enrollment->last_activity_at?->toISOString(),
                'completed_at' => $enrollment->completed_at?->toISOString(),
            ])
            ->values()
            ->all();
    }
}
