<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Organization
            'manage organization',
            'view organization',

            // Users
            'manage users',
            'view users',

            // Courses
            'manage courses',
            'view courses',

            // Cohorts
            'manage cohorts',
            'view cohorts',

            // Schedules
            'manage schedules',
            'view schedules',

            // Sessions
            'manage sessions',
            'view sessions',

            // Slots
            'manage slots',
            'open slots',
            'close slots',
            'lock slots',
            'unlock slots',

            // Attendance
            'record attendance',
            'override attendance',
            'view attendance',
            'view own attendance',

            // Second chance tokens
            'issue second chance tokens',

            // Reports
            'view reports',
            'export reports',

            // Audit
            'view audit log',

            // Enrollments
            'manage enrollments',
            'import enrollments',
            'export enrollments',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions

        // Admin: Full control
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Coordinator: Manage courses, cohorts, schedules, enrollments
        $coordinatorRole = Role::create(['name' => 'coordinator']);
        $coordinatorRole->givePermissionTo([
            'view organization',
            'view users',
            'manage courses',
            'view courses',
            'manage cohorts',
            'view cohorts',
            'manage schedules',
            'view schedules',
            'manage sessions',
            'view sessions',
            'view attendance',
            'view reports',
            'export reports',
            'manage enrollments',
            'import enrollments',
            'export enrollments',
            'unlock slots',
        ]);

        // Verifier: Run sessions, validate attendance
        $verifierRole = Role::create(['name' => 'verifier']);
        $verifierRole->givePermissionTo([
            'view courses',
            'view cohorts',
            'view schedules',
            'view sessions',
            'manage slots',
            'open slots',
            'close slots',
            'lock slots',
            'record attendance',
            'override attendance',
            'view attendance',
            'issue second chance tokens',
        ]);

        // Instructor: Read-only summaries
        $instructorRole = Role::create(['name' => 'instructor']);
        $instructorRole->givePermissionTo([
            'view courses',
            'view cohorts',
            'view sessions',
            'view attendance',
        ]);

        // Attendee: Self check-in and history
        $attendeeRole = Role::create(['name' => 'attendee']);
        $attendeeRole->givePermissionTo([
            'view own attendance',
        ]);
    }
}
