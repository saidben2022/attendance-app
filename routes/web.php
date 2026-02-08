<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\BulkImportController;
use App\Http\Controllers\Admin\CohortController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExportController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\StatisticsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Attendee\CheckInController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Verifier\SessionController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Language switching
Route::get('/locale/{locale}', [LocaleController::class, 'switch'])->name('locale.switch');

// Dashboard - uses new controller with role-based stats
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Help page
    Route::get('/help', fn() => \Inertia\Inertia::render('Help'))->name('help');
});

// Admin routes - require admin or coordinator role
Route::middleware(['auth', 'role:admin|coordinator'])->prefix('admin')->name('admin.')->group(function () {
    // Courses CRUD
    Route::resource('courses', CourseController::class);

    // Cohorts CRUD
    Route::resource('cohorts', CohortController::class);
    Route::post('cohorts/{cohort}/regenerate-sessions', [CohortController::class, 'regenerateSessions'])
        ->name('cohorts.regenerate-sessions');

    // Users Management (admin only for some actions)
    Route::resource('users', UserController::class);
    Route::post('users/{user}/reset-pin', [UserController::class, 'resetPin'])
        ->name('users.reset-pin');

    // Settings
    Route::get('settings', [SettingsController::class, 'index'])->name('settings');
    Route::patch('settings/organization', [SettingsController::class, 'updateOrganization'])
        ->name('settings.organization');

    // Audit Log
    Route::get('audit-log', [AuditLogController::class, 'index'])->name('audit-log');

    // CSV Exports
    Route::prefix('export')->name('export.')->group(function () {
        Route::get('users', [ExportController::class, 'users'])->name('users');
        Route::get('courses', [ExportController::class, 'courses'])->name('courses');
        Route::get('cohorts/{cohort}/attendance', [ExportController::class, 'cohortAttendance'])->name('cohort-attendance');
        Route::get('sessions/{session}/attendance', [ExportController::class, 'sessionAttendance'])->name('session-attendance');
    });

    // Statistics
    Route::get('statistics', [StatisticsController::class, 'index'])->name('statistics.index');

    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/export-csv', [ReportController::class, 'exportCsv'])->name('export-csv');
        Route::get('/export-pdf', [ReportController::class, 'exportPdf'])->name('export-pdf');
    });

    // Bulk Import
    Route::prefix('bulk-import')->name('bulk-import.')->group(function () {
        Route::get('/', [BulkImportController::class, 'index'])->name('index');
        Route::post('/preview', [BulkImportController::class, 'preview'])->name('preview');
        Route::post('/import', [BulkImportController::class, 'import'])->name('import');
        Route::get('/template', [BulkImportController::class, 'downloadTemplate'])->name('template');
    });
});

// Verifier routes - require verifier, instructor, coordinator, or admin role
Route::middleware(['auth', 'role:admin|coordinator|verifier|instructor'])->prefix('verifier')->name('verifier.')->group(function () {
    Route::get('/today', [SessionController::class, 'today'])->name('today');
    Route::get('/slot/{slot}', [SessionController::class, 'slotPanel'])->name('slot');
    Route::get('/slot/{slot}/qr', [SessionController::class, 'qrDisplay'])->name('qr');

    // Slot state management
    Route::post('/slot/{slot}/open', [SessionController::class, 'openSlot'])->name('slot.open');
    Route::post('/slot/{slot}/close', [SessionController::class, 'closeSlot'])->name('slot.close');
    Route::post('/slot/{slot}/lock', [SessionController::class, 'lockSlot'])->name('slot.lock');
    Route::post('/slot/{slot}/manual-checkin', [SessionController::class, 'manualCheckIn'])->name('slot.manual-checkin');
    Route::post('/slot/{slot}/refresh-qr', [SessionController::class, 'refreshQR'])->name('qr.refresh');
});

// Attendee routes - any authenticated user can access
Route::middleware('auth')->prefix('attendee')->name('attendee.')->group(function () {
    Route::get('/dashboard', [CheckInController::class, 'dashboard'])->name('dashboard');
    Route::get('/history', [CheckInController::class, 'history'])->name('history');
    Route::get('/scan-qr', fn() => \Inertia\Inertia::render('Attendee/ScanQR'))->name('scan-qr');
});

// Public check-in routes (accessible when logged in)
Route::middleware('auth')->group(function () {
    Route::get('/check-in/{token}', [CheckInController::class, 'scan'])->name('check-in.scan');
    Route::post('/check-in/verify', [CheckInController::class, 'verifyPin'])->name('check-in.verify');
    Route::get('/second-chance/{tokenCode}', [CheckInController::class, 'useSecondChance'])->name('check-in.second-chance');
});

require __DIR__ . '/auth.php';
