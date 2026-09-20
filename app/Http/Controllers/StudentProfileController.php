<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $this->student($request);

        return Inertia::render('student/profile', [
            'profile' => $this->profileData($user),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $this->student($request);
        $user->fill($request->validated())->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Profile updated.'),
        ]);

        return to_route('student.profile.edit');
    }

    public function updatePassword(PasswordUpdateRequest $request): RedirectResponse
    {
        $user = $this->student($request);
        $user->update(['password' => $request->validated('password')]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Password updated.'),
        ]);

        return to_route('student.profile.edit');
    }

    private function student(Request $request): User
    {
        $user = $request->user();

        abort_unless($user instanceof User && $user->role === UserRole::Student, 403);

        return $user;
    }

    /** @return array<string, mixed> */
    private function profileData(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'phone' => $user->phone,
            'email' => $user->email,
            'status' => $user->trashed() ? 'deleted' : 'active',
            'created_at' => $user->created_at?->toISOString(),
            'updated_at' => $user->updated_at?->toISOString(),
        ];
    }
}
