<?php

namespace App\Http\Controllers\Verifier;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use App\Models\Slot;
use App\Models\CheckInEvent;
use App\Models\SecondChanceToken;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SessionController extends Controller
{
    /**
     * Display today's sessions for the verifier
     */
    public function today(Request $request)
    {
        $today = Carbon::today();

        $sessions = AttendanceSession::whereDate('session_date', $today)
            ->with([
                'cohort.course.organization',
                'slots' => fn($q) => $q->withCount('checkInEvents')
            ])
            ->orderBy('created_at')
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'cohort_name' => $session->cohort->name,
                    'course_name' => $session->cohort->course->name,
                    'organization_name' => $session->cohort->course->organization?->name,
                    'date' => $session->session_date->format('Y-m-d'),
                    'status' => $session->status,
                    'slots' => $session->slots->map(fn($slot) => [
                        'id' => $slot->id,
                        'type' => $slot->type,
                        'state' => $slot->state,
                        'check_in_count' => $slot->check_in_events_count ?? 0,
                        'opens_at' => $slot->opens_at?->format('H:i'),
                        'closes_at' => $slot->closes_at?->format('H:i'),
                    ]),
                ];
            });

        // Group by organization
        $groupedSessions = $sessions->groupBy('organization_name');

        return Inertia::render('Verifier/TodaySessions', [
            'sessions' => $sessions,
            'groupedSessions' => $groupedSessions,
            'dateString' => $today->format('l, F j, Y'),
        ]);
    }

    /**
     * Show the slot control panel for a specific slot
     */
    public function slotPanel(Slot $slot)
    {
        $slot->load([
            'attendanceSession.cohort.course',
            'checkInEvents.user',
            'attendanceSession.cohort.enrollments.user',
        ]);

        // Get all enrolled students with their check-in status
        $enrolledUsers = $slot->attendanceSession->cohort->enrollments
            ->where('status', 'active')
            ->map(function ($enrollment) use ($slot) {
                $checkIn = $slot->checkInEvents->where('user_id', $enrollment->user_id)->first();
                return [
                    'id' => $enrollment->user_id,
                    'name' => $enrollment->user->name,
                    'email' => $enrollment->user->email,
                    'status' => $checkIn?->status ?? 'not_checked_in',
                    'checked_in_at' => $checkIn?->checked_in_at?->format('H:i:s'),
                    'is_manual' => $checkIn?->is_manual_entry ?? false,
                    'check_in_id' => $checkIn?->id,
                ];
            })
            ->sortBy('name')
            ->values();

        // Count statistics
        $stats = [
            'total_enrolled' => $enrolledUsers->count(),
            'present' => $enrolledUsers->where('status', 'present')->count(),
            'late' => $enrolledUsers->where('status', 'late')->count(),
            'absent' => $enrolledUsers->where('status', 'absent')->count(),
            'excused' => $enrolledUsers->where('status', 'excused')->count(),
            'not_checked_in' => $enrolledUsers->where('status', 'not_checked_in')->count(),
        ];

        return Inertia::render('Verifier/SlotPanel', [
            'slot' => [
                'id' => $slot->id,
                'type' => $slot->type,
                'state' => $slot->state,
                'opens_at' => $slot->opens_at?->format('H:i'),
                'closes_at' => $slot->closes_at?->format('H:i'),
                'qr_token' => $slot->qr_token,
            ],
            'session' => [
                'id' => $slot->attendanceSession->id,
                'date' => $slot->attendanceSession->session_date->format('Y-m-d'),
            ],
            'cohort' => [
                'id' => $slot->attendanceSession->cohort->id,
                'name' => $slot->attendanceSession->cohort->name,
                'course_name' => $slot->attendanceSession->cohort->course->name,
            ],
            'enrolledUsers' => $enrolledUsers,
            'stats' => $stats,
        ]);
    }

    /**
     * Open a slot for check-ins
     */
    public function openSlot(Slot $slot)
    {
        if (!in_array($slot->state, ['scheduled', 'closed'])) {
            return back()->with('error', 'Cannot open this slot.');
        }

        $slot->update([
            'state' => 'open',
            'qr_token' => Str::random(32),
            'opens_at' => now(),
        ]);

        activity()
            ->performedOn($slot)
            ->causedBy(auth()->user())
            ->log('Slot opened for check-ins');

        return back()->with('success', 'Slot is now open for check-ins.');
    }

    /**
     * Close a slot (no more check-ins)
     */
    public function closeSlot(Slot $slot)
    {
        if ($slot->state !== 'open') {
            return back()->with('error', 'Slot is not open.');
        }

        $slot->update([
            'state' => 'closed',
            'closes_at' => now(),
        ]);

        activity()
            ->performedOn($slot)
            ->causedBy(auth()->user())
            ->log('Slot closed for check-ins');

        return back()->with('success', 'Slot is now closed.');
    }

    /**
     * Lock a slot (finalize, no changes)
     */
    public function lockSlot(Slot $slot)
    {
        if (!in_array($slot->state, ['open', 'closed'])) {
            return back()->with('error', 'Cannot lock this slot.');
        }

        // Mark all remaining enrolled students as absent
        $slot->load('attendanceSession.cohort.enrollments');
        $checkedInUserIds = $slot->checkInEvents()->pluck('user_id');

        $absentUsers = $slot->attendanceSession->cohort->enrollments
            ->where('status', 'active')
            ->whereNotIn('user_id', $checkedInUserIds);

        foreach ($absentUsers as $enrollment) {
            CheckInEvent::create([
                'slot_id' => $slot->id,
                'user_id' => $enrollment->user_id,
                'status' => 'absent',
                'is_manual_entry' => true,
            ]);
        }

        $slot->update([
            'state' => 'locked',
            'qr_token' => null, // Invalidate QR
        ]);

        activity()
            ->performedOn($slot)
            ->causedBy(auth()->user())
            ->withProperties(['absent_count' => $absentUsers->count()])
            ->log('Slot locked and finalized');

        return back()->with('success', 'Slot locked. ' . $absentUsers->count() . ' students marked absent.');
    }

    /**
     * Manual check-in by verifier
     */
    public function manualCheckIn(Request $request, Slot $slot)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:present,late,excused',
            'notes' => 'nullable|string|max:500',
        ]);

        // Check if already checked in
        $existing = CheckInEvent::where('slot_id', $slot->id)
            ->where('user_id', $request->user_id)
            ->first();

        if ($existing) {
            $existing->update([
                'status' => $request->status,
                'notes' => $request->notes,
                'is_manual_entry' => true,
            ]);
            $action = 'updated';
        } else {
            CheckInEvent::create([
                'slot_id' => $slot->id,
                'user_id' => $request->user_id,
                'status' => $request->status,
                'checked_in_at' => now(),
                'is_manual_entry' => true,
                'notes' => $request->notes,
            ]);
            $action = 'created';
        }

        activity()
            ->performedOn($slot)
            ->causedBy(auth()->user())
            ->withProperties(['user_id' => $request->user_id, 'status' => $request->status])
            ->log("Manual check-in $action");

        return back()->with('success', 'Check-in recorded.');
    }

    /**
     * Display QR code page for a slot
     */
    public function qrDisplay(Slot $slot)
    {
        $slot->load('attendanceSession.cohort.course');

        // Generate QR token if not exists and slot is open
        if ($slot->state === 'open' && !$slot->qr_token) {
            $slot->update(['qr_token' => Str::random(32)]);
        }

        // Generate check-in URL
        $checkInUrl = $slot->qr_token
            ? route('check-in.scan', ['token' => $slot->qr_token])
            : null;

        return Inertia::render('Verifier/QRDisplay', [
            'slot' => [
                'id' => $slot->id,
                'type' => $slot->type,
                'state' => $slot->state,
                'qr_token' => $slot->qr_token,
            ],
            'session' => [
                'date' => $slot->attendanceSession->session_date->format('l, F j, Y'),
            ],
            'cohort' => [
                'name' => $slot->attendanceSession->cohort->name,
                'course_name' => $slot->attendanceSession->cohort->course->name,
            ],
            'checkInUrl' => $checkInUrl,
        ]);
    }

    /**
     * Refresh QR token
     */
    public function refreshQR(Slot $slot)
    {
        if ($slot->state !== 'open') {
            return back()->with('error', 'Slot must be open to refresh QR.');
        }

        // Invalidate any existing second-chance tokens for old QR
        SecondChanceToken::where('slot_id', $slot->id)
            ->where('is_used', false)
            ->update(['is_used' => true]);

        $slot->update(['qr_token' => Str::random(32)]);

        activity()
            ->performedOn($slot)
            ->causedBy(auth()->user())
            ->log('QR token refreshed');

        return back()->with('success', 'QR code refreshed.');
    }
}
