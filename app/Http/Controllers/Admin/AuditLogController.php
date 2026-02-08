<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class AuditLogController extends Controller
{
    /**
     * Display the audit log
     */
    public function index(Request $request)
    {
        $query = Activity::with(['causer', 'subject'])
            ->orderBy('created_at', 'desc');

        // Filter by causer (user)
        if ($request->has('user_id') && $request->user_id) {
            $query->where('causer_id', $request->user_id);
        }

        // Filter by subject type
        if ($request->has('subject_type') && $request->subject_type) {
            $query->where('subject_type', 'like', '%' . $request->subject_type);
        }

        // Filter by date range
        if ($request->has('from_date') && $request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date') && $request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Search in description
        if ($request->has('search') && $request->search) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $activities = $query->paginate(50);

        // Transform for frontend
        $activities->getCollection()->transform(function ($activity) {
            return [
                'id' => $activity->id,
                'description' => $activity->description,
                'log_name' => $activity->log_name,
                'causer_name' => $activity->causer?->name ?? 'System',
                'causer_email' => $activity->causer?->email,
                'subject_type' => class_basename($activity->subject_type ?? ''),
                'subject_id' => $activity->subject_id,
                'properties' => $activity->properties?->toArray() ?? [],
                'created_at' => $activity->created_at->format('Y-m-d H:i:s'),
                'created_at_human' => $activity->created_at->diffForHumans(),
            ];
        });

        // Get users for filter dropdown
        $users = \App\Models\User::select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/AuditLog', [
            'activities' => $activities,
            'users' => $users,
            'filters' => $request->only(['user_id', 'subject_type', 'from_date', 'to_date', 'search']),
        ]);
    }
}
