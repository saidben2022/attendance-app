# Vision

Build a bilingual (French/English) attendance app for an education and training association.
The app tracks multi-week courses with two check-ins per day (AM/PM), supports flexible schedules,
and lets a verifier (not the instructor) validate attendance and grant second-chance check-ins.

## Goals
- Make daily attendance fast and reliable with QR + PIN check-ins.
- Support long-running courses with flexible weekly schedules and exceptions.
- Provide clear accountability with audit logs and controlled overrides.
- Offer simple, role-based experiences for admin, coordinator, verifier, instructor, and attendee.
- Deploy cleanly on shared PHP hosting (Hostinger).
- Enforce strict role boundaries (instructors cannot edit attendance).
- Work reliably on low bandwidth mobile connections.
- Standardize time zone handling per organization.

## Non-Goals (for MVP)
- No SMS/OTP providers (phone + password only).
- No real-time WebSockets (use polling if needed).
- No payment, billing, or finance modules.
- No offline-first or native mobile app.

## Success Criteria
- Verifiers can run daily sessions without friction.
- Attendees can check in within 20 seconds on mobile.
- Coordinators can export accurate reports at any time.
- 100% of manual changes are traceable with author and reason.
