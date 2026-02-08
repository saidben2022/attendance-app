<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with(['roles', 'organization'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('member_id', 'like', "%{$search}%");
                });
            })
            ->when($request->role, function ($query, $role) {
                $query->whereHas('roles', fn($q) => $q->where('name', $role));
            })
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        $roles = Role::orderBy('name')->pluck('name');

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function create()
    {
        $roles = Role::orderBy('name')->get(['id', 'name']);
        $organizations = Organization::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Users/Create', [
            'roles' => $roles,
            'organizations' => $organizations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'unique:users,phone'],
            'password' => ['required', Password::defaults()],
            'pin' => ['nullable', 'digits:4'],
            'member_id' => ['nullable', 'string', 'unique:users,member_id'],
            'organization_id' => ['nullable', 'exists:organizations,id'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['exists:roles,name'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'pin' => $validated['pin'] ? Hash::make($validated['pin']) : null,
            'member_id' => $validated['member_id'],
            'organization_id' => $validated['organization_id'],
        ]);

        $user->syncRoles($validated['roles']);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        $user->load(['roles', 'organization', 'enrollments.cohort.course']);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    public function edit(User $user)
    {
        $user->load('roles');
        $roles = Role::orderBy('name')->get(['id', 'name']);
        $organizations = Organization::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Users/Edit', [
            'user' => array_merge($user->toArray(), [
                'current_roles' => $user->roles->pluck('name')->toArray(),
            ]),
            'roles' => $roles,
            'organizations' => $organizations,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', Password::defaults()],
            'pin' => ['nullable', 'digits:4'],
            'member_id' => ['nullable', 'string', Rule::unique('users')->ignore($user->id)],
            'organization_id' => ['nullable', 'exists:organizations,id'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['exists:roles,name'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'member_id' => $validated['member_id'],
            'organization_id' => $validated['organization_id'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        if (!empty($validated['pin'])) {
            $updateData['pin'] = Hash::make($validated['pin']);
        }

        $user->update($updateData);
        $user->syncRoles($validated['roles']);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user, Request $request)
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'You cannot delete yourself.');
        }

        if ($user->enrollments()->exists()) {
            return back()->with('error', 'Cannot delete user with enrollments. Withdraw them first.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    public function resetPin(User $user)
    {
        $newPin = str_pad(random_int(0, 9999), 4, '0', STR_PAD_LEFT);

        $user->update([
            'pin' => Hash::make($newPin),
        ]);

        return back()->with('success', "PIN reset to: {$newPin}");
    }
}
