<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StudentProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_students_can_open_the_profile_page(): void
    {
        $student = User::factory()->create();
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->get('/student/profile')->assertRedirect(route('login'));

        $this->actingAs($student)
            ->get('/student/profile')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('student/profile')
                ->where('profile.id', $student->id)
                ->where('profile.name', $student->name)
                ->where('profile.phone', $student->phone)
                ->where('profile.email', $student->email)
                ->where('profile.status', 'active')
                ->has('profile.created_at')
                ->has('profile.updated_at'));

        $this->actingAs($admin)
            ->get('/student/profile')
            ->assertForbidden();
    }

    public function test_student_can_update_profile_information(): void
    {
        $student = User::factory()->create();

        $this->actingAs($student)
            ->patch('/student/profile', [
                'name' => 'Budi Santoso',
                'phone' => '081234567890',
                'email' => 'budi@example.test',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('student.profile.edit'));

        $student->refresh();

        $this->assertSame('Budi Santoso', $student->name);
        $this->assertSame('081234567890', $student->phone);
        $this->assertSame('budi@example.test', $student->email);
    }

    public function test_student_can_update_password_with_current_password(): void
    {
        $student = User::factory()->create(['password' => 'password']);

        $this->actingAs($student)
            ->put('/student/profile/password', [
                'current_password' => 'password',
                'password' => 'new-secure-password',
                'password_confirmation' => 'new-secure-password',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('student.profile.edit'));

        $this->assertTrue(Hash::check('new-secure-password', $student->fresh()->password));
    }

    public function test_current_password_must_be_correct(): void
    {
        $student = User::factory()->create(['password' => 'password']);

        $this->actingAs($student)
            ->put('/student/profile/password', [
                'current_password' => 'wrong-password',
                'password' => 'new-secure-password',
                'password_confirmation' => 'new-secure-password',
            ])
            ->assertSessionHasErrors('current_password');

        $this->assertTrue(Hash::check('password', $student->fresh()->password));
    }
}
