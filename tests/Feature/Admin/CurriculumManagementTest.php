<?php

use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseMaterial;
use App\Models\LearningContent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
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

test('admin can search course materials by material or course title', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
    $targetCourse = Course::create(['course_category_id' => $category->id, 'title' => 'Laravel Mastery', 'slug' => 'laravel-mastery']);
    $otherCourse = Course::create(['course_category_id' => $category->id, 'title' => 'Vue Fundamentals', 'slug' => 'vue-fundamentals']);
    CourseMaterial::create(['course_id' => $targetCourse->id, 'title' => 'Introduction', 'position' => 0]);
    CourseMaterial::create(['course_id' => $otherCourse->id, 'title' => 'Laravel Routing', 'position' => 0]);
    CourseMaterial::create(['course_id' => $otherCourse->id, 'title' => 'Components', 'position' => 1]);

    $this->actingAs($admin)->get('/admin/course-materials?search=Laravel')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/course-materials/index')
            ->where('filters.search', 'Laravel')
            ->has('materials.data', 2));
});

test('admin can search learning contents by content material or course title', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
    $targetCourse = Course::create(['course_category_id' => $category->id, 'title' => 'Laravel Mastery', 'slug' => 'laravel-mastery']);
    $otherCourse = Course::create(['course_category_id' => $category->id, 'title' => 'Vue Fundamentals', 'slug' => 'vue-fundamentals']);
    $targetMaterial = CourseMaterial::create(['course_id' => $targetCourse->id, 'title' => 'Introduction', 'position' => 0]);
    $otherMaterial = CourseMaterial::create(['course_id' => $otherCourse->id, 'title' => 'Laravel Routing', 'position' => 0]);
    $unmatchedMaterial = CourseMaterial::create(['course_id' => $otherCourse->id, 'title' => 'Components', 'position' => 1]);
    LearningContent::create(['course_material_id' => $targetMaterial->id, 'type' => 'video', 'title' => 'Welcome', 'position' => 0]);
    LearningContent::create(['course_material_id' => $otherMaterial->id, 'type' => 'video', 'title' => 'Routes', 'position' => 0]);
    LearningContent::create(['course_material_id' => $unmatchedMaterial->id, 'type' => 'video', 'title' => 'Templates', 'position' => 0]);

    $this->actingAs($admin)->get('/admin/learning-contents?search=Laravel')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/learning-contents/index')
            ->where('filters.search', 'Laravel')
            ->has('contents.data', 2));
});

test('course material pagination retains the search query', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
    $course = Course::create(['course_category_id' => $category->id, 'title' => 'Laravel Mastery', 'slug' => 'laravel-mastery']);

    foreach (range(1, 16) as $position) {
        CourseMaterial::create(['course_id' => $course->id, 'title' => "Module {$position}", 'position' => $position]);
    }

    $this->actingAs($admin)->get('/admin/course-materials?search=Module')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('materials.data', 15)
            ->where('materials.next_page_url', route('admin.course-materials.index', ['search' => 'Module', 'page' => 2])));
});

test('admin can filter course materials by course and choose per page', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
    $targetCourse = Course::create(['course_category_id' => $category->id, 'title' => 'Laravel Mastery', 'slug' => 'laravel-mastery']);
    $otherCourse = Course::create(['course_category_id' => $category->id, 'title' => 'Vue Fundamentals', 'slug' => 'vue-fundamentals']);

    foreach (range(1, 11) as $position) {
        CourseMaterial::create(['course_id' => $targetCourse->id, 'title' => "Module {$position}", 'position' => $position]);
    }

    CourseMaterial::create(['course_id' => $otherCourse->id, 'title' => 'Other module', 'position' => 1]);

    $this->actingAs($admin)
        ->get("/admin/course-materials?course_id={$targetCourse->id}&per_page=10")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.course_id', $targetCourse->id)
            ->where('filters.per_page', 10)
            ->has('materials.data', 10)
            ->where('materials.per_page', 10)
            ->where('materials.data.0.course_id', $targetCourse->id));
});

test('learning content pagination supports per page and retains filters', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
    $course = Course::create(['course_category_id' => $category->id, 'title' => 'Laravel Mastery', 'slug' => 'laravel-mastery']);
    $material = CourseMaterial::create(['course_id' => $course->id, 'title' => 'Dasar Laravel', 'position' => 0]);

    foreach (range(1, 11) as $position) {
        LearningContent::create([
            'course_material_id' => $material->id,
            'type' => 'video',
            'title' => "Pelajaran {$position}",
            'position' => $position,
        ]);
    }

    $this->actingAs($admin)
        ->get('/admin/learning-contents?search=Pelajaran&per_page=10')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.search', 'Pelajaran')
            ->where('filters.per_page', 10)
            ->has('contents.data', 10)
            ->where('contents.per_page', 10)
            ->where(
                'contents.next_page_url',
                route('admin.learning-contents.index', [
                    'search' => 'Pelajaran',
                    'per_page' => 10,
                    'page' => 2,
                ]),
            ));
});

test('admin can filter learning contents by course and module', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $category = CourseCategory::create(['name' => 'Web', 'slug' => 'web']);
    $targetCourse = Course::create(['course_category_id' => $category->id, 'title' => 'Laravel Mastery', 'slug' => 'laravel-mastery']);
    $otherCourse = Course::create(['course_category_id' => $category->id, 'title' => 'Vue Fundamentals', 'slug' => 'vue-fundamentals']);
    $targetMaterial = CourseMaterial::create(['course_id' => $targetCourse->id, 'title' => 'Dasar Laravel', 'position' => 1]);
    $otherMaterial = CourseMaterial::create(['course_id' => $targetCourse->id, 'title' => 'Lanjutan Laravel', 'position' => 2]);
    $outsideMaterial = CourseMaterial::create(['course_id' => $otherCourse->id, 'title' => 'Dasar Vue', 'position' => 1]);

    LearningContent::create(['course_material_id' => $targetMaterial->id, 'type' => 'video', 'title' => 'Target', 'position' => 1]);
    LearningContent::create(['course_material_id' => $otherMaterial->id, 'type' => 'video', 'title' => 'Other Laravel', 'position' => 1]);
    LearningContent::create(['course_material_id' => $outsideMaterial->id, 'type' => 'video', 'title' => 'Vue', 'position' => 1]);

    $this->actingAs($admin)
        ->get("/admin/learning-contents?course_id={$targetCourse->id}&course_material_id={$targetMaterial->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.course_id', $targetCourse->id)
            ->where('filters.course_material_id', $targetMaterial->id)
            ->has('contents.data', 1)
            ->where('contents.data.0.title', 'Target'));
});
