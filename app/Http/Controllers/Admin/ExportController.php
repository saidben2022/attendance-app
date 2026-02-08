<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Cohort;
use App\Models\User;
use App\Models\CheckInEvent;
use App\Models\AttendanceSession;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ExportController extends Controller
{
    /**
     * Export users to CSV
     */
    public function users(Request $request)
    {
        $users = User::with(['organization', 'roles'])->get();

        $headers = ['ID', 'Name', 'Email', 'Phone', 'Organization', 'Roles', 'Created At'];

        $callback = function () use ($users, $headers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);

            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->phone,
                    $user->organization?->name ?? '',
                    $user->roles->pluck('name')->implode(', '),
                    $user->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($file);
        };

        $filename = 'users_' . date('Y-m-d_His') . '.csv';

        return Response::stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Export cohort attendance to CSV
     */
    public function cohortAttendance(Request $request, Cohort $cohort)
    {
        $cohort->load([
            'course',
            'enrollments.user',
            'attendanceSessions.slots.checkInEvents',
        ]);

        $headers = ['Date', 'Student Name', 'Student Email', 'AM Status', 'AM Time', 'PM Status', 'PM Time'];

        $callback = function () use ($cohort, $headers) {
            $file = fopen('php://output', 'w');

            // Add cohort info header
            fputcsv($file, ['Cohort:', $cohort->name]);
            fputcsv($file, ['Course:', $cohort->course->name]);
            fputcsv($file, ['Period:', $cohort->start_date->format('Y-m-d') . ' to ' . $cohort->end_date->format('Y-m-d')]);
            fputcsv($file, []); // Empty row
            fputcsv($file, $headers);

            $enrolledUserIds = $cohort->enrollments->pluck('user_id');

            foreach ($cohort->attendanceSessions->sortBy('session_date') as $session) {
                foreach ($cohort->enrollments as $enrollment) {
                    $user = $enrollment->user;

                    $amSlot = $session->slots->firstWhere('type', 'am');
                    $pmSlot = $session->slots->firstWhere('type', 'pm');

                    $amCheckIn = $amSlot?->checkInEvents->firstWhere('user_id', $user->id);
                    $pmCheckIn = $pmSlot?->checkInEvents->firstWhere('user_id', $user->id);

                    fputcsv($file, [
                        $session->session_date->format('Y-m-d'),
                        $user->name,
                        $user->email,
                        $amCheckIn?->status ?? 'N/A',
                        $amCheckIn?->checked_in_at?->format('H:i') ?? '',
                        $pmCheckIn?->status ?? 'N/A',
                        $pmCheckIn?->checked_in_at?->format('H:i') ?? '',
                    ]);
                }
            }

            fclose($file);
        };

        $filename = 'attendance_' . $cohort->name . '_' . date('Y-m-d_His') . '.csv';
        $filename = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $filename);

        return Response::stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Export session attendance to CSV
     */
    public function sessionAttendance(Request $request, AttendanceSession $session)
    {
        $session->load([
            'cohort.course',
            'cohort.enrollments.user',
            'slots.checkInEvents.user',
        ]);

        $headers = ['Student Name', 'Student Email', 'Slot', 'Status', 'Check-in Time', 'Manual Entry', 'Notes'];

        $callback = function () use ($session, $headers) {
            $file = fopen('php://output', 'w');

            // Add session info header
            fputcsv($file, ['Session Date:', $session->session_date->format('Y-m-d')]);
            fputcsv($file, ['Course:', $session->cohort->course->name]);
            fputcsv($file, ['Cohort:', $session->cohort->name]);
            fputcsv($file, []); // Empty row
            fputcsv($file, $headers);

            foreach ($session->slots as $slot) {
                foreach ($session->cohort->enrollments as $enrollment) {
                    $user = $enrollment->user;
                    $checkIn = $slot->checkInEvents->firstWhere('user_id', $user->id);

                    fputcsv($file, [
                        $user->name,
                        $user->email,
                        strtoupper($slot->type),
                        $checkIn?->status ?? 'absent',
                        $checkIn?->checked_in_at?->format('H:i:s') ?? '',
                        $checkIn?->is_manual_entry ? 'Yes' : 'No',
                        $checkIn?->notes ?? '',
                    ]);
                }
            }

            fclose($file);
        };

        $filename = 'session_' . $session->session_date->format('Y-m-d') . '.csv';

        return Response::stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Export courses to CSV
     */
    public function courses(Request $request)
    {
        $courses = Course::with(['organization', 'cohorts'])->get();

        $headers = ['ID', 'Code', 'Name', 'Organization', 'Active Cohorts', 'Total Cohorts', 'Created At'];

        $callback = function () use ($courses, $headers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);

            foreach ($courses as $course) {
                fputcsv($file, [
                    $course->id,
                    $course->code,
                    $course->name,
                    $course->organization?->name ?? '',
                    $course->cohorts->where('is_active', true)->count(),
                    $course->cohorts->count(),
                    $course->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($file);
        };

        $filename = 'courses_' . date('Y-m-d_His') . '.csv';

        return Response::stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
