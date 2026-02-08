<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use App\Models\CheckInEvent;
use App\Models\Cohort;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Slot;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today();

        // Get stats based on user role
        $stats = $this->getStatsForRole($user);

        // Today's sessions - filter by enrollment for attendees
        $todaySessionsQuery = AttendanceSession::whereDate('session_date', $today)
            ->with(['cohort.course', 'slots']);

        // Attendees only see sessions for their enrolled cohorts
        if (!$user->hasRole(['admin', 'coordinator', 'verifier', 'instructor'])) {
            $enrolledCohortIds = $user->enrollments()
                ->where('status', 'active')
                ->pluck('cohort_id');
            $todaySessionsQuery->whereIn('cohort_id', $enrolledCohortIds);
        }

        $todaySessions = $todaySessionsQuery->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'cohort_name' => $session->cohort->name,
                    'course_name' => $session->cohort->course->name,
                    'date' => $session->session_date->format('Y-m-d'),
                    'status' => $session->status,
                    'am_slot' => $session->slots->where('type', 'am')->first()?->only(['id', 'state']),
                    'pm_slot' => $session->slots->where('type', 'pm')->first()?->only(['id', 'state']),
                ];
            });

        // Recent activity (last 10 check-ins)
        // Filter by user role - attendees only see their own check-ins
        $recentActivityQuery = CheckInEvent::with(['user', 'slot.attendanceSession.cohort'])
            ->orderBy('created_at', 'desc')
            ->limit(10);

        // Attendees and instructors should only see their own check-ins
        if (!$user->hasRole(['admin', 'coordinator', 'verifier'])) {
            $recentActivityQuery->where('user_id', $user->id);
        }

        $recentActivity = $recentActivityQuery->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'user_name' => $event->user->name,
                    'status' => $event->status,
                    'cohort_name' => $event->slot->attendanceSession->cohort->name ?? 'Unknown',
                    'slot_type' => $event->slot->type,
                    'checked_in_at' => $event->checked_in_at?->diffForHumans(),
                    'is_manual' => $event->is_manual_entry,
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'todaySessions' => $todaySessions,
            'recentActivity' => $recentActivity,
            'userRole' => $user->roles->first()?->name ?? 'attendee',
        ]);
    }

    protected function getStatsForRole(User $user): array
    {
        $today = Carbon::today();

        if ($user->hasRole(['admin', 'coordinator'])) {
            return [
                'total_courses' => Course::where('is_active', true)->count(),
                'active_cohorts' => Cohort::where('is_active', true)
                    ->where('start_date', '<=', $today)
                    ->where('end_date', '>=', $today)
                    ->count(),
                'total_enrollments' => Enrollment::where('status', 'active')->count(),
                'today_sessions' => AttendanceSession::whereDate('session_date', $today)->count(),
                'open_slots' => Slot::where('state', 'open')->count(),
                'total_users' => User::count(),
            ];
        }

        if ($user->hasRole('verifier')) {
            return [
                'today_sessions' => AttendanceSession::whereDate('session_date', $today)->count(),
                'open_slots' => Slot::where('state', 'open')->count(),
                'pending_check_ins' => 0, // Will be calculated based on assigned cohorts
            ];
        }

        if ($user->hasRole('instructor')) {
            // Get cohorts where user teaches (via assigned courses)
            return [
                'my_cohorts' => 0, // Will be implemented with instructor assignment
                'today_sessions' => 0,
            ];
        }

        // Attendee
        $enrollments = $user->enrollments()->where('status', 'active')->count();
        $totalCheckIns = $user->checkInEvents()->count();
        $presentCount = $user->checkInEvents()->whereIn('status', ['present', 'late'])->count();

        return [
            'my_enrollments' => $enrollments,
            'total_check_ins' => $totalCheckIns,
            'attendance_rate' => $totalCheckIns > 0
                ? round(($presentCount / $totalCheckIns) * 100)
                : 100,
        ];
    }
}
