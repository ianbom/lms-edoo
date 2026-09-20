<?php

namespace Tests\Feature;

use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\CourseCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WelcomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_displays_latest_published_courses(): void
    {
        $category = CourseCategory::create([
            'name' => 'Web Development',
            'slug' => 'web-development',
        ]);

        $published = Course::create([
            'course_category_id' => $category->id,
            'title' => 'Laravel Fundamentals',
            'slug' => 'laravel-fundamentals',
            'short_description' => 'Belajar Laravel dari dasar.',
            'status' => CourseStatus::Published,
            'published_at' => now(),
        ]);

        Course::create([
            'course_category_id' => $category->id,
            'title' => 'Draft Course',
            'slug' => 'draft-course',
            'status' => CourseStatus::Draft,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->has('courses', 1)
                ->where('courses.0.id', $published->id)
                ->where('courses.0.title', 'Laravel Fundamentals')
                ->where('courses.0.category.name', 'Web Development')
                ->where('courses.0.videos_count', 0)
                ->where('courses.0.enrollments_count', 0)
                ->missing('courses.1'));
    }
}
