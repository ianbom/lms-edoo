<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CourseCategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin/course-categories')
            ->assertRedirect(route('login'));
    }

    public function test_students_cannot_access_course_categories(): void
    {
        $student = User::factory()->create();

        $this->actingAs($student)
            ->get('/admin/course-categories')
            ->assertForbidden();
    }

    public function test_admin_can_view_course_categories(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = CourseCategory::create([
            'name' => 'Web Development',
            'slug' => 'web-development',
            'description' => 'Backend and frontend courses.',
        ]);

        Course::create([
            'course_category_id' => $category->id,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
        ]);

        $this->actingAs($admin)
            ->get('/admin/course-categories')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/course-categories/index')
                ->has('categories', 1)
                ->where('categories.0.name', 'Web Development')
                ->where('categories.0.courses_count', 1));
    }

    public function test_admin_can_create_course_category(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->post('/admin/course-categories', [
                'name' => 'Web Development',
                'slug' => 'Web Development',
                'description' => 'Backend and frontend courses.',
            ])
            ->assertRedirect('/admin/course-categories');

        $this->assertDatabaseHas('course_categories', [
            'name' => 'Web Development',
            'slug' => 'web-development',
            'description' => 'Backend and frontend courses.',
        ]);
    }

    public function test_slug_must_be_unique(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        CourseCategory::create([
            'name' => 'Existing',
            'slug' => 'existing',
        ]);

        $this->actingAs($admin)
            ->post('/admin/course-categories', [
                'name' => 'Duplicate',
                'slug' => 'existing',
            ])
            ->assertSessionHasErrors('slug');
    }

    public function test_admin_can_update_course_category(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = CourseCategory::create([
            'name' => 'Web Development',
            'slug' => 'web-development',
        ]);

        $this->actingAs($admin)
            ->put("/admin/course-categories/{$category->id}", [
                'name' => 'Backend Development',
                'slug' => 'Backend Development',
                'description' => 'Server-side engineering.',
            ])
            ->assertRedirect('/admin/course-categories');

        $this->assertDatabaseHas('course_categories', [
            'id' => $category->id,
            'name' => 'Backend Development',
            'slug' => 'backend-development',
            'description' => 'Server-side engineering.',
        ]);
    }

    public function test_admin_can_soft_delete_unused_course_category(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = CourseCategory::create([
            'name' => 'Unused',
            'slug' => 'unused',
        ]);

        $this->actingAs($admin)
            ->delete("/admin/course-categories/{$category->id}")
            ->assertRedirect('/admin/course-categories');

        $this->assertSoftDeleted($category);
    }

    public function test_category_with_courses_cannot_be_deleted(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = CourseCategory::create([
            'name' => 'Web Development',
            'slug' => 'web-development',
        ]);

        Course::create([
            'course_category_id' => $category->id,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
        ]);

        $this->actingAs($admin)
            ->delete("/admin/course-categories/{$category->id}")
            ->assertRedirect('/admin/course-categories');

        $this->assertNotSoftDeleted($category);
    }
}
