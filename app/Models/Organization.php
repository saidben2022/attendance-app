<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Organization extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'name',
        'slug',
        'timezone',
        'default_grace_period_minutes',
        'default_qr_expiry_minutes',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'default_grace_period_minutes' => 'integer',
        'default_qr_expiry_minutes' => 'integer',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'timezone', 'default_grace_period_minutes'])
            ->logOnlyDirty();
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
