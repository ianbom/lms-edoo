<?php

namespace Tests\Feature;

use App\Enums\ContentType;
use App\Enums\CourseStatus;
use App\Enums\EnrollmentStatus;
use App\Enums\ProgressStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseEnrollment;
use App\Models\CourseMaterial;
use App\Models\LearningContent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StudentStudyTest extends TestCase
{
    use RefreshDatabase;

    public function test_enrolled_student_can_open_a_published_course_study_page(): void
    {
        [$student, $course, $content] = $this->courseWithContent();

        $this->actingAs($student)->get("/student/classes/{$course->slug}/study")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('student/class/study')
                ->where('course.slug', $course->slug)
                ->where('selectedContent.id', $content->id)
                ->where('selectedContent.attachment_url', 'https://example.com/material.pdf')
                ->has('materials', 1)
                ->has('materials.0.contents', 1));
    }

    public function test_student_can_mark_a_learning_content_complete(): void
    {
        [$student, $course, $content, $material, $enrollment] = $this->courseWithContent();

        $this->actingAs($student)->post("/student/classes/{$course->slug}/study/{$content->id}/complete")
            ->assertRedirect("/student/classes/{$course->slug}/study/{$content->id}");

        $this->assertDatabaseHas('learning_content_progress', [
            'user_id' => $student->id,
            'learning_content_id' => $content->id,
            'status' => ProgressStatus::Completed->value,
            'progress_percentage' => 100,
        ]);
        $this->assertDatabaseHas('course_material_progress', [
            'user_id' => $student->id,
            'course_material_id' => $material->id,
            'status' => ProgressStatus::Completed->value,
            'completed_contents' => 1,
            'progress_percentage' => 100,
        ]);
        $this->assertDatabaseHas('course_enrollments', [
            'id' => $enrollment->id,
            'status' => EnrollmentStatus::Completed->value,
            'progress_percentage' => 100,
            'last_learning_content_id' => $content->id,
        ]);
    }

    public function test_student_cannot_open_a_course_without_an_enrollment(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);
        $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
        $course = Course::create([
            'course_category_id' => $category->id,
            'title' => 'Private Course',
            'slug' => 'private-course',
            'status' => CourseStatus::Published,
        ]);

        $this->actingAs($student)->get("/student/classes/{$course->slug}/study")->assertNotFound();
    }

    public function test_student_cannot_complete_content_from_another_course(): void
    {
        [$student, $course] = $this->courseWithContent();
        $category = CourseCategory::firstOrFail();
        $otherCourse = Course::create([
            'course_category_id' => $category->id,
            'title' => 'Other Course',
            'slug' => 'other-course',
            'status' => CourseStatus::Published,
        ]);
        $material = CourseMaterial::create(['course_id' => $otherCourse->id, 'title' => 'Other Material', 'position' => 0, 'is_published' => true]);
        $content = LearningContent::create(['course_material_id' => $material->id, 'type' => ContentType::Textbook, 'title' => 'Other Content', 'position' => 0, 'textbook_content' => '<p>Other</p>', 'is_published' => true]);

        $this->actingAs($student)->post("/student/classes/{$course->slug}/study/{$content->id}/complete")->assertNotFound();
        $this->assertDatabaseMissing('learning_content_progress', ['user_id' => $student->id, 'learning_content_id' => $content->id]);
    }

    /** @return array{User, Course, LearningContent, CourseMaterial, CourseEnrollment} */
    private function courseWithContent(): array
    {
        $student = User::factory()->create(['role' => UserRole::Student]);
        $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
        $course = Course::create([
            'course_category_id' => $category->id,
            'title' => 'Laravel Mastery',
            'slug' => 'laravel-mastery',
            'status' => CourseStatus::Published,
            'published_at' => now(),
        ]);
        $material = CourseMaterial::create([
            'course_id' => $course->id,
            'title' => 'Introduction',
            'position' => 0,
            'is_published' => true,
        ]);
        $content = LearningContent::create([
            'course_material_id' => $material->id,
            'type' => ContentType::Video,
            'title' => 'Welcome',
            'position' => 0,
            'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'youtube_video_id' => 'dQw4w9WgXcQ',
            'video_duration_seconds' => 180,
            'attachment_url' => 'https://example.com/material.pdf',
            'is_published' => true,
        ]);
        $enrollment = CourseEnrollment::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => EnrollmentStatus::Enrolled,
            'progress_percentage' => 0,
            'enrolled_at' => now(),
        ]);

        return [$student, $course, $content, $material, $enrollment];
    }
}
