<?php

use App\Http\Controllers\Admin\CourseBuilderController;
use App\Http\Controllers\Admin\CourseCategoryController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\CourseMaterialController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EbookCategoryController;
use App\Http\Controllers\Admin\EbookController;
use App\Http\Controllers\Admin\LearningContentController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\CourseCatalogController;
use App\Http\Controllers\CourseDetailController;
use App\Http\Controllers\CourseEnrollmentController;
use App\Http\Controllers\StudentClassController;
use App\Http\Controllers\StudentStudyController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('courses', CourseCatalogController::class)->name('courses.index');
Route::get('courses/{course:slug}', CourseDetailController::class)->name('courses.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::post('courses/{course:slug}/enroll', CourseEnrollmentController::class)->name('courses.enroll');
    Route::get('student/classes', [StudentClassController::class, 'index'])->name('student.classes.index');
    Route::get('student/classes/{course:slug}/study/{content?}', [StudentStudyController::class, 'show'])->name('student.classes.study');
    Route::post('student/classes/{course:slug}/study/{content}/complete', [StudentStudyController::class, 'complete'])->name('student.classes.study.complete');
});

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', 'admin'])
    ->group(function () {
        Route::resource('courses', CourseController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
        Route::get('courses/{course}/builder', [CourseBuilderController::class, 'show'])->name('courses.builder');
        Route::put('courses/{course}/builder', [CourseBuilderController::class, 'update'])->name('courses.builder.update');
        Route::resource('course-materials', CourseMaterialController::class)
            ->only(['index', 'store', 'update']);
        Route::resource('learning-contents', LearningContentController::class)
            ->only(['index', 'store', 'update']);
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
