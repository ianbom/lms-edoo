<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $service) {}

    public function __invoke(Request $request)
    {
        if ($request->user()?->getRawOriginal('role') !== UserRole::Admin->value) {
            return to_route('home');
        }

return Inertia::render('dashboard', $this->service->data());
    }
}
