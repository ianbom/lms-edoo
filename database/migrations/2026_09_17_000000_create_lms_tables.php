<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->string('photo_url', 500)->nullable();
            $table->string('expertise')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_category_id')->constrained()->restrictOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('short_description', 500)->nullable();
            $table->text('description')->nullable();
            $table->string('thumbnail_url', 500)->nullable();
            $table->string('banner_url', 500)->nullable();
            $table->string('level', 100)->nullable();
            $table->integer('estimated_duration_minutes')->nullable();
            $table->string('status')->default('draft')->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('course_teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->integer('position')->default(0)->index();
            $table->timestamps();

            $table->unique(['course_id', 'teacher_id']);
        });

        Schema::create('course_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('position')->default(0)->index();
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('learning_contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_material_id')->constrained()->cascadeOnDelete();
            $table->string('type')->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('position')->default(0)->index();
            $table->string('youtube_url', 500)->nullable();
            $table->string('youtube_video_id', 50)->nullable()->index();
            $table->integer('video_duration_seconds')->nullable();
            $table->text('textbook_content')->nullable();
            $table->string('attachment_url', 500)->nullable();
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('enrolled')->index();
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->foreignId('last_learning_content_id')->nullable()->constrained('learning_contents')->nullOnDelete();
            $table->timestamp('enrolled_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable()->index();
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });

        Schema::create('learning_content_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_material_id')->constrained()->cascadeOnDelete();
            $table->foreignId('learning_content_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('not_started')->index();
            $table->integer('watched_seconds')->default(0);
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->timestamp('first_viewed_at')->nullable();
            $table->timestamp('last_viewed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'learning_content_id']);
        });

        Schema::create('course_material_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_material_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('not_started')->index();
            $table->integer('total_contents')->default(0);
            $table->integer('completed_contents')->default(0);
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'course_material_id']);
        });

        Schema::create('ebook_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('thumbnail_url', 500)->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->integer('position')->default(0)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('ebooks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ebook_category_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('author')->nullable();
            $table->string('short_description', 500)->nullable();
            $table->text('description')->nullable();
            $table->string('cover_url', 500)->nullable();
            $table->string('file_url', 500)->nullable();
            $table->string('file_name')->nullable();
            $table->string('file_type', 100)->nullable();
            $table->bigInteger('file_size')->nullable();
            $table->integer('total_pages')->nullable();
            $table->string('status')->default('draft')->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ebooks');
        Schema::dropIfExists('ebook_categories');
        Schema::dropIfExists('course_material_progress');
        Schema::dropIfExists('learning_content_progress');
        Schema::dropIfExists('course_enrollments');
        Schema::dropIfExists('learning_contents');
        Schema::dropIfExists('course_materials');
        Schema::dropIfExists('course_teachers');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('teachers');
        Schema::dropIfExists('course_categories');
    }
};
