# Implementation

## Stack
- Backend: Laravel 12 + MySQL
- Frontend: React via Inertia.js
- Auth: phone + password (Breeze)
- Roles/Permissions: spatie/laravel-permission
- Audit Log: spatie/laravel-activitylog (or custom log table)

## Deployment (Hostinger)
- Set domain document root to `public/`.
- Build assets locally: `npm run build` and upload `public/build`.
- Upload Laravel code + `vendor/` if no SSH.
- Configure `.env` + run `php artisan migrate --force`.

## Implementation Phases
1) Project scaffold + auth + roles
2) Core data models + migrations
3) Schedule rules + session generation
4) Verifier dashboard + slot management
5) QR check-in + PIN validation
6) Second-chance tokens + audit log
7) Reports, audit log viewer, and settings
8) CSV import/export + calendar views
9) Bilingual UI (EN/FR)

## Defaults
- Grace period in minutes (configurable per cohort)
- AM/PM time windows per cohort
- Slot locking after verification
- Second-chance token expires after a configurable time

## Operational Advice
- Use signed, short-lived URLs for QR access.
- Store timestamps in UTC and display in local time.
- Enforce unique check-in per attendee and slot.
- Require a reason for every manual override.
- Keep the check-in screen under three actions.
