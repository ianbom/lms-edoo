<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\CourseMaterialProgress;
use App\Models\LearningContentProgress;
use App\Models\User;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::query()->whereIn('phone', ['081233914117', '081233914118'])->get()->keyBy('phone');
        $courses = Course::query()->with(['materials.contents'])->whereIn('slug', [
            'fundamental-web-development',
            'ui-ux-design-fundamentals',
            'data-analytics-for-beginners',
        ])->get()->keyBy('slug');

        foreach ([
            ['phone' => '081233914117', 'course' => 'fundamental-web-development', 'status' => 'completed', 'completed_contents' => 6],
            ['phone' => '081233914117', 'course' => 'ui-ux-design-fundamentals', 'status' => 'in_progress', 'completed_contents' => 3],
            ['phone' => '081233914117', 'course' => 'data-analytics-for-beginners', 'status' => 'enrolled', 'completed_contents' => 0],
            ['phone' => '081233914118', 'course' => 'fundamental-web-development', 'status' => 'in_progress', 'completed_contents' => 2],
            ['phone' => '081233914118', 'course' => 'ui-ux-design-fundamentals', 'status' => 'enrolled', 'completed_contents' => 0],
            ['phone' => '081233914118', 'course' => 'data-analytics-for-beginners', 'status' => 'completed', 'completed_contents' => 6],
        ] as $definition) {
            $this->seedEnrollment($students[$definition['phone']], $courses[$definition['course']], $definition);
        }
    }

    /** @param array{status: string, completed_contents: int} $definition */
    private function seedEnrollment(User $student, Course $course, array $definition): void
    {
        $contents = $course->materials->flatMap->contents->values();
        $totalContents = $contents->count();
        $completedContents = $definition['completed_contents'];
        $progress = $totalContents === 0 ? 0 : round($completedContents / $totalContents * 100, 2);
        $lastContent = $completedContents > 0 ? $contents->get($completedContents - 1) : null;
        $activityAt = $completedContents > 0 ? now()->subDays(1) : null;

        CourseEnrollment::query()->updateOrCreate(
            ['user_id' => $student->id, 'course_id' => $course->id],
            [
                'status' => $definition['status'],
                'progress_percentage' => $progress,
                'last_learning_content_id' => $lastContent?->id,
                'enrolled_at' => now()->subDays(10),
                'started_at' => $completedContents > 0 ? now()->subDays(9) : null,
                'completed_at' => $definition['status'] === 'completed' ? now()->subDays(1) : null,
                'last_activity_at' => $activityAt,
            ],
        );

        foreach ($course->materials as $material) {
            $materialContents = $material->contents->values();
            $materialCompleted = $materialContents->filter(
                fn ($content) => $contents->search(fn ($item) => $item->id === $content->id) < $completedContents,
            )->count();
            $materialProgress = round($materialCompleted / $materialContents->count() * 100, 2);

            CourseMaterialProgress::query()->updateOrCreate(
                ['user_id' => $student->id, 'course_material_id' => $material->id],
                [
                    'course_id' => $course->id,
                    'status' => $this->status($materialCompleted, $materialContents->count()),
                    'total_contents' => $materialContents->count(),
                    'completed_contents' => $materialCompleted,
                    'progress_percentage' => $materialProgress,
                    'started_at' => $materialCompleted > 0 ? now()->subDays(9) : null,
                    'completed_at' => $materialCompleted === $materialContents->count() ? now()->subDays(1) : null,
                    'last_activity_at' => $materialCompleted > 0 ? now()->subDays(1) : null,
                ],
            );
        }

        foreach ($contents as $position => $content) {
            $isCompleted = $position < $completedContents;

            LearningContentProgress::query()->updateOrCreate(
                ['user_id' => $student->id, 'learning_content_id' => $content->id],
                [
                    'course_id' => $course->id,
                    'course_material_id' => $content->course_material_id,
                    'status' => $isCompleted ? 'completed' : 'not_started',
                    'watched_seconds' => $isCompleted ? ($content->video_duration_seconds ?? 0) : 0,
                    'progress_percentage' => $isCompleted ? 100 : 0,
                    'first_viewed_at' => $isCompleted ? now()->subDays(9) : null,
                    'last_viewed_at' => $isCompleted ? now()->subDays(1) : null,
                    'completed_at' => $isCompleted ? now()->subDays(1) : null,
                ],
            );
        }
    }

    private function status(int $completed, int $total): string
    {
        if ($completed === 0) {
            return 'not_started';
        }

        return $completed === $total ? 'completed' : 'in_progress';
    }
}
