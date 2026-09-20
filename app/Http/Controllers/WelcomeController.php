<?php

namespace App\Http\Controllers;

use App\Enums\ContentType;
use App\Enums\CourseStatus;
use App\Models\Course;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function __invoke(): Response
    {
        $courses = Course::query()
            ->select([
                'id',
                'course_category_id',
                'title',
                'slug',
                'short_description',
                'thumbnail_url',
                'estimated_duration_minutes',
                'published_at',
            ])
            ->with([
                'category:id,name,slug',
                'teachers:id,name,photo_url,expertise',
            ])
            ->withCount([
                'contents as videos_count' => fn (Builder $query) => $query
                    ->where('learning_contents.type', ContentType::Video->value)
                    ->where('learning_contents.is_published', true)
                    ->whereHas(
                        'material',
                        fn (Builder $material) => $material->where(
                            'is_published',
                            true,
                        ),
                    ),
                'enrollments',
            ])
            ->where('status', CourseStatus::Published)
            ->latest('published_at')
            ->limit(3)
            ->get()
            ->map(fn (Course $course) => [
                'id' => $course->id,
                'slug' => $course->slug,
                'title' => $course->title,
                'short_description' => $course->short_description,
                'thumbnail_url' => $course->thumbnail_url,
                'estimated_duration_minutes' => $course->estimated_duration_minutes,
                'category' => $course->category,
                'teacher' => $course->teachers->first(),
                'videos_count' => $course->videos_count,
                'enrollments_count' => $course->enrollments_count,
            ])
            ->values();

        return Inertia::render('welcome', ['courses' => $courses]);
    }
}
