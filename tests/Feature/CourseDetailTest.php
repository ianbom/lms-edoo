<?php

namespace Tests\Feature;

use App\Enums\ContentType;
use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseMaterial;
use App\Models\LearningContent;
use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CourseDetailTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_published_course_detail_with_published_curriculum(): void
    {
        $category = CourseCategory::create(['name' => 'Impact Management', 'slug' => 'impact-management']);
        $course = Course::create([
            'course_category_id' => $category->id,
            'title' => 'Designing Impactful Programs',
            'slug' => 'designing-impactful-programs',
            'description' => 'Course description.',
            'estimated_duration_minutes' => 45,
            'status' => CourseStatus::Published,
            'published_at' => '2026-04-13 00:00:00',
        ]);
        $teacher = Teacher::create(['name' => 'Rizky Widya', 'expertise' => 'Impact Specialist']);
        $secondTeacher = Teacher::create(['name' => 'Nadia Putri', 'expertise' => 'Program Designer']);
        $course->teachers()->attach($teacher->id, ['position' => 0]);
        $course->teachers()->attach($secondTeacher->id, ['position' => 1]);
        $material = CourseMaterial::create([
            'course_id' => $course->id,
            'title' => 'Logical Framework Approach',
            'description' => 'Module description.',
            'position' => 1,
            'is_published' => true,
        ]);
        LearningContent::create([
            'course_material_id' => $material->id,
            'type' => ContentType::Video,
            'title' => 'Introduction',
            'position' => 1,
            'youtube_video_id' => 'dQw4w9WgXcQ',
            'video_duration_seconds' => 168,
            'is_published' => true,
        ]);
        LearningContent::create([
            'course_material_id' => $material->id,
            'type' => ContentType::Textbook,
            'title' => 'Hidden draft',
            'position' => 2,
            'is_published' => false,
        ]);
        CourseMaterial::create([
            'course_id' => $course->id,
            'title' => 'Hidden module',
            'position' => 2,
            'is_published' => false,
        ]);

        $this->get('/courses/designing-impactful-programs')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('home/courses/show')
                ->where('course.slug', 'designing-impactful-programs')
                ->where('course.preview_video_id', 'dQw4w9WgXcQ')
                ->where('course.modules_count', 1)
                ->where('course.videos_count', 1)
                ->has('course.teachers', 2)
                ->where('course.teachers.0.name', 'Rizky Widya')
                ->where('course.teachers.1.name', 'Nadia Putri')
                ->has('course.materials', 1)
                ->has('course.materials.0.contents', 1)
                ->where('course.materials.0.contents.0.video_duration_seconds', 168)
            );
    }

    public function test_unpublished_course_detail_is_not_public(): void
    {
        $category = CourseCategory::create(['name' => 'Business', 'slug' => 'business']);
        $course = Course::create([
            'course_category_id' => $category->id,
            'title' => 'Draft Course',
            'slug' => 'draft-course',
            'status' => CourseStatus::Draft,
        ]);

        $this->get("/courses/{$course->slug}")->assertNotFound();
    }
}
