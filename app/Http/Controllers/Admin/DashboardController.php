<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Services\StudentDashboardService;
use App\Services\Admin\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $service, private StudentDashboardService $studentDashboard) {}

    public function __invoke(Request $request)
    {
        if ($request->user()?->getRawOriginal('role') === UserRole::Student->value) {
            return Inertia::render('student/dashboard', $this->studentDashboard->data($request->user()));
        }

        abort_unless($request->user()?->getRawOriginal('role') === UserRole::Admin->value, 403);

        return Inertia::render('dashboard', $this->service->data());
    }
}
