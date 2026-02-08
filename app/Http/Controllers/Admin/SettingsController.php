<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the settings page
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $organization = $user->organization;

        // Get system stats
        $stats = [
            'total_organizations' => Organization::count(),
            'total_users' => \App\Models\User::count(),
            'total_courses' => \App\Models\Course::count(),
            'total_cohorts' => \App\Models\Cohort::count(),
            'active_cohorts' => \App\Models\Cohort::where('is_active', true)->count(),
            'total_sessions' => \App\Models\AttendanceSession::count(),
            'total_checkins' => \App\Models\CheckInEvent::count(),
        ];

        return Inertia::render('Admin/Settings', [
            'organization' => $organization,
            'stats' => $stats,
        ]);
    }

    /**
     * Update organization settings
     */
    public function updateOrganization(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        $organization = $request->user()->organization;

        if ($organization) {
            $organization->update($validated);
        }

        return back()->with('success', 'Organization settings updated successfully.');
    }
}
