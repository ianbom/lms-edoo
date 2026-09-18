<?php

use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseMaterial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('admin can create and update course materials', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
    $course = Course::create(['course_category_id' => $category->id, 'title' => 'Course', 'slug' => 'course']);

    $this->actingAs($admin)->post(route('admin.course-materials.store'), [
        'course_id' => $course->id,
        'title' => 'Introduction',
        'description' => 'Course opening',
        'position' => 0,
        'is_published' => true,
    ])->assertRedirect(route('admin.course-materials.index'));

    $material = CourseMaterial::firstOrFail();

    $this->actingAs($admin)->put(route('admin.course-materials.update', $material), [
        'course_id' => $course->id,
        'title' => 'Updated introduction',
        'description' => null,
        'position' => 1,
        'is_published' => false,
    ])->assertRedirect(route('admin.course-materials.index'));

    $this->assertDatabaseHas('course_materials', ['id' => $material->id, 'title' => 'Updated introduction', 'position' => 1, 'is_published' => false]);
});

test('admin can create video and textbook learning contents', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
    $course = Course::create(['course_category_id' => $category->id, 'title' => 'Course', 'slug' => 'course']);
    $material = CourseMaterial::create(['course_id' => $course->id, 'title' => 'Material', 'position' => 0, 'is_published' => true]);

    $this->actingAs($admin)->post(route('admin.learning-contents.store'), [
        'course_material_id' => $material->id,
        'type' => 'video',
        'title' => 'Video lesson',
        'description' => null,
        'position' => 0,
        'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'textbook_content' => null,
        'attachment_url' => null,
        'is_published' => true,
    ])->assertRedirect(route('admin.learning-contents.index'));

    $this->actingAs($admin)->post(route('admin.learning-contents.store'), [
        'course_material_id' => $material->id,
        'type' => 'textbook',
        'title' => 'Reading lesson',
        'description' => null,
        'position' => 1,
        'youtube_url' => null,
        'textbook_content' => '<p>Safe chapter</p>',
        'attachment_url' => null,
        'is_published' => true,
    ])->assertRedirect(route('admin.learning-contents.index'));

    $this->assertDatabaseHas('learning_contents', ['course_material_id' => $material->id, 'title' => 'Video lesson', 'youtube_video_id' => 'dQw4w9WgXcQ']);
    $this->assertDatabaseHas('learning_contents', ['course_material_id' => $material->id, 'title' => 'Reading lesson', 'youtube_url' => null]);
});
