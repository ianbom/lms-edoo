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
use App\Http\Controllers\EbookCatalogController;
use App\Http\Controllers\StudentClassController;
use App\Http\Controllers\StudentEbookController;
use App\Http\Controllers\StudentProfileController;
use App\Http\Controllers\StudentStudyController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', WelcomeController::class)->name('home');
Route::get('courses', CourseCatalogController::class)->name('courses.index');
Route::get('courses/{course:slug}', CourseDetailController::class)->name('courses.show');
Route::get('ebooks', EbookCatalogController::class)->name('ebooks.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::post('courses/{course:slug}/enroll', CourseEnrollmentController::class)->name('courses.enroll');
    Route::get('student/classes', [StudentClassController::class, 'index'])->name('student.classes.index');
    Route::get('student/ebooks', StudentEbookController::class)->name('student.ebooks.index');
    Route::get('student/profile', [StudentProfileController::class, 'edit'])->name('student.profile.edit');
    Route::patch('student/profile', [StudentProfileController::class, 'update'])->name('student.profile.update');
    Route::put('student/profile/password', [StudentProfileController::class, 'updatePassword'])
        ->middleware('throttle:6,1')
        ->name('student.profile.password');
    Route::get('student/classes/{course:slug}/study/{content?}', [StudentStudyController::class, 'show'])->name('student.classes.study');
    Route::post('student/classes/{course:slug}/study/{content}/complete', [StudentStudyController::class, 'complete'])->name('student.classes.study.complete');
});

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', 'admin'])
    ->group(function () {
        Route::resource('courses', CourseController::class)
            ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
        Route::get('courses/{course}/builder', [CourseBuilderController::class, 'show'])->name('courses.builder');
        Route::put('courses/{course}/builder', [CourseBuilderController::class, 'update'])->name('courses.builder.update');
        Route::put('courses/{course}/curriculum/order', [CourseController::class, 'reorderCurriculum'])->name('courses.curriculum.reorder');
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
        Route::get('students/{student}/progress', [StudentController::class, 'progress'])
            ->name('students.progress');
        Route::put('students/{student}/password', [StudentController::class, 'resetPassword'])
            ->name('students.password.update');
        Route::resource('teachers', TeacherController::class)
            ->only(['index', 'store', 'update']);
    });

require __DIR__.'/settings.php';
