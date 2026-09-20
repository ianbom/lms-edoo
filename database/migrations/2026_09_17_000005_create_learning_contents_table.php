<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_contents');
    }
};
