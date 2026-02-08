<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class AttendanceSession extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'cohort_id',
        'session_date',
        'status',
        'cancellation_reason',
        'cancelled_by',
    ];

    protected $casts = [
        'session_date' => 'date',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['session_date', 'status', 'cancellation_reason'])
            ->logOnlyDirty();
    }

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }

    public function cancelledByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function slots(): HasMany
    {
        return $this->hasMany(Slot::class);
    }

    public function amSlot()
    {
        return $this->slots()->where('type', 'am')->first();
    }

    public function pmSlot()
    {
        return $this->slots()->where('type', 'pm')->first();
    }
}
