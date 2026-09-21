<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseMaterial;
use App\Models\LearningContent;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
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

    public function test_admin_can_view_course_details(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
        $course = Course::create([
            'course_category_id' => $category->id,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
            'status' => 'published',
        ]);
        $material = CourseMaterial::create([
            'course_id' => $course->id,
            'title' => 'Pengenalan',
            'position' => 1,
        ]);
        LearningContent::create([
            'course_material_id' => $material->id,
            'type' => 'video',
            'title' => 'Video pembuka',
            'position' => 1,
        ]);

        $this->actingAs($admin)
            ->get("/admin/courses/{$course->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/courses/show')
                ->where('course.title', 'Laravel Basics')
                ->where('course.statistics.materials', 1)
                ->where('course.statistics.contents', 1)
                ->where('course.statistics.videos', 1)
                ->has('course.materials', 1)
                ->has('course.materials.0.contents', 1));
    }

    public function test_admin_can_reorder_course_curriculum(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
        $course = Course::create(['course_category_id' => $category->id, 'title' => 'Course', 'slug' => 'course']);
        $first = CourseMaterial::create(['course_id' => $course->id, 'title' => 'First', 'position' => 0]);
        $second = CourseMaterial::create(['course_id' => $course->id, 'title' => 'Second', 'position' => 1]);
        $firstContent = LearningContent::create(['course_material_id' => $first->id, 'type' => 'video', 'title' => 'First content', 'position' => 0]);
        $secondContent = LearningContent::create(['course_material_id' => $first->id, 'type' => 'textbook', 'title' => 'Second content', 'position' => 1, 'textbook_content' => '<p>Text</p>']);

        $this->actingAs($admin)->put("/admin/courses/{$course->id}/curriculum/order", [
            'materials' => [
                ['id' => $second->id, 'contents' => []],
                ['id' => $first->id, 'contents' => [$secondContent->id, $firstContent->id]],
            ],
        ])->assertRedirect();

        $this->assertDatabaseHas('course_materials', ['id' => $second->id, 'position' => 0]);
        $this->assertDatabaseHas('course_materials', ['id' => $first->id, 'position' => 1]);
        $this->assertDatabaseHas('learning_contents', ['id' => $secondContent->id, 'position' => 0]);
        $this->assertDatabaseHas('learning_contents', ['id' => $firstContent->id, 'position' => 1]);
    }

    public function test_admin_cannot_reorder_curriculum_with_foreign_content(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
        $course = Course::create(['course_category_id' => $category->id, 'title' => 'Course', 'slug' => 'course']);
        $material = CourseMaterial::create(['course_id' => $course->id, 'title' => 'Module']);
        $foreignCourse = Course::create(['course_category_id' => $category->id, 'title' => 'Other', 'slug' => 'other']);
        $foreignMaterial = CourseMaterial::create(['course_id' => $foreignCourse->id, 'title' => 'Foreign']);
        $foreignContent = LearningContent::create(['course_material_id' => $foreignMaterial->id, 'type' => 'video', 'title' => 'Foreign content']);

        $this->actingAs($admin)->put("/admin/courses/{$course->id}/curriculum/order", [
            'materials' => [['id' => $material->id, 'contents' => [$foreignContent->id]]],
        ])->assertSessionHasErrors('materials');

        $this->assertDatabaseHas('learning_contents', ['id' => $foreignContent->id, 'position' => 0]);
    }
}
