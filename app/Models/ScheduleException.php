<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduleException extends Model
{
    use HasFactory;

    protected $fillable = [
        'cohort_id',
        'exception_date',
        'type',
        'has_am_slot',
        'has_pm_slot',
        'reason',
    ];

    protected $casts = [
        'exception_date' => 'date',
        'has_am_slot' => 'boolean',
        'has_pm_slot' => 'boolean',
    ];

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }
}
