<?php

namespace Tests\Feature;

use App\Enums\CourseStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\CourseMaterialProgress;
use App\Models\Ebook;
use App\Models\LearningContentProgress;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_seeder_creates_complete_demo_catalog(): void
    {
        $this->seed(DatabaseSeeder::class);

        $admin = User::query()->where('phone', '088888888')->firstOrFail();

        $this->assertSame(UserRole::Admin, $admin->role);
        $this->assertSame(2, User::query()->where('role', UserRole::Student)->count());
        $this->assertTrue(User::query()->whereNull('email')->exists());

        $this->assertDatabaseCount('course_categories', 6);
        $this->assertDatabaseCount('teachers', 6);
        $this->assertDatabaseCount('courses', 9);
        $this->assertDatabaseCount('course_materials', 18);
        $this->assertDatabaseCount('learning_contents', 54);
        $this->assertSame(9, Course::query()->where('status', CourseStatus::Published)->count());

        $this->assertDatabaseCount('ebook_categories', 6);
        $this->assertSame(9, Ebook::query()->count());

        $this->assertSame(6, CourseEnrollment::query()->count());
        $this->assertSame(36, LearningContentProgress::query()->count());
        $this->assertSame(12, CourseMaterialProgress::query()->count());
    }
}
