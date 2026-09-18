<?php

use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseEnrollment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('student receives the student dashboard with only their enrollments', function () {
    $student = User::factory()->create(['role' => UserRole::Student]);
    $other = User::factory()->create(['role' => UserRole::Student]);
    $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
    $course = Course::create(['course_category_id' => $category->id, 'title' => 'Course', 'slug' => 'course']);
    CourseEnrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'status' => EnrollmentStatus::InProgress, 'progress_percentage' => 50, 'enrolled_at' => now()]);
    CourseEnrollment::create(['user_id' => $other->id, 'course_id' => $course->id, 'status' => EnrollmentStatus::Completed, 'progress_percentage' => 100, 'enrolled_at' => now()]);

    $this->actingAs($student)->get('/dashboard')->assertOk()->assertInertia(fn ($page) => $page->component('student/dashboard')->where('stats.enrolled', 1)->has('enrollments', 1));
});
