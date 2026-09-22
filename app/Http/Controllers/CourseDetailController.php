<?php

namespace App\Http\Controllers;

use App\Enums\ContentType;
use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\CourseMaterial;
use App\Models\LearningContent;
use Inertia\Inertia;
use Inertia\Response;

class CourseDetailController extends Controller
{
    public function __invoke(Course $course): Response
    {
        abort_unless($course->status === CourseStatus::Published, 404);

        $course->load([
            'category:id,name,slug',
            'teachers:id,name,photo_url,expertise',
            'materials' => fn ($query) => $query->where('is_published', true),
            'materials.contents' => fn ($query) => $query->where('is_published', true),
        ]);

        $materials = $course->materials->map(fn (CourseMaterial $material) => [
            'id' => $material->id,
            'title' => $material->title,
            'description' => $material->description,
            'contents' => $material->contents->map(fn (LearningContent $content) => [
                'id' => $content->id,
                'title' => $content->title,
                'type' => $content->type->value,
                'description' => $content->description,
                'youtube_video_id' => $content->youtube_video_id,
                'video_duration_seconds' => $content->video_duration_seconds,
            ])->values(),
        ])->values();

        $contents = $materials->flatMap(fn (array $material) => $material['contents']);
        $preview = $contents->first(fn (array $content) => $content['type'] === ContentType::Video->value && $content['youtube_video_id']);

        return Inertia::render('home/courses/show', [
            'course' => [
                'id' => $course->id,
                'slug' => $course->slug,
                'title' => $course->title,
                'short_description' => $course->short_description,
                'description' => $course->description,
                'thumbnail_url' => $course->thumbnail_url,
                'banner_url' => $course->banner_url,
                'estimated_duration_minutes' => $course->estimated_duration_minutes,
                'published_at' => $course->published_at?->toISOString(),
                'category' => $course->category,
                'teachers' => $course->teachers,
                'modules_count' => $materials->count(),
                'videos_count' => $contents->where('type', ContentType::Video->value)->count(),
                'preview_video_id' => $preview['youtube_video_id'] ?? null,
                'materials' => $materials,
            ],
        ]);
    }
}
