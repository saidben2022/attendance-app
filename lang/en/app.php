<?php

return [
    // Navigation
    'nav' => [
        'dashboard' => 'Dashboard',
        'courses' => 'Courses',
        'cohorts' => 'Cohorts',
        'users' => 'Users',
        'settings' => 'Settings',
        'sessions' => 'Sessions',
        'my_attendance' => 'My Attendance',
        'profile' => 'Profile',
        'logout' => 'Log Out',
        'audit_log' => 'Audit Log',
        'help' => 'Help',
    ],

    // Common
    'common' => [
        'save' => 'Save',
        'cancel' => 'Cancel',
        'delete' => 'Delete',
        'edit' => 'Edit',
        'create' => 'Create',
        'search' => 'Search...',
        'actions' => 'Actions',
        'back' => 'Back',
        'view' => 'View',
        'yes' => 'Yes',
        'no' => 'No',
        'confirm' => 'Confirm',
        'loading' => 'Loading...',
        'saving' => 'Saving...',
        'saved' => 'Saved!',
        'export_csv' => 'Export CSV',
        'no_data' => 'No data available',
        'refresh' => 'Refresh',
        'refreshed' => 'Refreshed',
        'active' => 'Active',
        'inactive' => 'Inactive',
        'none' => 'None',
        'never' => 'Never',
        'set' => 'Set',
        'not_set' => 'Not Set',
        'open' => 'Open',
        'filter' => 'Filter',
        'all' => 'All',
    ],

    // Auth
    'auth' => [
        'login' => 'Log In',
        'register' => 'Register',
        'email' => 'Email',
        'password' => 'Password',
        'remember_me' => 'Remember me',
        'forgot_password' => 'Forgot your password?',
        'reset_password' => 'Reset Password',
        'confirm_password' => 'Confirm Password',
        'name' => 'Name',
        'phone' => 'Phone',
    ],

    // Dashboard
    'dashboard' => [
        'title' => 'Dashboard',
        'welcome' => 'Welcome back',
        'total_users' => 'Total Users',
        'active_cohorts' => 'Active Cohorts',
        'today_sessions' => 'Today\'s Sessions',
        'check_ins_today' => 'Check-ins Today',
        'attendance_rate' => 'Attendance Rate',
    ],

    // Courses
    'courses' => [
        'title' => 'Courses',
        'create' => 'Create Course',
        'edit' => 'Edit Course',
        'name' => 'Course Name',
        'code' => 'Course Code',
        'description' => 'Description',
        'organization' => 'Organization',
        'active_cohorts' => 'Active Cohorts',
        'total_students' => 'Total Students',
        'default_times' => 'Default Session Times',
        'am_session' => 'AM Session',
        'pm_session' => 'PM Session',
        'grace_period' => 'Grace Period (minutes)',
    ],

    // Cohorts
    'cohorts' => [
        'title' => 'Cohorts',
        'create' => 'Create Cohort',
        'edit' => 'Edit Cohort',
        'name' => 'Cohort Name',
        'course' => 'Course',
        'start_date' => 'Start Date',
        'end_date' => 'End Date',
        'is_active' => 'Active',
        'enrolled_students' => 'Enrolled Students',
        'weekly_schedule' => 'Weekly Schedule',
        'sessions' => 'Sessions',
        'grace_period' => 'Grace Period',
        'regenerate_sessions' => 'Regenerate Sessions',
        'details' => 'Cohort Details',
    ],

    // Users
    'users' => [
        'title' => 'Users',
        'create' => 'Create User',
        'edit' => 'Edit User',
        'name' => 'Name',
        'email' => 'Email',
        'phone' => 'Phone',
        'role' => 'Role',
        'roles' => 'Roles',
        'organization' => 'Organization',
        'pin' => 'PIN',
        'reset_pin' => 'Reset PIN',
        'change_password' => 'Change Password',
        'details' => 'User Details',
        'member_since' => 'Member Since',
        'last_login' => 'Last Login',
        'pin_status' => 'PIN Status',
        'edit_profile' => 'Edit Profile',
        'pin_reset_success' => 'PIN reset successfully',
        'reset_pin_confirm' => 'Generate a new 4-digit PIN for :name?',
        'delete_confirm' => 'Are you sure you want to delete :name? This action cannot be undone.',
    ],

    // Roles
    'roles' => [
        'admin' => 'Administrator',
        'coordinator' => 'Coordinator',
        'verifier' => 'Verifier',
        'instructor' => 'Instructor',
        'attendee' => 'Attendee',
    ],

    // Status
    'status' => [
        'active' => 'Active',
        'inactive' => 'Inactive',
        'completed' => 'Completed',
        'withdrawn' => 'Withdrawn',
        'present' => 'Present',
        'late' => 'Late',
        'absent' => 'Absent',
        'excused' => 'Excused',
        'pending' => 'Pending',
    ],

    // Sessions & Slots
    'sessions' => [
        'title' => 'Today\'s Sessions',
        'today' => 'Today\'s Sessions',
        'date' => 'Date',
        'slot' => 'Slot',
        'session' => 'Session',
        'am' => 'AM',
        'pm' => 'PM',
        'state' => 'State',
        'scheduled' => 'Scheduled',
        'open' => 'Open',
        'closed' => 'Closed',
        'locked' => 'Locked',
        'open_slot' => 'Open Slot',
        'close_slot' => 'Close Slot',
        'lock_slot' => 'Lock & Finalize',
        'show_qr' => 'Show QR',
        'refresh_qr' => 'Refresh QR',
        'check_ins' => 'check-ins',
        'no_sessions_today' => 'No sessions scheduled for today',
        'check_back_later' => 'Check back later or contact an administrator.',
        'state_scheduled' => 'Scheduled',
        'state_open' => 'Open',
        'state_closed' => 'Closed',
        'state_locked' => 'Locked',
    ],

    // Enrollments
    'enrollments' => [
        'title' => 'Enrollments',
        'enrolled' => 'Enrolled',
        'none' => 'No enrollments found',
    ],

    // Check-ins
    'check_ins' => [
        'recent' => 'Recent Check-ins',
        'none' => 'No check-ins recorded',
    ],

    // Stats
    'stats' => [
        'attendance' => 'Attendance Stats',
        'rate' => 'Attendance Rate',
    ],

    // Attendance
    'attendance' => [
        'title' => 'Attendance',
        'status' => 'Status',
        'present' => 'Present',
        'late' => 'Late',
        'absent' => 'Absent',
        'excused' => 'Excused',
        'pending' => 'Pending',
        'checked_in_at' => 'Checked in at',
        'manual_entry' => 'Manual Entry',
        'manual_checkin' => 'Manual Check-in',
        'history' => 'Attendance History',
    ],

    // Check-in
    'checkin' => [
        'title' => 'Check-in',
        'scan_qr' => 'Scan QR to check in',
        'enter_pin' => 'Enter your 4-digit PIN',
        'verify' => 'Verify',
        'success' => 'Check-in successful!',
        'already_checked_in' => 'You have already checked in',
        'error_invalid_qr' => 'This QR code is invalid or the session is closed.',
        'error_not_enrolled' => 'You are not enrolled in this course.',
        'forgot_pin' => 'Forgot your PIN? Contact your instructor.',
    ],

    // Settings
    'settings' => [
        'title' => 'Settings',
        'system_overview' => 'System Overview',
        'organization_settings' => 'Organization Settings',
        'quick_actions' => 'Quick Actions',
        'language' => 'Language',
        'english' => 'English',
        'french' => 'Français',
    ],

    // Days of week
    'days' => [
        'monday' => 'Monday',
        'tuesday' => 'Tuesday',
        'wednesday' => 'Wednesday',
        'thursday' => 'Thursday',
        'friday' => 'Friday',
        'saturday' => 'Saturday',
        'sunday' => 'Sunday',
    ],

    // Audit Log
    'audit' => [
        'title' => 'Activity Log',
        'action' => 'Action',
        'user' => 'User',
        'subject' => 'Subject',
        'date' => 'Date',
        'details' => 'Details',
    ],
];
