# AttendEase - AI Continuation Prompt

Use this prompt when starting a new conversation with an AI assistant to continue work on this project.

---

## 📋 COPY THIS PROMPT:

````
I'm working on an attendance management system called "AttendEase" built with:
- **Backend**: Laravel 12 + PHP 8.2
- **Frontend**: React + Inertia.js + Tailwind CSS
- **Database**: MySQL
- **Auth**: Laravel Breeze with phone-based authentication
- **Packages**: spatie/laravel-permission, spatie/laravel-activitylog

## Project Location
`c:\Users\said-\OneDrive\Bureau\association attendance`

## Key Documentation
- `docs/TASKS.md` - Complete task checklist (all phases complete)
- `docs/IMPLEMENTATION_PLAN.md` - Technical implementation details
- `docs/WALKTHROUGH.md` - Summary of recent changes

## Current State
✅ All 10 phases complete:
1. Foundation Setup (Laravel, Breeze, permissions)
2. Data Models (Organizations, Users, Courses, Cohorts, Enrollments, Sessions, Slots, CheckInEvents)
3. Core Engine (Session generator, Slot state machine, Check-in validation)
4. Admin UI (Dashboard, CRUD for Courses/Cohorts/Users, Settings)
5. Verifier UI (Today's sessions, Slot panel, QR display)
6. Attendee Flow (QR scan → PIN → Check-in confirmation)
7. Polish (Bilingual support, CSV exports, Audit log)
8. UI Polish (Toast notifications, ConfirmModal, Translations)
9. French-Only Translation (All pages translated, dark mode removed)
10. Privacy Fix (Students only see their own data)

## Important Constraints
- 🇫🇷 **French only** - All UI text must be in French
- ☀️ **Light mode only** - No dark mode classes
- 🔒 **Privacy** - Students only see their own check-ins and enrolled sessions

## Key Files to Know
- `app/Http/Controllers/Admin/DashboardController.php` - Main dashboard logic
- `resources/js/Pages/Dashboard.jsx` - Dashboard UI
- `resources/js/Pages/Attendee/Dashboard.jsx` - Student dashboard
- `resources/js/Layouts/AuthenticatedLayout.jsx` - Main layout with nav
- `resources/js/Context/ToastContext.jsx` - Toast notifications
- `resources/js/Components/ConfirmModal.jsx` - Confirmation dialogs

## User Roles
- `admin` - Full access
- `coordinator` - Manage courses/cohorts
- `verifier` - Control sessions/slots, check-ins
- `instructor` - View assigned cohorts
- `attendee` - Students who check-in

## To Run the App
```bash
# Backend
php artisan serve

# Frontend (in separate terminal)
npm run dev

# Seed test data
php artisan db:seed --class=TestDataSeeder
````

## What I Need Help With

[DESCRIBE YOUR SPECIFIC REQUEST HERE]

Please read the docs/ folder files first to understand the project context.

```

---

## 💡 TIPS FOR BEST RESULTS:

1. **Be specific** - Replace `[DESCRIBE YOUR SPECIFIC REQUEST HERE]` with exactly what you need
2. **Point to files** - Mention specific file paths if you need changes to particular files
3. **Share errors** - Copy/paste any error messages you're seeing
4. **Show screenshots** - Upload screenshots of UI issues if applicable

---

## 🎯 EXAMPLE REQUESTS:

### Bug Fix:
```

What I Need Help With:
The check-in flow is showing an error when users try to enter their PIN.
The error message is: "Token expired"
Please fix this bug in the PIN verification flow.

```

### New Feature:
```

What I Need Help With:
Add an email notification system that sends an email to students when they
successfully check in. The email should be in French and include:

- Course name
- Session date and time
- Check-in status (Présent/Retard)

```

### Styling Fix:
```

What I Need Help With:
The dashboard cards on mobile are too cramped. Please improve the
responsive design so they stack properly on screens smaller than 768px.

```

```
