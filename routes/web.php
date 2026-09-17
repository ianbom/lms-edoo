<?php

use App\Http\Controllers\Admin\CourseCategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EbookCategoryController;
use App\Http\Controllers\Admin\EbookController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TeacherController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', 'admin'])
    ->group(function () {
        Route::resource('course-categories', CourseCategoryController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('ebook-categories', EbookCategoryController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('ebooks', EbookController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('students', StudentController::class)
            ->only(['index', 'store']);
        Route::resource('teachers', TeacherController::class)
            ->only(['index', 'store', 'update']);
    });

require __DIR__.'/settings.php';
