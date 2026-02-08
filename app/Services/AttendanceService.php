<?php

namespace App\Services;

use App\Models\CheckInEvent;
use App\Models\Cohort;
use App\Models\Enrollment;
use App\Models\SecondChanceToken;
use App\Models\Slot;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AttendanceService
{
    /**
     * Open a slot for check-ins.
     *
     * @param Slot $slot
     * @param User $verifier
     * @param int|null $qrExpiryMinutes
     * @return Slot
     */
    public function openSlot(Slot $slot, User $verifier, ?int $qrExpiryMinutes = null): Slot
    {
        if ($slot->state !== 'scheduled' && $slot->state !== 'closed') {
            throw new \InvalidArgumentException("Slot cannot be opened from state: {$slot->state}");
        }

        $expiryMinutes = $qrExpiryMinutes
            ?? $slot->attendanceSession->cohort->course->organization->default_qr_expiry_minutes
            ?? 5;

        $slot->state = 'open';
        $slot->opened_at = now();
        $slot->opened_by = $verifier->id;
        $slot->generateQrToken($expiryMinutes);
        $slot->save();

        return $slot;
    }

    /**
     * Close a slot (no more check-ins).
     *
     * @param Slot $slot
     * @param User $verifier
     * @return Slot
     */
    public function closeSlot(Slot $slot, User $verifier): Slot
    {
        if ($slot->state !== 'open') {
            throw new \InvalidArgumentException("Slot cannot be closed from state: {$slot->state}");
        }

        $slot->state = 'closed';
        $slot->closed_at = now();
        $slot->closed_by = $verifier->id;
        $slot->qr_token = null;
        $slot->qr_expires_at = null;
        $slot->save();

        return $slot;
    }

    /**
     * Lock a slot (prevent further modifications).
     *
     * @param Slot $slot
     * @param User $user
     * @return Slot
     */
    public function lockSlot(Slot $slot, User $user): Slot
    {
        if ($slot->state !== 'closed') {
            throw new \InvalidArgumentException("Slot cannot be locked from state: {$slot->state}");
        }

        $slot->state = 'locked';
        $slot->locked_at = now();
        $slot->locked_by = $user->id;
        $slot->save();

        return $slot;
    }

    /**
     * Unlock a slot (for corrections).
     *
     * @param Slot $slot
     * @param User $coordinator
     * @return Slot
     */
    public function unlockSlot(Slot $slot, User $coordinator): Slot
    {
        if ($slot->state !== 'locked') {
            throw new \InvalidArgumentException("Slot cannot be unlocked from state: {$slot->state}");
        }

        $slot->state = 'closed';
        $slot->locked_at = null;
        $slot->locked_by = null;
        $slot->save();

        activity()
            ->performedOn($slot)
            ->causedBy($coordinator)
            ->withProperties(['action' => 'unlock'])
            ->log('Slot unlocked for corrections');

        return $slot;
    }

    /**
     * Process a check-in attempt.
     *
     * @param Slot $slot
     * @param User $attendee
     * @param string $pin
     * @param string|null $secondChanceToken
     * @return CheckInEvent
     */
    public function checkIn(Slot $slot, User $attendee, string $pin, ?string $secondChanceToken = null): CheckInEvent
    {
        // Validate slot is open
        if (!$slot->isOpen()) {
            throw new \InvalidArgumentException("Slot is not open for check-ins");
        }

        // Validate QR token hasn't expired
        if (!$slot->isQrTokenValid()) {
            throw new \InvalidArgumentException("QR code has expired. Please ask the verifier to refresh it.");
        }

        // Validate PIN
        if (!Hash::check($pin, $attendee->pin)) {
            throw new \InvalidArgumentException("Invalid PIN");
        }

        // Check enrollment
        $cohort = $slot->attendanceSession->cohort;
        $enrollment = Enrollment::where('cohort_id', $cohort->id)
            ->where('user_id', $attendee->id)
            ->where('status', 'active')
            ->first();

        if (!$enrollment) {
            throw new \InvalidArgumentException("You are not enrolled in this cohort");
        }

        // Check for duplicate check-in
        $existingCheckIn = CheckInEvent::where('slot_id', $slot->id)
            ->where('user_id', $attendee->id)
            ->first();

        if ($existingCheckIn && !$secondChanceToken) {
            throw new \InvalidArgumentException("You have already checked in for this slot");
        }

        // Handle second chance token
        $usedSecondChance = false;
        if ($secondChanceToken) {
            $token = SecondChanceToken::where('token', $secondChanceToken)
                ->where('slot_id', $slot->id)
                ->where('user_id', $attendee->id)
                ->first();

            if (!$token || !$token->isValid()) {
                throw new \InvalidArgumentException("Invalid or expired second chance token");
            }

            $token->markAsUsed();
            $usedSecondChance = true;

            // Update existing check-in if present
            if ($existingCheckIn) {
                $existingCheckIn->status = 'present';
                $existingCheckIn->checked_in_at = now();
                $existingCheckIn->used_second_chance = true;
                $existingCheckIn->save();
                return $existingCheckIn;
            }
        }

        // Determine status based on grace period
        $status = $this->determineStatus($slot, $cohort);

        return CheckInEvent::create([
            'slot_id' => $slot->id,
            'user_id' => $attendee->id,
            'status' => $status,
            'checked_in_at' => now(),
            'is_manual_entry' => false,
            'used_second_chance' => $usedSecondChance,
        ]);
    }

    /**
     * Determine check-in status based on timing.
     *
     * @param Slot $slot
     * @param Cohort $cohort
     * @return string
     */
    protected function determineStatus(Slot $slot, Cohort $cohort): string
    {
        $gracePeriod = $cohort->getEffectiveGracePeriod();
        $slotOpenedAt = $slot->opened_at;
        $now = now();

        $graceDeadline = $slotOpenedAt->copy()->addMinutes($gracePeriod);

        if ($now->lte($graceDeadline)) {
            return 'present';
        }

        return 'late';
    }

    /**
     * Manual attendance entry by verifier.
     *
     * @param Slot $slot
     * @param User $attendee
     * @param string $status
     * @param User $verifier
     * @param string|null $reason
     * @param string|null $notes
     * @return CheckInEvent
     */
    public function manualEntry(
        Slot $slot,
        User $attendee,
        string $status,
        User $verifier,
        ?string $reason = null,
        ?string $notes = null
    ): CheckInEvent {
        if (!in_array($status, ['present', 'late', 'absent', 'excused'])) {
            throw new \InvalidArgumentException("Invalid status: {$status}");
        }

        if ($slot->state === 'locked') {
            throw new \InvalidArgumentException("Cannot modify locked slot");
        }

        // Check for existing check-in
        $existingCheckIn = CheckInEvent::where('slot_id', $slot->id)
            ->where('user_id', $attendee->id)
            ->first();

        if ($existingCheckIn) {
            // Update existing
            $existingCheckIn->status = $status;
            $existingCheckIn->is_manual_entry = true;
            $existingCheckIn->excused_reason = $reason;
            $existingCheckIn->notes = $notes;
            $existingCheckIn->recorded_by = $verifier->id;
            $existingCheckIn->save();

            return $existingCheckIn;
        }

        return CheckInEvent::create([
            'slot_id' => $slot->id,
            'user_id' => $attendee->id,
            'status' => $status,
            'checked_in_at' => $status !== 'absent' ? now() : null,
            'is_manual_entry' => true,
            'excused_reason' => $reason,
            'notes' => $notes,
            'recorded_by' => $verifier->id,
        ]);
    }

    /**
     * Issue a second chance token for an attendee.
     *
     * @param Slot $slot
     * @param User $attendee
     * @param User $verifier
     * @param string $reason
     * @param int $expiryMinutes
     * @return SecondChanceToken
     */
    public function issueSecondChanceToken(
        Slot $slot,
        User $attendee,
        User $verifier,
        string $reason,
        int $expiryMinutes = 30
    ): SecondChanceToken {
        // Check if token already exists
        $existingToken = SecondChanceToken::where('slot_id', $slot->id)
            ->where('user_id', $attendee->id)
            ->first();

        if ($existingToken && $existingToken->isValid()) {
            throw new \InvalidArgumentException("Active second chance token already exists");
        }

        return SecondChanceToken::create([
            'slot_id' => $slot->id,
            'user_id' => $attendee->id,
            'token' => Str::random(32),
            'expires_at' => now()->addMinutes($expiryMinutes),
            'issued_by' => $verifier->id,
            'reason' => $reason,
        ]);
    }

    /**
     * Bulk close: mark all enrolled attendees without check-ins as absent.
     *
     * @param Slot $slot
     * @param User $verifier
     * @return int Number of attendees marked absent
     */
    public function bulkMarkAbsent(Slot $slot, User $verifier): int
    {
        $cohort = $slot->attendanceSession->cohort;

        // Get all active enrollments
        $enrolledUserIds = Enrollment::where('cohort_id', $cohort->id)
            ->where('status', 'active')
            ->pluck('user_id');

        // Get users who already have check-in events
        $checkedInUserIds = CheckInEvent::where('slot_id', $slot->id)
            ->pluck('user_id');

        // Find missing users
        $missingUserIds = $enrolledUserIds->diff($checkedInUserIds);

        $count = 0;
        foreach ($missingUserIds as $userId) {
            CheckInEvent::create([
                'slot_id' => $slot->id,
                'user_id' => $userId,
                'status' => 'absent',
                'is_manual_entry' => true,
                'recorded_by' => $verifier->id,
                'notes' => 'Bulk marked absent at slot close',
            ]);
            $count++;
        }

        return $count;
    }

    /**
     * Get attendance summary for a slot.
     *
     * @param Slot $slot
     * @return array
     */
    public function getSlotSummary(Slot $slot): array
    {
        $checkIns = $slot->checkInEvents;

        $cohort = $slot->attendanceSession->cohort;
        $totalEnrolled = Enrollment::where('cohort_id', $cohort->id)
            ->where('status', 'active')
            ->count();

        return [
            'total_enrolled' => $totalEnrolled,
            'present' => $checkIns->where('status', 'present')->count(),
            'late' => $checkIns->where('status', 'late')->count(),
            'excused' => $checkIns->where('status', 'excused')->count(),
            'absent' => $checkIns->where('status', 'absent')->count(),
            'not_recorded' => $totalEnrolled - $checkIns->count(),
        ];
    }
}
