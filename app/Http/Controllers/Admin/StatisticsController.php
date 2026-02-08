<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use App\Models\CheckInEvent;
use App\Models\Cohort;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));
        $cohortId = $request->input('cohort_id');
        $courseId = $request->input('course_id');

        // Overall stats
        $overallStats = $this->getOverallStats();

        // Attendance by status
        $attendanceByStatus = $this->getAttendanceByStatus($startDate, $endDate, $cohortId);

        // Daily attendance trend
        $dailyTrend = $this->getDailyTrend($startDate, $endDate, $cohortId);

        // Cohort comparison
        $cohortComparison = $this->getCohortComparison($startDate, $endDate);

        // Top performers
        $topPerformers = $this->getTopPerformers($startDate, $endDate, $cohortId);

        // At-risk students (low attendance)
        $atRiskStudents = $this->getAtRiskStudents($cohortId);

        // Courses and cohorts for filters
        $courses = Course::where('is_active', true)->get(['id', 'name']);
        $cohorts = Cohort::where('is_active', true)->get(['id', 'name', 'course_id']);

        return Inertia::render('Admin/Statistics/Index', [
            'overallStats' => $overallStats,
            'attendanceByStatus' => $attendanceByStatus,
            'dailyTrend' => $dailyTrend,
            'cohortComparison' => $cohortComparison,
            'topPerformers' => $topPerformers,
            'atRiskStudents' => $atRiskStudents,
            'courses' => $courses,
            'cohorts' => $cohorts,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'cohort_id' => $cohortId,
                'course_id' => $courseId,
            ],
        ]);
    }

    protected function getOverallStats(): array
    {
        $totalCheckIns = CheckInEvent::count();
        $presentCount = CheckInEvent::where('status', 'present')->count();
        $lateCount = CheckInEvent::where('status', 'late')->count();
        $absentCount = CheckInEvent::where('status', 'absent')->count();

        return [
            'total_check_ins' => $totalCheckIns,
            'present_count' => $presentCount,
            'late_count' => $lateCount,
            'absent_count' => $absentCount,
            'attendance_rate' => $totalCheckIns > 0
                ? round((($presentCount + $lateCount) / $totalCheckIns) * 100, 1)
                : 0,
            'active_students' => Enrollment::where('status', 'active')->distinct('user_id')->count('user_id'),
            'active_cohorts' => Cohort::where('is_active', true)->count(),
            'total_sessions' => AttendanceSession::count(),
        ];
    }

    protected function getAttendanceByStatus($startDate, $endDate, $cohortId = null): array
    {
        $query = CheckInEvent::whereBetween('created_at', [$startDate, Carbon::parse($endDate)->endOfDay()]);

        if ($cohortId) {
            $query->whereHas('slot.attendanceSession', function ($q) use ($cohortId) {
                $q->where('cohort_id', $cohortId);
            });
        }

        return [
            ['name' => 'Présent', 'value' => (clone $query)->where('status', 'present')->count(), 'color' => '#10b981'],
            ['name' => 'Retard', 'value' => (clone $query)->where('status', 'late')->count(), 'color' => '#f59e0b'],
            ['name' => 'Absent', 'value' => (clone $query)->where('status', 'absent')->count(), 'color' => '#ef4444'],
            ['name' => 'Excusé', 'value' => (clone $query)->where('status', 'excused')->count(), 'color' => '#3b82f6'],
        ];
    }

    protected function getDailyTrend($startDate, $endDate, $cohortId = null): array
    {
        $query = CheckInEvent::selectRaw('DATE(created_at) as date, status, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, Carbon::parse($endDate)->endOfDay()])
            ->groupBy('date', 'status');

        if ($cohortId) {
            $query->whereHas('slot.attendanceSession', function ($q) use ($cohortId) {
                $q->where('cohort_id', $cohortId);
            });
        }

        $results = $query->get();

        // Group by date
        $trend = [];
        foreach ($results as $row) {
            if (!isset($trend[$row->date])) {
                $trend[$row->date] = ['date' => $row->date, 'present' => 0, 'late' => 0, 'absent' => 0];
            }
            $trend[$row->date][$row->status] = $row->count;
        }

        return array_values($trend);
    }

    protected function getCohortComparison($startDate, $endDate): array
    {
        $cohorts = Cohort::where('is_active', true)
            ->withCount([
                'enrollments' => function ($q) {
                    $q->where('status', 'active');
                }
            ])
            ->get();

        $comparison = [];
        foreach ($cohorts as $cohort) {
            $sessions = AttendanceSession::where('cohort_id', $cohort->id)
                ->whereBetween('session_date', [$startDate, $endDate])
                ->pluck('id');

            $checkIns = CheckInEvent::whereHas('slot', function ($q) use ($sessions) {
                $q->whereIn('attendance_session_id', $sessions);
            })->get();

            $total = $checkIns->count();
            $present = $checkIns->whereIn('status', ['present', 'late'])->count();

            $comparison[] = [
                'name' => $cohort->name,
                'students' => $cohort->enrollments_count,
                'attendance_rate' => $total > 0 ? round(($present / $total) * 100, 1) : 0,
            ];
        }

        return $comparison;
    }

    protected function getTopPerformers($startDate, $endDate, $cohortId = null): array
    {
        // Use PHP-based sorting to avoid MySQL aggregate alias issues
        $query = CheckInEvent::selectRaw('user_id, COUNT(*) as total, SUM(CASE WHEN status IN ("present", "late") THEN 1 ELSE 0 END) as present_count')
            ->whereBetween('created_at', [$startDate, Carbon::parse($endDate)->endOfDay()])
            ->groupBy('user_id')
            ->havingRaw('COUNT(*) >= 5');

        if ($cohortId) {
            $query->whereHas('slot.attendanceSession', function ($q) use ($cohortId) {
                $q->where('cohort_id', $cohortId);
            });
        }

        $results = $query->get()
            ->map(function ($row) {
                $row->rate = $row->total > 0 ? ($row->present_count / $row->total) : 0;
                return $row;
            })
            ->sortByDesc('rate')
            ->take(5);

        return $results->map(function ($row) {
            $user = User::find($row->user_id);
            return [
                'name' => $user?->name ?? 'Inconnu',
                'attendance_rate' => round($row->rate * 100, 1),
                'total_sessions' => $row->total,
            ];
        })->values()->toArray();
    }

    protected function getAtRiskStudents($cohortId = null): array
    {
        // Use PHP-based filtering to avoid MySQL aggregate alias issues
        $query = CheckInEvent::selectRaw('user_id, COUNT(*) as total, SUM(CASE WHEN status IN ("present", "late") THEN 1 ELSE 0 END) as present_count')
            ->groupBy('user_id')
            ->havingRaw('COUNT(*) >= 3');

        if ($cohortId) {
            $query->whereHas('slot.attendanceSession', function ($q) use ($cohortId) {
                $q->where('cohort_id', $cohortId);
            });
        }

        $results = $query->get()
            ->map(function ($row) {
                $row->rate = $row->total > 0 ? ($row->present_count / $row->total) : 0;
                return $row;
            })
            ->filter(fn($row) => $row->rate < 0.7)
            ->sortBy('rate')
            ->take(5);

        return $results->map(function ($row) {
            $user = User::find($row->user_id);
            return [
                'name' => $user?->name ?? 'Inconnu',
                'attendance_rate' => round($row->rate * 100, 1),
                'absences' => $row->total - $row->present_count,
            ];
        })->values()->toArray();
    }
}
