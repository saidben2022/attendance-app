<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\Course;
use App\Models\ScheduleRule;
use App\Services\SessionGeneratorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CohortController extends Controller
{
    public function index(Request $request)
    {
        $cohorts = Cohort::with(['course.organization'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->course_id, function ($query, $courseId) {
                $query->where('course_id', $courseId);
            })
            ->orderBy('start_date', 'desc')
            ->paginate(15)
            ->withQueryString();

        $courses = Course::where('is_active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Cohorts/Index', [
            'cohorts' => $cohorts,
            'courses' => $courses,
            'filters' => $request->only(['search', 'course_id']),
        ]);
    }

    public function create()
    {
        $courses = Course::where('is_active', true)
            ->with('organization')
            ->orderBy('name')
            ->get(['id', 'name', 'organization_id']);

        return Inertia::render('Admin/Cohorts/Create', [
            'courses' => $courses,
            'daysOfWeek' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        ]);
    }

    public function store(Request $request, SessionGeneratorService $sessionGenerator)
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'am_start' => ['nullable', 'date_format:H:i'],
            'am_end' => ['nullable', 'date_format:H:i', 'after:am_start'],
            'pm_start' => ['nullable', 'date_format:H:i'],
            'pm_end' => ['nullable', 'date_format:H:i', 'after:pm_start'],
            'grace_period_minutes' => ['nullable', 'integer', 'min:0', 'max:60'],
            'schedule_rules' => ['required', 'array'],
            'schedule_rules.*.day_of_week' => ['required', 'string'],
            'schedule_rules.*.has_am_slot' => ['boolean'],
            'schedule_rules.*.has_pm_slot' => ['boolean'],
        ]);

        $cohort = Cohort::create([
            'course_id' => $validated['course_id'],
            'name' => $validated['name'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'am_start' => $validated['am_start'] ?? '08:00',
            'am_end' => $validated['am_end'] ?? '12:00',
            'pm_start' => $validated['pm_start'] ?? '13:00',
            'pm_end' => $validated['pm_end'] ?? '17:00',
            'grace_period_minutes' => $validated['grace_period_minutes'],
            'is_active' => true,
        ]);

        // Create schedule rules
        foreach ($validated['schedule_rules'] as $rule) {
            if ($rule['has_am_slot'] || $rule['has_pm_slot']) {
                ScheduleRule::create([
                    'cohort_id' => $cohort->id,
                    'day_of_week' => $rule['day_of_week'],
                    'has_am_slot' => $rule['has_am_slot'] ?? false,
                    'has_pm_slot' => $rule['has_pm_slot'] ?? false,
                ]);
            }
        }

        // Generate sessions
        $sessionGenerator->generateForCohort($cohort);

        return redirect()->route('admin.cohorts.show', $cohort)
            ->with('success', 'Cohort created and sessions generated successfully.');
    }

    public function show(Cohort $cohort)
    {
        $cohort->load([
            'course.organization',
            'scheduleRules',
            'scheduleExceptions',
            'enrollments.user',
            'attendanceSessions' => function ($query) {
                $query->orderBy('session_date', 'desc')->limit(30);
            },
            'attendanceSessions.slots',
        ]);

        $enrollmentStats = [
            'active' => $cohort->enrollments->where('status', 'active')->count(),
            'withdrawn' => $cohort->enrollments->where('status', 'withdrawn')->count(),
            'completed' => $cohort->enrollments->where('status', 'completed')->count(),
        ];

        return Inertia::render('Admin/Cohorts/Show', [
            'cohort' => $cohort,
            'enrollmentStats' => $enrollmentStats,
        ]);
    }

    public function edit(Cohort $cohort)
    {
        $cohort->load('scheduleRules');

        $courses = Course::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Cohorts/Edit', [
            'cohort' => $cohort,
            'courses' => $courses,
            'daysOfWeek' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        ]);
    }

    public function update(Request $request, Cohort $cohort)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'am_start' => ['nullable', 'date_format:H:i'],
            'am_end' => ['nullable', 'date_format:H:i'],
            'pm_start' => ['nullable', 'date_format:H:i'],
            'pm_end' => ['nullable', 'date_format:H:i'],
            'grace_period_minutes' => ['nullable', 'integer', 'min:0', 'max:60'],
            'is_active' => ['boolean'],
        ]);

        $cohort->update($validated);

        return redirect()->route('admin.cohorts.show', $cohort)
            ->with('success', 'Cohort updated successfully.');
    }

    public function destroy(Cohort $cohort)
    {
        if ($cohort->enrollments()->where('status', 'active')->exists()) {
            return back()->with('error', 'Cannot delete cohort with active enrollments.');
        }

        $cohort->delete();

        return redirect()->route('admin.cohorts.index')
            ->with('success', 'Cohort deleted successfully.');
    }

    public function regenerateSessions(Cohort $cohort, SessionGeneratorService $sessionGenerator)
    {
        $sessions = $sessionGenerator->generateForCohort($cohort, true);

        return back()->with('success', "Regenerated {$sessions->count()} sessions.");
    }
}
