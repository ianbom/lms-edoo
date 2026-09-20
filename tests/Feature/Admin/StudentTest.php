<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
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
}
