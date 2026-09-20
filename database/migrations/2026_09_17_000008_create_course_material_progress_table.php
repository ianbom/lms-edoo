<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('course_material_progress');
    }
};
