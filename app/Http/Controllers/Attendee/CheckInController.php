<?php

namespace App\Http\Controllers\Attendee;

use App\Http\Controllers\Controller;
use App\Models\Slot;
use App\Models\CheckInEvent;
use App\Models\SecondChanceToken;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckInController extends Controller
{
    /**
     * Display the attendee dashboard with today's sessions
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Get user's active enrollments with today's sessions
        $enrollments = $user->enrollments()
            ->where('status', 'active')
            ->with([
                'cohort.course',
                'cohort.attendanceSessions' => function ($q) {
                    $q->whereDate('session_date', Carbon::today())
                        ->with('slots');
                },
            ])
            ->get();

        $todaySessions = $enrollments->flatMap(function ($enrollment) use ($user) {
            return $enrollment->cohort->attendanceSessions->map(function ($session) use ($enrollment, $user) {
                return [
                    'cohort_name' => $enrollment->cohort->name,
                    'course_name' => $enrollment->cohort->course->name,
                    'session_date' => $session->session_date->format('Y-m-d'),
                    'slots' => $session->slots->map(function ($slot) use ($user) {
                        $checkIn = $slot->checkInEvents()->where('user_id', $user->id)->first();
                        return [
                            'id' => $slot->id,
                            'type' => $slot->type,
                            'state' => $slot->state,
                            'status' => $checkIn?->status ?? 'pending',
                            'checked_in_at' => $checkIn?->checked_in_at?->format('H:i'),
                        ];
                    }),
                ];
            });
        });

        // Get recent check-in history
        $recentCheckIns = CheckInEvent::where('user_id', $user->id)
            ->with('slot.attendanceSession.cohort.course')
            ->orderBy('checked_in_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($ci) => [
                'id' => $ci->id,
                'status' => $ci->status,
                'checked_in_at' => $ci->checked_in_at?->format('M j, H:i'),
                'session_date' => $ci->slot->attendanceSession->session_date->format('M j'),
                'slot_type' => $ci->slot->type,
                'course_name' => $ci->slot->attendanceSession->cohort->course->name,
                'cohort_name' => $ci->slot->attendanceSession->cohort->name,
            ]);

        // Calculate attendance stats
        $stats = [
            'present' => CheckInEvent::where('user_id', $user->id)->where('status', 'present')->count(),
            'late' => CheckInEvent::where('user_id', $user->id)->where('status', 'late')->count(),
            'absent' => CheckInEvent::where('user_id', $user->id)->where('status', 'absent')->count(),
            'excused' => CheckInEvent::where('user_id', $user->id)->where('status', 'excused')->count(),
        ];
        $total = array_sum($stats);
        $stats['attendance_rate'] = $total > 0 ? round((($stats['present'] + $stats['late']) / $total) * 100) : 100;

        return Inertia::render('Attendee/Dashboard', [
            'todaySessions' => $todaySessions,
            'recentCheckIns' => $recentCheckIns,
            'stats' => $stats,
        ]);
    }

    /**
     * Handle QR code scan - validate token and show PIN entry
     */
    public function scan(Request $request, string $token)
    {
        $slot = Slot::where('qr_token', $token)
            ->where('state', 'open')
            ->with('attendanceSession.cohort.course')
            ->first();

        if (!$slot) {
            return Inertia::render('Attendee/CheckInError', [
                'error' => 'invalid_qr',
                'message' => 'This QR code is invalid or the session is closed.',
            ]);
        }

        $user = $request->user();

        // Check if user is enrolled in this cohort
        $isEnrolled = $slot->attendanceSession->cohort->enrollments()
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->exists();

        if (!$isEnrolled) {
            return Inertia::render('Attendee/CheckInError', [
                'error' => 'not_enrolled',
                'message' => 'You are not enrolled in this course.',
            ]);
        }

        // Check if already checked in
        $existingCheckIn = CheckInEvent::where('slot_id', $slot->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingCheckIn) {
            return Inertia::render('Attendee/CheckInSuccess', [
                'status' => $existingCheckIn->status,
                'checkedInAt' => $existingCheckIn->checked_in_at?->format('H:i:s'),
                'message' => 'You have already checked in for this session.',
                'alreadyCheckedIn' => true,
            ]);
        }

        return Inertia::render('Attendee/PinEntry', [
            'slot' => [
                'id' => $slot->id,
                'type' => $slot->type,
            ],
            'session' => [
                'date' => $slot->attendanceSession->session_date->format('l, F j'),
            ],
            'cohort' => [
                'name' => $slot->attendanceSession->cohort->name,
                'course_name' => $slot->attendanceSession->cohort->course->name,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Verify PIN and complete check-in
     */
    public function verifyPin(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'pin' => 'required|string|size:4',
        ]);

        $user = $request->user();

        // Verify PIN
        if (!$user->pin_hash || !Hash::check($request->pin, $user->pin_hash)) {
            return back()->withErrors(['pin' => 'Invalid PIN. Please try again.']);
        }

        // Find the slot
        $slot = Slot::where('qr_token', $request->token)
            ->where('state', 'open')
            ->with('attendanceSession.cohort')
            ->first();

        if (!$slot) {
            return redirect()->route('attendee.dashboard')
                ->with('error', 'Session has closed. Please try again.');
        }

        // Double-check enrollment
        $enrollment = $slot->attendanceSession->cohort->enrollments()
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if (!$enrollment) {
            return redirect()->route('attendee.dashboard')
                ->with('error', 'You are not enrolled in this course.');
        }

        // Check if already checked in
        $existingCheckIn = CheckInEvent::where('slot_id', $slot->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingCheckIn) {
            return Inertia::render('Attendee/CheckInSuccess', [
                'status' => $existingCheckIn->status,
                'checkedInAt' => $existingCheckIn->checked_in_at?->format('H:i:s'),
                'message' => 'You have already checked in.',
                'alreadyCheckedIn' => true,
            ]);
        }

        // Determine status (present vs late)
        $status = 'present';
        $gracePeriod = $slot->attendanceSession->cohort->grace_period_minutes ?? 15;
        $sessionStart = $slot->type === 'am'
            ? Carbon::parse($slot->attendanceSession->cohort->am_start)
            : Carbon::parse($slot->attendanceSession->cohort->pm_start);

        $graceDeadline = $sessionStart->copy()->addMinutes($gracePeriod);

        if (now()->greaterThan($graceDeadline)) {
            $status = 'late';
        }

        // Create check-in event
        $checkIn = CheckInEvent::create([
            'slot_id' => $slot->id,
            'user_id' => $user->id,
            'status' => $status,
            'checked_in_at' => now(),
            'is_manual_entry' => false,
        ]);

        activity()
            ->performedOn($slot)
            ->causedBy($user)
            ->withProperties(['status' => $status])
            ->log('User checked in via QR');

        return Inertia::render('Attendee/CheckInSuccess', [
            'status' => $status,
            'checkedInAt' => $checkIn->checked_in_at->format('H:i:s'),
            'message' => $status === 'present'
                ? 'Check-in successful! You are marked as present.'
                : 'Check-in successful, but you are marked as late.',
            'alreadyCheckedIn' => false,
        ]);
    }

    /**
     * Handle second-chance token check-in
     */
    public function useSecondChance(Request $request, string $tokenCode)
    {
        $user = $request->user();

        $token = SecondChanceToken::where('token_code', $tokenCode)
            ->where('user_id', $user->id)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->with('slot.attendanceSession.cohort.course')
            ->first();

        if (!$token) {
            return Inertia::render('Attendee/CheckInError', [
                'error' => 'invalid_token',
                'message' => 'This second-chance token is invalid or expired.',
            ]);
        }

        // Mark existing check-in as late/excused instead of absent
        $checkIn = CheckInEvent::where('slot_id', $token->slot_id)
            ->where('user_id', $user->id)
            ->first();

        if ($checkIn) {
            $checkIn->update([
                'status' => 'late',
                'notes' => 'Used second-chance token',
            ]);
        } else {
            CheckInEvent::create([
                'slot_id' => $token->slot_id,
                'user_id' => $user->id,
                'status' => 'late',
                'checked_in_at' => now(),
                'is_manual_entry' => false,
                'notes' => 'Used second-chance token',
            ]);
        }

        // Mark token as used
        $token->update([
            'is_used' => true,
            'used_at' => now(),
        ]);

        activity()
            ->performedOn($token->slot)
            ->causedBy($user)
            ->log('Used second-chance token');

        return Inertia::render('Attendee/CheckInSuccess', [
            'status' => 'late',
            'checkedInAt' => now()->format('H:i:s'),
            'message' => 'Second-chance check-in successful! You are marked as late.',
            'alreadyCheckedIn' => false,
        ]);
    }

    /**
     * Show attendance history for the user
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $checkIns = CheckInEvent::where('user_id', $user->id)
            ->with('slot.attendanceSession.cohort.course')
            ->orderBy('checked_in_at', 'desc')
            ->paginate(20);

        $grouped = $checkIns->getCollection()->groupBy(function ($ci) {
            return $ci->slot->attendanceSession->cohort->course->name;
        });

        return Inertia::render('Attendee/History', [
            'checkIns' => $checkIns,
            'grouped' => $grouped,
        ]);
    }
}
