<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Slot extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'attendance_session_id',
        'type',
        'state',
        'qr_token',
        'qr_expires_at',
        'opened_at',
        'closed_at',
        'locked_at',
        'opened_by',
        'closed_by',
        'locked_by',
    ];

    protected $casts = [
        'qr_expires_at' => 'datetime',
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
        'locked_at' => 'datetime',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['state', 'opened_at', 'closed_at', 'locked_at'])
            ->logOnlyDirty();
    }

    public function attendanceSession(): BelongsTo
    {
        return $this->belongsTo(AttendanceSession::class);
    }

    public function openedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'opened_by');
    }

    public function closedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'closed_by');
    }

    public function lockedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'locked_by');
    }

    public function checkInEvents(): HasMany
    {
        return $this->hasMany(CheckInEvent::class);
    }

    public function secondChanceTokens(): HasMany
    {
        return $this->hasMany(SecondChanceToken::class);
    }

    /**
     * Generate a new QR token
     */
    public function generateQrToken(int $expiryMinutes = 5): void
    {
        $this->qr_token = Str::random(32);
        $this->qr_expires_at = now()->addMinutes($expiryMinutes);
        $this->save();
    }

    /**
     * Check if QR token is valid
     */
    public function isQrTokenValid(): bool
    {
        return $this->qr_token !== null
            && $this->qr_expires_at !== null
            && $this->qr_expires_at->isFuture();
    }

    /**
     * Open the slot
     */
    public function open(User $user): void
    {
        $this->state = 'open';
        $this->opened_at = now();
        $this->opened_by = $user->id;
        $this->save();
    }

    /**
     * Close the slot
     */
    public function close(User $user): void
    {
        $this->state = 'closed';
        $this->closed_at = now();
        $this->closed_by = $user->id;
        $this->save();
    }

    /**
     * Lock the slot
     */
    public function lock(User $user): void
    {
        $this->state = 'locked';
        $this->locked_at = now();
        $this->locked_by = $user->id;
        $this->save();
    }

    /**
     * Check if slot is open for check-ins
     */
    public function isOpen(): bool
    {
        return $this->state === 'open';
    }
}
