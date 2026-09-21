<?php

namespace Tests\Feature\Admin;

use App\Enums\EnrollmentStatus;
use App\Enums\ProgressStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseEnrollment;
use App\Models\CourseMaterial;
use App\Models\CourseMaterialProgress;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StudentTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin/students')
            ->assertRedirect(route('login'));
    }

    public function test_students_cannot_access_student_management(): void
    {
        $student = User::factory()->create();

        $this->actingAs($student)
            ->get('/admin/students')
            ->assertForbidden();
    }

    public function test_students_cannot_create_students(): void
    {
        $student = User::factory()->create();

        $this->actingAs($student)
            ->post('/admin/students', [
                'name' => 'New Student',
                'phone' => '081234567890',
                'password' => 'password',
                'password_confirmation' => 'password',
            ])
            ->assertForbidden();
    }

    public function test_admin_can_view_students_only(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $student = User::factory()->create(['name' => 'Student User']);
        User::factory()->create(['name' => 'Admin User', 'role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->get('/admin/students')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/students/index')
                ->has('students.data', 1)
                ->where('students.data.0.id', $student->id)
                ->where('students.data.0.name', 'Student User'));
    }

    public function test_admin_can_view_student_course_progress(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $student = User::factory()->create(['name' => 'Student User']);
        $category = CourseCategory::create([
            'name' => 'Web Development',
            'slug' => 'web-development',
        ]);
        $course = Course::create([
            'course_category_id' => $category->id,
            'title' => 'Laravel Fundamentals',
            'slug' => 'laravel-fundamentals',
        ]);
        $completedMaterial = CourseMaterial::create([
            'course_id' => $course->id,
            'title' => 'Pengenalan',
            'position' => 1,
        ]);
        CourseMaterial::create([
            'course_id' => $course->id,
            'title' => 'Routing',
            'position' => 2,
        ]);
        CourseEnrollment::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => EnrollmentStatus::InProgress,
            'progress_percentage' => 50,
            'enrolled_at' => now()->subDays(3),
            'last_activity_at' => now()->subHour(),
        ]);
        CourseMaterialProgress::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'course_material_id' => $completedMaterial->id,
            'status' => ProgressStatus::Completed,
            'total_contents' => 1,
            'completed_contents' => 1,
            'progress_percentage' => 100,
        ]);

        $this->actingAs($admin)
            ->get("/admin/students/{$student->id}/progress")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/students/progress')
                ->where('student.id', $student->id)
                ->has('enrollments', 1)
                ->where('enrollments.0.course.title', 'Laravel Fundamentals')
                ->where('enrollments.0.status', 'in_progress')
                ->where('enrollments.0.progress_percentage', 50)
                ->where('enrollments.0.completed_materials', 1)
                ->where('enrollments.0.materials_count', 2));
    }

    public function test_admin_can_create_student(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->post('/admin/students', [
                'name' => 'New Student',
                'phone' => '081234567890',
                'email' => 'student@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
            ])
            ->assertRedirect('/admin/students');

        $this->assertDatabaseHas('users', [
            'name' => 'New Student',
            'phone' => '081234567890',
            'email' => 'student@example.com',
            'role' => UserRole::Student->value,
        ]);
    }

    public function test_student_phone_must_be_unique(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        User::factory()->create(['phone' => '081234567890']);

        $this->actingAs($admin)
            ->post('/admin/students', [
                'name' => 'New Student',
                'phone' => '081234567890',
                'password' => 'password',
                'password_confirmation' => 'password',
            ])
            ->assertSessionHasErrors('phone');
    }

    public function test_student_password_must_be_confirmed(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->post('/admin/students', [
                'name' => 'New Student',
                'phone' => '081234567890',
                'password' => 'password',
                'password_confirmation' => 'different-password',
            ])
            ->assertSessionHasErrors('password');
    }

    public function test_admin_can_search_students_and_choose_per_page(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $target = User::factory()->create([
            'name' => 'Siswa Target',
            'phone' => '08129990001',
            'email' => 'target@example.com',
        ]);
        User::factory()->create(['name' => 'Siswa Lain']);

        $this->actingAs($admin)
            ->get('/admin/students?search=08129990001&per_page=10')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/students/index')
                ->where('filters.search', '08129990001')
                ->where('filters.per_page', 10)
                ->has('students.data', 1)
                ->where('students.data.0.id', $target->id)
                ->where('students.per_page', 10));
    }

    public function test_student_pagination_retains_search_and_per_page(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        User::factory(11)->create(['name' => 'Siswa Pagination']);

        $this->actingAs($admin)
            ->get('/admin/students?search=Siswa%20Pagination&per_page=10')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('students.data', 10)
                ->where(
                    'students.next_page_url',
                    route('admin.students.index', [
                        'search' => 'Siswa Pagination',
                        'per_page' => 10,
                        'page' => 2,
                    ]),
                ));
    }
}
