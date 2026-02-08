<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use App\Models\CheckInEvent;
use App\Models\Cohort;
use App\Models\Course;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));
        $cohortId = $request->input('cohort_id');
        $courseId = $request->input('course_id');
        $status = $request->input('status');

        // Get report data
        $reportData = $this->getReportData($startDate, $endDate, $cohortId, $courseId, $status);

        // Courses and cohorts for filters
        $courses = Course::where('is_active', true)->get(['id', 'name']);
        $cohorts = Cohort::with('course:id,name')->where('is_active', true)->get(['id', 'name', 'course_id']);

        return Inertia::render('Admin/Reports/Index', [
            'reportData' => $reportData,
            'courses' => $courses,
            'cohorts' => $cohorts,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'cohort_id' => $cohortId,
                'course_id' => $courseId,
                'status' => $status,
            ],
        ]);
    }

    public function exportCsv(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));
        $cohortId = $request->input('cohort_id');
        $courseId = $request->input('course_id');
        $status = $request->input('status');

        $reportData = $this->getReportData($startDate, $endDate, $cohortId, $courseId, $status);

        $filename = 'rapport_presence_' . $startDate . '_' . $endDate . '.csv';

        $handle = fopen('php://temp', 'w+');

        // Add BOM for Excel UTF-8 compatibility
        fwrite($handle, "\xEF\xBB\xBF");

        // Header row
        fputcsv($handle, ['Nom', 'Email', 'Telephone', 'Cohorte', 'Formation', 'Date session', 'Creneau', 'Statut', 'Heure pointage']);

        foreach ($reportData as $row) {
            fputcsv($handle, [
                $row['user_name'],
                $row['user_email'],
                $row['user_phone'],
                $row['cohort_name'],
                $row['course_name'],
                $row['session_date'],
                $row['slot_type'],
                $row['status'],
                $row['checked_in_at'],
            ]);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return Response::make($content, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function exportPdf(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));
        $cohortId = $request->input('cohort_id');
        $courseId = $request->input('course_id');
        $status = $request->input('status');

        $reportData = $this->getReportData($startDate, $endDate, $cohortId, $courseId, $status);

        // Generate simple HTML for PDF
        $html = $this->generatePdfHtml($reportData, $startDate, $endDate);

        $filename = 'rapport_presence_' . $startDate . '_' . $endDate . '.html';

        return Response::make($html, 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    protected function getReportData($startDate, $endDate, $cohortId = null, $courseId = null, $status = null): array
    {
        $query = CheckInEvent::with([
            'user:id,name,email,phone',
            'slot.attendanceSession.cohort.course'
        ])
            ->whereHas('slot.attendanceSession', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('session_date', [$startDate, $endDate]);
            })
            ->orderBy('created_at', 'desc');

        if ($cohortId) {
            $query->whereHas('slot.attendanceSession', function ($q) use ($cohortId) {
                $q->where('cohort_id', $cohortId);
            });
        }

        if ($courseId) {
            $query->whereHas('slot.attendanceSession.cohort', function ($q) use ($courseId) {
                $q->where('course_id', $courseId);
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $statusLabels = [
            'present' => 'Présent',
            'late' => 'Retard',
            'absent' => 'Absent',
            'excused' => 'Excusé',
        ];

        return $query->limit(500)->get()->map(function ($event) use ($statusLabels) {
            return [
                'id' => $event->id,
                'user_name' => $event->user->name ?? 'Inconnu',
                'user_email' => $event->user->email ?? '',
                'user_phone' => $event->user->phone ?? '',
                'cohort_name' => $event->slot->attendanceSession->cohort->name ?? 'Inconnu',
                'course_name' => $event->slot->attendanceSession->cohort->course->name ?? 'Inconnu',
                'session_date' => $event->slot->attendanceSession->session_date?->format('d/m/Y') ?? '',
                'slot_type' => $event->slot->type === 'am' ? 'Matin' : 'Après-midi',
                'status' => $statusLabels[$event->status] ?? $event->status,
                'status_raw' => $event->status,
                'checked_in_at' => $event->checked_in_at?->format('H:i') ?? '',
            ];
        })->toArray();
    }

    protected function generatePdfHtml($reportData, $startDate, $endDate): string
    {
        $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rapport de Présence</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #1f2937; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; font-size: 12px; }
        th { background-color: #f3f4f6; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .present { color: #059669; }
        .late { color: #d97706; }
        .absent { color: #dc2626; }
        .excused { color: #2563eb; }
    </style>
</head>
<body>
    <h1>Rapport de Présence</h1>
    <p>Période: ' . Carbon::parse($startDate)->format('d/m/Y') . ' - ' . Carbon::parse($endDate)->format('d/m/Y') . '</p>
    <p>Total: ' . count($reportData) . ' pointages</p>
    <table>
        <thead>
            <tr>
                <th>Nom</th>
                <th>Cohorte</th>
                <th>Formation</th>
                <th>Date</th>
                <th>Créneau</th>
                <th>Statut</th>
                <th>Heure</th>
            </tr>
        </thead>
        <tbody>';

        foreach ($reportData as $row) {
            $statusClass = $row['status_raw'];
            $html .= '
            <tr>
                <td>' . htmlspecialchars($row['user_name']) . '</td>
                <td>' . htmlspecialchars($row['cohort_name']) . '</td>
                <td>' . htmlspecialchars($row['course_name']) . '</td>
                <td>' . $row['session_date'] . '</td>
                <td>' . $row['slot_type'] . '</td>
                <td class="' . $statusClass . '">' . $row['status'] . '</td>
                <td>' . $row['checked_in_at'] . '</td>
            </tr>';
        }

        $html .= '
        </tbody>
    </table>
</body>
</html>';

        return $html;
    }
}
