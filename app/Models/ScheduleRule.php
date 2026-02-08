<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduleRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'cohort_id',
        'day_of_week',
        'has_am_slot',
        'has_pm_slot',
    ];

    protected $casts = [
        'has_am_slot' => 'boolean',
        'has_pm_slot' => 'boolean',
    ];

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }
}
