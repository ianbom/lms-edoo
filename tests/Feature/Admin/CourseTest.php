<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CourseTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_course_with_multiple_teachers(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
        $teachers = Teacher::insertGetId(['name' => 'One', 'created_at' => now(), 'updated_at' => now()]);
        $second = Teacher::create(['name' => 'Two']);

        $this->actingAs($admin)->post('/admin/courses', [
            'course_category_id' => $category->id,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
            'short_description' => 'Learn Laravel.',
            'description' => 'Full course',
            'level' => 'Beginner',
            'estimated_duration_minutes' => 120,
            'status' => 'draft',
            'teacher_ids' => [$teachers, $second->id],
            'thumbnail' => UploadedFile::fake()->image('thumb.jpg'),
            'banner' => UploadedFile::fake()->image('banner.jpg'),
        ])->assertRedirect();

        $course = Course::firstOrFail();
        $this->assertDatabaseHas('course_teachers', ['course_id' => $course->id, 'teacher_id' => $teachers, 'position' => 0]);
        $this->assertDatabaseHas('course_teachers', ['course_id' => $course->id, 'teacher_id' => $second->id, 'position' => 1]);
    }

    public function test_course_slug_must_be_unique(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
        Course::create(['course_category_id' => $category->id, 'title' => 'Existing', 'slug' => 'existing']);

        $this->actingAs($admin)->post('/admin/courses', [
            'course_category_id' => $category->id, 'title' => 'Another', 'slug' => 'existing', 'status' => 'draft',
        ])->assertSessionHasErrors('slug');
    }

    public function test_students_cannot_access_courses(): void
    {
        $this->actingAs(User::factory()->create())->get('/admin/courses')->assertForbidden();
    }
}
