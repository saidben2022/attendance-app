<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class CheckInEvent extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'slot_id',
        'user_id',
        'status',
        'checked_in_at',
        'is_manual_entry',
        'used_second_chance',
        'excused_reason',
        'notes',
        'recorded_by',
    ];

    protected $casts = [
        'checked_in_at' => 'datetime',
        'is_manual_entry' => 'boolean',
        'used_second_chance' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'is_manual_entry', 'excused_reason', 'notes'])
            ->logOnlyDirty();
    }

    public function slot(): BelongsTo
    {
        return $this->belongsTo(Slot::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recordedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /**
     * Check if the attendee is present (either on-time or late)
     */
    public function isPresent(): bool
    {
        return in_array($this->status, ['present', 'late']);
    }

    /**
     * Check if this was an excused absence
     */
    public function isExcused(): bool
    {
        return $this->status === 'excused';
    }
}
