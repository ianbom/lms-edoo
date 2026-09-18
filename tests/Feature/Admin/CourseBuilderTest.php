<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseMaterial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseBuilderTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_batch_create_materials_and_contents(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $course = Course::create(['course_category_id' => CourseCategory::create(['name' => 'Web', 'slug' => 'web'])->id, 'title' => 'Course', 'slug' => 'course']);

        $this->actingAs($admin)->put("/admin/courses/{$course->id}/builder", ['materials' => [[
            'title' => 'Intro', 'description' => null, 'position' => 0, 'is_published' => true,
            'contents' => [['type' => 'video', 'title' => 'Video', 'description' => null, 'position' => 0, 'is_published' => true, 'youtube_url' => 'https://youtu.be/abc123XYZ']],
        ]]])->assertRedirect();

        $this->assertDatabaseHas('learning_contents', ['title' => 'Video', 'youtube_video_id' => 'abc123XYZ', 'textbook_content' => null]);
    }

    public function test_textbook_requires_content(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $course = Course::create(['course_category_id' => CourseCategory::create(['name' => 'Web', 'slug' => 'web'])->id, 'title' => 'Course', 'slug' => 'course']);
        $this->actingAs($admin)->put("/admin/courses/{$course->id}/builder", ['materials' => [[
            'title' => 'Intro', 'position' => 0, 'is_published' => true, 'contents' => [['type' => 'textbook', 'title' => 'Text', 'position' => 0, 'is_published' => true]],
        ]]])->assertSessionHasErrors();
    }

    public function test_material_from_another_course_cannot_be_modified(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
        $course = Course::create(['course_category_id' => $category->id, 'title' => 'Course', 'slug' => 'course']);
        $foreign = Course::create(['course_category_id' => $category->id, 'title' => 'Other', 'slug' => 'other']);
        $material = CourseMaterial::create(['course_id' => $foreign->id, 'title' => 'Foreign']);
        $this->actingAs($admin)->put("/admin/courses/{$course->id}/builder", ['materials' => [[
            'id' => $material->id, 'title' => 'No', 'position' => 0, 'is_published' => true, 'contents' => [],
        ]]])->assertSessionHasErrors();
    }
}
