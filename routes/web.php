<?php

use App\Http\Controllers\Admin\CourseCategoryController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', 'admin'])
    ->group(function () {
        Route::resource('course-categories', CourseCategoryController::class)
            ->only(['index', 'store', 'update', 'destroy']);
    });

require __DIR__.'/settings.php';
