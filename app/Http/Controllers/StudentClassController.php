<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Services\StudentClassService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentClassController extends Controller
{
    public function __construct(private StudentClassService $service) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()?->role === UserRole::Student, 403);

        return Inertia::render('student/class/my-class', ['classes' => $this->service->paginate($request->user())]);
    }
}
