<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_content_progress');
    }
};
