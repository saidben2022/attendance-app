<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Cohort extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'course_id',
        'name',
        'start_date',
        'end_date',
        'am_start',
        'am_end',
        'pm_start',
        'pm_end',
        'grace_period_minutes',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'am_start' => 'datetime:H:i',
        'am_end' => 'datetime:H:i',
        'pm_start' => 'datetime:H:i',
        'pm_end' => 'datetime:H:i',
        'grace_period_minutes' => 'integer',
        'is_active' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'start_date', 'end_date', 'is_active'])
            ->logOnlyDirty();
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function scheduleRules(): HasMany
    {
        return $this->hasMany(ScheduleRule::class);
    }

    public function scheduleExceptions(): HasMany
    {
        return $this->hasMany(ScheduleException::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function attendees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->withPivot(['status', 'enrolled_at', 'withdrawn_at', 'notes'])
            ->withTimestamps();
    }

    public function attendanceSessions(): HasMany
    {
        return $this->hasMany(AttendanceSession::class);
    }

    /**
     * Get effective grace period (cohort override or organization default)
     */
    public function getEffectiveGracePeriod(): int
    {
        if ($this->grace_period_minutes !== null) {
            return $this->grace_period_minutes;
        }

        return $this->course->organization->default_grace_period_minutes ?? 15;
    }
}
