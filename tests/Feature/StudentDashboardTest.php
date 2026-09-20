<?php

use App\Enums\ContentType;
use App\Enums\CourseStatus;
use App\Enums\EbookStatus;
use App\Enums\EnrollmentStatus;
use App\Enums\ProgressStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseEnrollment;
use App\Models\CourseMaterial;
use App\Models\Ebook;
use App\Models\EbookCategory;
use App\Models\LearningContent;
use App\Models\LearningContentProgress;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('student receives the student dashboard with only their enrollments', function () {
    $student = User::factory()->create(['role' => UserRole::Student]);
    $other = User::factory()->create(['role' => UserRole::Student]);
    $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
    $course = Course::create(['course_category_id' => $category->id, 'title' => 'Course', 'slug' => 'course', 'status' => CourseStatus::Published]);
    CourseEnrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'status' => EnrollmentStatus::InProgress, 'progress_percentage' => 50, 'enrolled_at' => now()]);
    CourseEnrollment::create(['user_id' => $other->id, 'course_id' => $course->id, 'status' => EnrollmentStatus::Completed, 'progress_percentage' => 100, 'enrolled_at' => now()]);

    $this->actingAs($student)->get('/dashboard')->assertOk()->assertInertia(fn ($page) => $page
        ->component('student/dashboard')
        ->where('stats.enrolled', 1)
        ->has('enrollments', 1)
        ->where('enrollments.0.title', 'Course')
        ->where('recommendations', [])
    );
});

test('student dashboard returns real activity recommendations and ebooks', function () {
    $student = User::factory()->create(['role' => UserRole::Student]);
    $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
    $teacher = Teacher::create(['name' => 'Jane Doe']);
    $enrolled = Course::create([
        'course_category_id' => $category->id,
        'title' => 'Enrolled Course',
        'slug' => 'enrolled-course',
        'short_description' => 'Existing course',
        'status' => CourseStatus::Published,
    ]);
    $recommended = Course::create([
        'course_category_id' => $category->id,
        'title' => 'Recommended Course',
        'slug' => 'recommended-course',
        'status' => CourseStatus::Published,
        'published_at' => now(),
    ]);
    $enrolled->teachers()->attach($teacher);
    $recommended->teachers()->attach($teacher);
    CourseEnrollment::create([
        'user_id' => $student->id,
        'course_id' => $enrolled->id,
        'status' => EnrollmentStatus::InProgress,
        'progress_percentage' => 50,
        'enrolled_at' => now(),
    ]);
    $material = CourseMaterial::create(['course_id' => $enrolled->id, 'title' => 'Module', 'is_published' => true]);
    $content = LearningContent::create(['course_material_id' => $material->id, 'type' => ContentType::Video, 'title' => 'Real Lesson', 'is_published' => true]);
    LearningContentProgress::create([
        'user_id' => $student->id,
        'course_id' => $enrolled->id,
        'course_material_id' => $material->id,
        'learning_content_id' => $content->id,
        'status' => ProgressStatus::Completed,
        'last_viewed_at' => now(),
    ]);
    $ebookCategory = EbookCategory::create(['name' => 'Programming', 'slug' => 'programming', 'is_active' => true]);
    Ebook::create([
        'ebook_category_id' => $ebookCategory->id,
        'title' => 'Real Ebook',
        'slug' => 'real-ebook',
        'file_url' => '/ebooks/real.pdf',
        'status' => EbookStatus::Published,
        'published_at' => now(),
    ]);

    $this->actingAs($student)->get('/dashboard')->assertInertia(fn ($page) => $page
        ->where('enrollments.0.teacher', 'Jane Doe')
        ->where('enrollments.0.materials_count', 1)
        ->where('recentActivities.0.title', 'Menyelesaikan materi Real Lesson')
        ->where('recommendations.0.title', 'Recommended Course')
        ->where('ebooks.0.title', 'Real Ebook')
    );
});
