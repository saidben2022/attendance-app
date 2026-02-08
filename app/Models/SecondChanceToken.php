<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class SecondChanceToken extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'slot_id',
        'user_id',
        'token',
        'expires_at',
        'used_at',
        'issued_by',
        'reason',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['used_at', 'reason'])
            ->logOnlyDirty();
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($token) {
            if (empty($token->token)) {
                $token->token = Str::random(32);
            }
        });
    }

    public function slot(): BelongsTo
    {
        return $this->belongsTo(Slot::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function issuedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    /**
     * Check if token is valid (not expired and not used)
     */
    public function isValid(): bool
    {
        return $this->used_at === null && $this->expires_at->isFuture();
    }

    /**
     * Mark token as used
     */
    public function markAsUsed(): void
    {
        $this->used_at = now();
        $this->save();
    }
}
