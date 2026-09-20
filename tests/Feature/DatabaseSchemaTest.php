<?php

namespace Tests\Feature;

use App\Enums\ContentType;
use App\Enums\CourseStatus;
use App\Enums\EbookStatus;
use App\Enums\EnrollmentStatus;
use App\Enums\ProgressStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Ebook;
use App\Models\LearningContent;
use App\Models\LearningContentProgress;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class DatabaseSchemaTest extends TestCase
{
    use RefreshDatabase;

    public function test_lms_tables_and_required_columns_exist(): void
    {
        $tables = [
            'course_categories',
            'courses',
            'teachers',
            'course_teachers',
            'course_materials',
            'learning_contents',
            'course_enrollments',
            'learning_content_progress',
            'course_material_progress',
            'ebook_categories',
            'ebooks',
        ];

        foreach ($tables as $table) {
            $this->assertTrue(Schema::hasTable($table), "Missing table: {$table}");
        }

        $this->assertTrue(Schema::hasColumns('users', [
            'role',
            'phone',
            'last_login_at',
            'deleted_at',
        ]));
        $this->assertTrue(Schema::hasColumns('courses', [
            'course_category_id',
            'status',
            'created_by',
            'deleted_at',
        ]));
        $this->assertTrue(Schema::hasColumns('learning_contents', [
            'type',
            'youtube_video_id',
            'textbook_content',
            'deleted_at',
        ]));
        $this->assertTrue(Schema::hasColumns('course_enrollments', [
            'progress_percentage',
            'last_learning_content_id',
        ]));
        $this->assertTrue(Schema::hasColumns('ebooks', [
            'ebook_category_id',
            'status',
            'file_size',
            'deleted_at',
        ]));
    }

    public function test_domain_models_cast_enums_and_define_core_relationships(): void
    {
        $this->assertSame(UserRole::Student, (new User)->forceFill(['role' => 'student'])->role);
        $this->assertSame(CourseStatus::Published, Course::make(['status' => 'published'])->status);
        $this->assertSame(ContentType::Video, LearningContent::make(['type' => 'video'])->type);
        $this->assertSame(EnrollmentStatus::Enrolled, CourseEnrollment::make(['status' => 'enrolled'])->status);
        $this->assertSame(ProgressStatus::Completed, LearningContentProgress::make(['status' => 'completed'])->status);
        $this->assertSame(EbookStatus::Draft, Ebook::make(['status' => 'draft'])->status);

        $course = new Course;
        $this->assertInstanceOf(BelongsTo::class, $course->category());
        $this->assertInstanceOf(BelongsToMany::class, $course->teachers());
        $this->assertInstanceOf(HasMany::class, $course->materials());
        $this->assertInstanceOf(BelongsTo::class, (new CourseEnrollment)->lastLearningContent());
    }

    public function test_composite_unique_constraints_reject_duplicates(): void
    {
        $timestamp = now();
        $user = User::factory()->create();
        $categoryId = DB::table('course_categories')->insertGetId([
            'name' => 'Development',
            'slug' => 'development',
            'created_at' => $timestamp,
            'updated_at' => $timestamp,
        ]);
        $courseId = DB::table('courses')->insertGetId([
            'course_category_id' => $categoryId,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
            'created_at' => $timestamp,
            'updated_at' => $timestamp,
        ]);
        $teacherId = DB::table('teachers')->insertGetId([
            'name' => 'Jane Doe',
            'created_at' => $timestamp,
            'updated_at' => $timestamp,
        ]);
        $materialId = DB::table('course_materials')->insertGetId([
            'course_id' => $courseId,
            'title' => 'Introduction',
            'created_at' => $timestamp,
            'updated_at' => $timestamp,
        ]);
        $contentId = DB::table('learning_contents')->insertGetId([
            'course_material_id' => $materialId,
            'type' => 'video',
            'title' => 'Welcome',
            'created_at' => $timestamp,
            'updated_at' => $timestamp,
        ]);

        $this->assertDuplicateInsertIsRejected('course_teachers', [
            'course_id' => $courseId,
            'teacher_id' => $teacherId,
        ]);
        $this->assertDuplicateInsertIsRejected('course_enrollments', [
            'user_id' => $user->id,
            'course_id' => $courseId,
        ]);
        $this->assertDuplicateInsertIsRejected('learning_content_progress', [
            'user_id' => $user->id,
            'course_id' => $courseId,
            'course_material_id' => $materialId,
            'learning_content_id' => $contentId,
        ]);
        $this->assertDuplicateInsertIsRejected('course_material_progress', [
            'user_id' => $user->id,
            'course_id' => $courseId,
            'course_material_id' => $materialId,
        ]);
    }

    /** @param array<string, mixed> $attributes */
    private function assertDuplicateInsertIsRejected(string $table, array $attributes): void
    {
        DB::table($table)->insert($attributes);

        try {
            DB::table($table)->insert($attributes);
            $this->fail("Duplicate insert succeeded for {$table}.");
        } catch (QueryException) {
            $this->addToAssertionCount(1);
        }
    }
}
