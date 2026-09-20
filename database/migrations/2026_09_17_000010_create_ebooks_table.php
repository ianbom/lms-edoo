<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }
};
