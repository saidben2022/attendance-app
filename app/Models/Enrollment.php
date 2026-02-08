<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Enrollment extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'cohort_id',
        'user_id',
        'status',
        'enrolled_at',
        'withdrawn_at',
        'notes',
    ];

    protected $casts = [
        'enrolled_at' => 'date',
        'withdrawn_at' => 'date',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'enrolled_at', 'withdrawn_at'])
            ->logOnlyDirty();
    }

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
