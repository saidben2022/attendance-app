<?php

namespace App\Services;

use App\Models\AttendanceSession;
use App\Models\Cohort;
use App\Models\ScheduleException;
use App\Models\ScheduleRule;
use App\Models\Slot;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;

class SessionGeneratorService
{
    /**
     * Generate all attendance sessions for a cohort based on schedule rules.
     * This will create sessions and their AM/PM slots within the cohort's date range.
     *
     * @param Cohort $cohort
     * @param bool $regenerate If true, deletes existing sessions first
     * @return Collection The created sessions
     */
    public function generateForCohort(Cohort $cohort, bool $regenerate = false): Collection
    {
        if ($regenerate) {
            $cohort->attendanceSessions()->delete();
        }

        $sessions = collect();
        $period = CarbonPeriod::create($cohort->start_date, $cohort->end_date);

        foreach ($period as $date) {
            $session = $this->generateSessionForDate($cohort, $date);
            if ($session) {
                $sessions->push($session);
            }
        }

        return $sessions;
    }

    /**
     * Generate a session for a specific date if applicable.
     *
     * @param Cohort $cohort
     * @param Carbon $date
     * @return AttendanceSession|null
     */
    public function generateSessionForDate(Cohort $cohort, Carbon $date): ?AttendanceSession
    {
        // Check for exceptions first
        $exception = $cohort->scheduleExceptions()
            ->whereDate('exception_date', $date)
            ->first();

        if ($exception) {
            return $this->handleException($cohort, $date, $exception);
        }

        // Check regular schedule rules
        $dayOfWeek = strtolower($date->englishDayOfWeek);
        $rule = $cohort->scheduleRules()
            ->where('day_of_week', $dayOfWeek)
            ->first();

        if (!$rule) {
            return null; // No class on this day
        }

        return $this->createSession($cohort, $date, $rule->has_am_slot, $rule->has_pm_slot);
    }

    /**
     * Handle a schedule exception.
     *
     * @param Cohort $cohort
     * @param Carbon $date
     * @param ScheduleException $exception
     * @return AttendanceSession|null
     */
    protected function handleException(Cohort $cohort, Carbon $date, ScheduleException $exception): ?AttendanceSession
    {
        if ($exception->type === 'holiday' || $exception->type === 'cancelled') {
            // No session on this day
            return null;
        }

        if ($exception->type === 'extra_session') {
            // Create session based on exception settings
            return $this->createSession(
                $cohort,
                $date,
                $exception->has_am_slot,
                $exception->has_pm_slot
            );
        }

        return null;
    }

    /**
     * Create a session with its slots.
     *
     * @param Cohort $cohort
     * @param Carbon $date
     * @param bool $hasAmSlot
     * @param bool $hasPmSlot
     * @return AttendanceSession|null
     */
    protected function createSession(Cohort $cohort, Carbon $date, bool $hasAmSlot, bool $hasPmSlot): ?AttendanceSession
    {
        if (!$hasAmSlot && !$hasPmSlot) {
            return null;
        }

        // Check if session already exists for this date
        $existingSession = $cohort->attendanceSessions()
            ->whereDate('session_date', $date)
            ->first();

        if ($existingSession) {
            return $existingSession;
        }

        $session = AttendanceSession::create([
            'cohort_id' => $cohort->id,
            'session_date' => $date,
            'status' => 'scheduled',
        ]);

        if ($hasAmSlot) {
            Slot::create([
                'attendance_session_id' => $session->id,
                'type' => 'am',
                'state' => 'scheduled',
            ]);
        }

        if ($hasPmSlot) {
            Slot::create([
                'attendance_session_id' => $session->id,
                'type' => 'pm',
                'state' => 'scheduled',
            ]);
        }

        return $session;
    }

    /**
     * Generate sessions for a specific date range (useful for partial regeneration).
     *
     * @param Cohort $cohort
     * @param Carbon $startDate
     * @param Carbon $endDate
     * @return Collection
     */
    public function generateForDateRange(Cohort $cohort, Carbon $startDate, Carbon $endDate): Collection
    {
        $sessions = collect();
        $period = CarbonPeriod::create($startDate, $endDate);

        foreach ($period as $date) {
            $session = $this->generateSessionForDate($cohort, $date);
            if ($session) {
                $sessions->push($session);
            }
        }

        return $sessions;
    }

    /**
     * Get upcoming sessions for a cohort.
     *
     * @param Cohort $cohort
     * @param int $days Number of days to look ahead
     * @return Collection
     */
    public function getUpcomingSessions(Cohort $cohort, int $days = 7): Collection
    {
        return $cohort->attendanceSessions()
            ->where('session_date', '>=', now()->toDateString())
            ->where('session_date', '<=', now()->addDays($days)->toDateString())
            ->with('slots')
            ->orderBy('session_date')
            ->get();
    }

    /**
     * Get today's sessions for a cohort.
     *
     * @param Cohort $cohort
     * @return AttendanceSession|null
     */
    public function getTodaySession(Cohort $cohort): ?AttendanceSession
    {
        return $cohort->attendanceSessions()
            ->whereDate('session_date', now())
            ->with('slots')
            ->first();
    }
}
