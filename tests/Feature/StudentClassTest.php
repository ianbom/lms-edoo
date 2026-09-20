<?php

namespace Tests\Feature;

use App\Enums\CourseStatus;
use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseEnrollment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StudentClassTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_sees_only_their_enrolled_classes(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);
        $other = User::factory()->create(['role' => UserRole::Student]);
        $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
        $owned = $this->course($category, 'Laravel Mastery', 'laravel-mastery', CourseStatus::Published);
        $otherCourse = $this->course($category, 'Vue Mastery', 'vue-mastery', CourseStatus::Draft);
        CourseEnrollment::create(['user_id' => $student->id, 'course_id' => $owned->id, 'status' => EnrollmentStatus::InProgress, 'progress_percentage' => 45, 'enrolled_at' => now()]);
        CourseEnrollment::create(['user_id' => $other->id, 'course_id' => $otherCourse->id, 'status' => EnrollmentStatus::Enrolled, 'progress_percentage' => 0, 'enrolled_at' => now()]);

        $this->actingAs($student)->get('/student/classes')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('student/class/my-class')
                ->has('classes.data', 1)
                ->where('classes.data.0.course.title', 'Laravel Mastery')
                ->where('classes.data.0.progress', 45)
                ->where('classes.data.0.available', true));
    }

    public function test_student_classes_are_paginated(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);
        $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);

        foreach (range(1, 13) as $number) {
            $course = $this->course($category, "Course {$number}", "course-{$number}", CourseStatus::Published);
            CourseEnrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'status' => EnrollmentStatus::Enrolled, 'progress_percentage' => 0, 'enrolled_at' => now()]);
        }

        $this->actingAs($student)->get('/student/classes')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('classes.data', 12)
                ->where('classes.current_page', 1)
                ->where('classes.last_page', 2));
    }

    public function test_non_students_cannot_view_student_classes(): void
    {
        $this->actingAs(User::factory()->create(['role' => UserRole::Admin]))
            ->get('/student/classes')
            ->assertForbidden();
    }

    private function course(CourseCategory $category, string $title, string $slug, CourseStatus $status): Course
    {
        return Course::create([
            'course_category_id' => $category->id,
            'title' => $title,
            'slug' => $slug,
            'status' => $status,
            'published_at' => $status === CourseStatus::Published ? now() : null,
        ]);
    }
}
