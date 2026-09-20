<?php

namespace App\Services;

use App\Enums\CourseStatus;
use App\Enums\EnrollmentStatus;
use App\Enums\ProgressStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\CourseMaterial;
use App\Models\CourseMaterialProgress;
use App\Models\LearningContent;
use App\Models\LearningContentProgress;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StudentStudyService
{
    public function data(User $student, Course $course, ?LearningContent $requestedContent = null): array
    {
        $enrollment = $this->enrollment($student, $course);
        $course->load([
            'materials' => fn ($query) => $query->where('is_published', true),
            'materials.contents' => fn ($query) => $query->where('is_published', true),
        ]);

        $contents = $course->materials->flatMap->contents;
        $selectedContent = $requestedContent
            ? $contents->firstWhere('id', $requestedContent->id)
            : $contents->firstWhere('id', $enrollment->last_learning_content_id) ?? $contents->first();

        abort_if($requestedContent !== null && $selectedContent === null, 404);

        $contentProgress = LearningContentProgress::query()
            ->where('user_id', $student->id)
            ->whereIn('learning_content_id', $contents->pluck('id'))
            ->get()
            ->keyBy('learning_content_id');
        $materialProgress = CourseMaterialProgress::query()
            ->where('user_id', $student->id)
            ->whereIn('course_material_id', $course->materials->pluck('id'))
            ->get()
            ->keyBy('course_material_id');

        return [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'thumbnail_url' => $course->thumbnail_url,
            ],
            'enrollment' => [
                'progress_percentage' => (float) $enrollment->progress_percentage,
                'status' => $enrollment->status->value,
            ],
            'selectedContent' => $selectedContent ? $this->contentData($selectedContent, $contentProgress) : null,
            'materials' => $course->materials->map(fn (CourseMaterial $material) => [
                'id' => $material->id,
                'title' => $material->title,
                'description' => $material->description,
                'progress' => [
                    'status' => $materialProgress->get($material->id)?->status->value ?? ProgressStatus::NotStarted->value,
                    'progress_percentage' => (float) ($materialProgress->get($material->id)?->progress_percentage ?? 0),
                ],
                'contents' => $material->contents->map(fn (LearningContent $content) => $this->contentData($content, $contentProgress))->values(),
            ])->values(),
        ];
    }

    public function complete(User $student, Course $course, LearningContent $content): void
    {
        $enrollment = $this->enrollment($student, $course);
        $content->load('material');
        abort_unless($content->is_published && $content->material?->is_published && $content->material->course_id === $course->id, 404);

        DB::transaction(function () use ($student, $course, $content, $enrollment): void {
            $now = now();
            $material = $content->material;
            $progress = LearningContentProgress::firstOrNew(['user_id' => $student->id, 'learning_content_id' => $content->id]);
            $progress->fill([
                'course_id' => $course->id,
                'course_material_id' => $material->id,
                'status' => ProgressStatus::Completed,
                'watched_seconds' => $content->video_duration_seconds ?? 0,
                'progress_percentage' => 100,
                'first_viewed_at' => $progress->first_viewed_at ?? $now,
                'last_viewed_at' => $now,
                'completed_at' => $now,
            ]);
            $progress->save();

            $materialContentIds = LearningContent::query()->where('course_material_id', $material->id)->where('is_published', true)->pluck('id');
            $materialCompleted = LearningContentProgress::query()->where('user_id', $student->id)->whereIn('learning_content_id', $materialContentIds)->where('status', ProgressStatus::Completed)->count();
            $this->updateMaterialProgress($student, $course, $material, $materialContentIds->count(), $materialCompleted, $now);

            $courseContentIds = LearningContent::query()->where('is_published', true)->whereHas('material', fn ($query) => $query->where('course_id', $course->id)->where('is_published', true))->pluck('id');
            $completed = LearningContentProgress::query()->where('user_id', $student->id)->whereIn('learning_content_id', $courseContentIds)->where('status', ProgressStatus::Completed)->count();
            $total = $courseContentIds->count();
            $isCompleted = $total > 0 && $completed === $total;

            $enrollment->update([
                'status' => $isCompleted ? EnrollmentStatus::Completed : EnrollmentStatus::InProgress,
                'progress_percentage' => $total ? round(($completed / $total) * 100, 2) : 0,
                'last_learning_content_id' => $content->id,
                'started_at' => $enrollment->started_at ?? $now,
                'completed_at' => $isCompleted ? $now : null,
                'last_activity_at' => $now,
            ]);
        });
    }

    private function enrollment(User $student, Course $course): CourseEnrollment
    {
        abort_unless($student->role === UserRole::Student && $course->status === CourseStatus::Published, 404);

        return CourseEnrollment::query()->where('user_id', $student->id)->where('course_id', $course->id)->firstOrFail();
    }

    private function contentData(LearningContent $content, $progress): array
    {
        $contentProgress = $progress->get($content->id);

        return [
            'id' => $content->id,
            'title' => $content->title,
            'type' => $content->type->value,
            'description' => $content->description,
            'youtube_video_id' => $content->youtube_video_id,
            'video_duration_seconds' => $content->video_duration_seconds,
            'textbook_content' => $content->textbook_content,
            'attachment_url' => $content->attachment_url,
            'progress' => [
                'status' => $contentProgress?->status->value ?? ProgressStatus::NotStarted->value,
                'progress_percentage' => (float) ($contentProgress?->progress_percentage ?? 0),
            ],
        ];
    }

    private function updateMaterialProgress(User $student, Course $course, CourseMaterial $material, int $total, int $completed, $now): void
    {
        $isCompleted = $total > 0 && $completed === $total;

        CourseMaterialProgress::query()->updateOrCreate(
            ['user_id' => $student->id, 'course_material_id' => $material->id],
            [
                'course_id' => $course->id,
                'status' => $isCompleted ? ProgressStatus::Completed : ProgressStatus::InProgress,
                'total_contents' => $total,
                'completed_contents' => $completed,
                'progress_percentage' => $total ? round(($completed / $total) * 100, 2) : 0,
                'started_at' => $now,
                'completed_at' => $isCompleted ? $now : null,
                'last_activity_at' => $now,
            ],
        );
    }
}
