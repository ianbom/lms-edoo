<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TeacherTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin/teachers')->assertRedirect(route('login'));
    }

    public function test_students_cannot_manage_teachers(): void
    {
        $student = User::factory()->create();
        $teacher = Teacher::create(['name' => 'Budi Santoso']);

        $this->actingAs($student)->get('/admin/teachers')->assertForbidden();
        $this->actingAs($student)->post('/admin/teachers', ['name' => 'New Teacher'])->assertForbidden();
        $this->actingAs($student)->put("/admin/teachers/{$teacher->id}", ['name' => 'Updated'])->assertForbidden();
    }

    public function test_admin_can_view_teachers(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $teacher = Teacher::create([
            'name' => 'Budi Santoso',
            'expertise' => 'Backend Development',
        ]);

        $this->actingAs($admin)
            ->get('/admin/teachers')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/teachers/index')
                ->has('teachers.data', 1)
                ->where('teachers.data.0.id', $teacher->id)
                ->where('teachers.data.0.courses_count', 0));
    }

    public function test_admin_can_create_teacher_with_photo(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->post('/admin/teachers', [
                'name' => 'Budi Santoso',
                'expertise' => 'Backend Development',
                'photo' => UploadedFile::fake()->image('budi.jpg'),
            ])
            ->assertRedirect('/admin/teachers');

        $teacher = Teacher::firstOrFail();
        $this->assertSame('Budi Santoso', $teacher->name);
        $this->assertNotNull($teacher->photo_url);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $teacher->photo_url));
    }

    public function test_admin_can_update_teacher_without_replacing_photo(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $teacher = Teacher::create([
            'name' => 'Budi Santoso',
            'photo_url' => '/storage/teachers/photos/budi.jpg',
        ]);

        $this->actingAs($admin)
            ->put("/admin/teachers/{$teacher->id}", [
                'name' => 'Budi Setiawan',
                'expertise' => 'Laravel Development',
            ])
            ->assertRedirect('/admin/teachers');

        $this->assertDatabaseHas('teachers', [
            'id' => $teacher->id,
            'name' => 'Budi Setiawan',
            'expertise' => 'Laravel Development',
            'photo_url' => '/storage/teachers/photos/budi.jpg',
        ]);
    }

    public function test_teacher_name_is_required(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->post('/admin/teachers', ['name' => ''])
            ->assertSessionHasErrors('name');
    }

    public function test_teacher_photo_must_be_a_supported_image_under_five_megabytes(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->post('/admin/teachers', [
                'name' => 'Budi Santoso',
                'photo' => UploadedFile::fake()->create('photo.gif', 6000, 'image/gif'),
            ])
            ->assertSessionHasErrors('photo');
    }
}
