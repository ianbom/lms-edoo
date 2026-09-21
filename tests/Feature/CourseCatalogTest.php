<?php

namespace Tests\Feature;

use App\Enums\ContentType;
use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseEnrollment;
use App\Models\CourseMaterial;
use App\Models\LearningContent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CourseCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_filter_published_courses_and_see_card_statistics(): void
    {
        $agribusiness = CourseCategory::create(['name' => 'Agribisnis', 'slug' => 'agribisnis']);
        $business = CourseCategory::create(['name' => 'Bisnis', 'slug' => 'bisnis']);
        $course = Course::create([
            'course_category_id' => $agribusiness->id,
            'title' => 'Materi Peternakan',
            'slug' => 'materi-peternakan',
            'short_description' => 'Pelajari budidaya ternak modern.',
            'status' => CourseStatus::Published,
            'published_at' => now(),
        ]);
        $draft = Course::create([
            'course_category_id' => $business->id,
            'title' => 'Draft Business Plan',
            'slug' => 'draft-business-plan',
            'status' => CourseStatus::Draft,
        ]);
        $material = CourseMaterial::create(['course_id' => $course->id, 'title' => 'Dasar', 'position' => 1]);
        LearningContent::create(['course_material_id' => $material->id, 'type' => ContentType::Video, 'title' => 'Video 1', 'position' => 1]);
        LearningContent::create(['course_material_id' => $material->id, 'type' => ContentType::Textbook, 'title' => 'Bacaan', 'position' => 2]);
        CourseEnrollment::create(['user_id' => User::factory()->create()->id, 'course_id' => $course->id]);

        $this->get('/courses?search=Peternakan&category=agribisnis')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('home/courses/index')
                ->where('filters.search', 'Peternakan')
                ->where('filters.category', 'agribisnis')
                ->has('categories', 1)
                ->has('courses', 1)
                ->where('courses.0.id', $course->id)
                ->where('courses.0.videos_count', 1)
                ->where('courses.0.enrollments_count', 1)
                ->missing('courses.1')
            );

        $this->assertModelExists($draft);
    }
}
