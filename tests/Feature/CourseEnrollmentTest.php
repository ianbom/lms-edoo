<?php

namespace Tests\Feature;

use App\Enums\CourseStatus;
use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseEnrollmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_enroll_in_a_published_course_once(): void
    {
        $student = User::factory()->create();
        $course = $this->publishedCourse();

        $this->actingAs($student)
            ->post(route('courses.enroll', $course))
            ->assertRedirect(route('student.classes.index'));

        $this->assertDatabaseHas('course_enrollments', [
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => EnrollmentStatus::Enrolled->value,
            'progress_percentage' => 0,
        ]);

        $this->actingAs($student)->post(route('courses.enroll', $course));

        $this->assertSame(1, $student->enrollments()->where('course_id', $course->id)->count());
    }

    public function test_guest_cannot_enroll_in_a_course(): void
    {
        $this->post(route('courses.enroll', $this->publishedCourse()))
            ->assertRedirect(route('login'));
    }

    public function test_admin_cannot_enroll_in_a_course(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->post(route('courses.enroll', $this->publishedCourse()))
            ->assertForbidden();
    }

    public function test_student_cannot_enroll_in_an_unpublished_course(): void
    {
        $course = $this->publishedCourse(['status' => CourseStatus::Draft]);

        $this->actingAs(User::factory()->create())
            ->post(route('courses.enroll', $course))
            ->assertNotFound();
    }

    /** @param array<string, mixed> $attributes */
    private function publishedCourse(array $attributes = []): Course
    {
        $category = CourseCategory::create([
            'name' => 'Development',
            'slug' => 'development',
        ]);

        return Course::create([
            'course_category_id' => $category->id,
            'title' => 'Laravel Fundamentals',
            'slug' => 'laravel-fundamentals',
            'status' => CourseStatus::Published,
            'published_at' => now(),
            ...$attributes,
        ]);
    }
}
