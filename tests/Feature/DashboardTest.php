<?php

namespace Tests\Feature;

use App\Enums\CourseStatus;
use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseEnrollment;
use App\Models\Ebook;
use App\Models\EbookCategory;
use App\Models\Teacher;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_students_see_the_student_dashboard(): void
    {
        $student = User::factory()->create();

        $this->actingAs($student)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('student/dashboard')
                ->where('stats.enrolled', 0)
                ->where('stats.active', 0)
                ->where('stats.completed', 0)
                ->where('stats.progress', 0)
                ->has('recentActivities', 0)
                ->has('enrollments', 0));
    }

    public function test_admin_sees_real_dashboard_metrics_and_charts(): void
    {
        CarbonImmutable::setTestNow('2026-09-17 12:00:00');

        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $students = User::factory()->count(2)->create();
        $category = CourseCategory::create([
            'name' => 'Development',
            'slug' => 'development',
        ]);
        $publishedCourse = Course::create([
            'course_category_id' => $category->id,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
            'status' => CourseStatus::Published,
        ]);
        Course::create([
            'course_category_id' => $category->id,
            'title' => 'PHP Basics',
            'slug' => 'php-basics',
            'status' => CourseStatus::Draft,
        ]);
        Teacher::create(['name' => 'Jane Doe']);
        $ebookCategory = EbookCategory::create([
            'name' => 'Programming',
            'slug' => 'programming',
        ]);
        Ebook::create([
            'ebook_category_id' => $ebookCategory->id,
            'title' => 'Laravel Guide',
            'slug' => 'laravel-guide',
        ]);

        foreach ($students as $student) {
            CourseEnrollment::create([
                'user_id' => $student->id,
                'course_id' => $publishedCourse->id,
                'status' => EnrollmentStatus::Enrolled,
                'enrolled_at' => now(),
            ]);
        }

        $this->actingAs($admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.students', 2)
                ->where('stats.courses', 2)
                ->where('stats.publishedCourses', 1)
                ->where('stats.teachers', 1)
                ->where('stats.ebooks', 1)
                ->where('stats.enrollments', 2)
                ->has('charts.enrollments', 6)
                ->where('charts.enrollments.5.value', 2)
                ->where('charts.courseStatuses.0.status', 'draft')
                ->where('charts.courseStatuses.0.value', 1)
                ->where('charts.courseStatuses.1.status', 'published')
                ->where('charts.courseStatuses.1.value', 1)
                ->where('charts.courseStatuses.2.status', 'archived')
                ->where('charts.courseStatuses.2.value', 0)
                ->where('charts.topCourses.0.title', 'Laravel Basics')
                ->where('charts.topCourses.0.value', 2));
    }
}
