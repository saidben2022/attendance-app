<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Organization;
use App\Models\Course;
use App\Models\Cohort;
use App\Models\Enrollment;
use App\Models\ScheduleRule;
use App\Models\AttendanceSession;
use App\Models\Slot;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class TestDataSeeder extends Seeder
{
    /**
     * Seed the database with test data for development.
     */
    public function run(): void
    {
        // Create roles first
        $this->createRoles();

        // Create organization
        $org = Organization::create([
            'name' => 'Formation Pro Academy',
            'slug' => 'formation-pro',
            'address' => '123 Training Street, Learning City',
            'phone' => '+33 1 23 45 67 89',
            'email' => 'contact@formationpro.example',
        ]);

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@attendance.local',
            'phone' => '+33612345678',
            'password' => Hash::make('password'),
            'pin_hash' => Hash::make('1234'),
            'organization_id' => $org->id,
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Create coordinator
        $coordinator = User::create([
            'name' => 'Marie Dupont',
            'email' => 'coordinator@attendance.local',
            'phone' => '+33623456789',
            'password' => Hash::make('password'),
            'pin_hash' => Hash::make('5678'),
            'organization_id' => $org->id,
            'email_verified_at' => now(),
        ]);
        $coordinator->assignRole('coordinator');

        // Create verifier
        $verifier = User::create([
            'name' => 'Jean Martin',
            'email' => 'verifier@attendance.local',
            'phone' => '+33634567890',
            'password' => Hash::make('password'),
            'pin_hash' => Hash::make('9012'),
            'organization_id' => $org->id,
            'email_verified_at' => now(),
        ]);
        $verifier->assignRole('verifier');

        // Create instructor
        $instructor = User::create([
            'name' => 'Dr. Sophie Bernard',
            'email' => 'instructor@attendance.local',
            'phone' => '+33645678901',
            'password' => Hash::make('password'),
            'pin_hash' => Hash::make('3456'),
            'organization_id' => $org->id,
            'email_verified_at' => now(),
        ]);
        $instructor->assignRole('instructor');

        // Create courses (simplified schema)
        $webDevCourse = Course::create([
            'organization_id' => $org->id,
            'name' => 'Full-Stack Web Development',
            'code' => 'WEB-101',
            'description' => 'Comprehensive web development course covering HTML, CSS, JavaScript, React, and PHP/Laravel.',
            'is_active' => true,
        ]);

        $dataScienceCourse = Course::create([
            'organization_id' => $org->id,
            'name' => 'Data Science Fundamentals',
            'code' => 'DATA-201',
            'description' => 'Introduction to data science with Python, statistics, and machine learning basics.',
            'is_active' => true,
        ]);

        // Create cohorts
        $webDevCohort = Cohort::create([
            'course_id' => $webDevCourse->id,
            'name' => 'Spring 2026',
            'start_date' => Carbon::today()->startOfMonth(),
            'end_date' => Carbon::today()->addMonths(3),
            'am_start' => '09:00',
            'am_end' => '12:30',
            'pm_start' => '14:00',
            'pm_end' => '17:30',
            'grace_period_minutes' => 15,
            'is_active' => true,
        ]);

        $dataScienceCohort = Cohort::create([
            'course_id' => $dataScienceCourse->id,
            'name' => 'February Intensive',
            'start_date' => Carbon::today()->startOfMonth(),
            'end_date' => Carbon::today()->addMonth(),
            'am_start' => '08:30',
            'am_end' => '12:00',
            'pm_start' => '13:30',
            'pm_end' => '17:00',
            'grace_period_minutes' => 10,
            'is_active' => true,
        ]);

        // Create schedule rules (Mon-Fri for both cohorts)
        $weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        foreach ([$webDevCohort, $dataScienceCohort] as $cohort) {
            foreach ($weekdays as $day) {
                ScheduleRule::create([
                    'cohort_id' => $cohort->id,
                    'day_of_week' => $day,
                    'has_am_slot' => true,
                    'has_pm_slot' => true,
                ]);
            }
        }

        // Create attendee students
        $students = [];
        $studentNames = [
            'Alice Martin' => 'alice@example.com',
            'Bob Johnson' => 'bob@example.com',
            'Claire Dubois' => 'claire@example.com',
            'David Chen' => 'david@example.com',
            'Emma Wilson' => 'emma@example.com',
            'François Petit' => 'francois@example.com',
            'Grace Lee' => 'grace@example.com',
            'Henri Moreau' => 'henri@example.com',
        ];

        $pinCounter = 1000;
        foreach ($studentNames as $name => $email) {
            $student = User::create([
                'name' => $name,
                'email' => $email,
                'phone' => '+336' . rand(10000000, 99999999),
                'password' => Hash::make('password'),
                'pin_hash' => Hash::make((string) $pinCounter),
                'organization_id' => $org->id,
                'email_verified_at' => now(),
            ]);
            $student->assignRole('attendee');
            $students[] = $student;
            $pinCounter++;
        }

        // Enroll students in cohorts
        // First 5 students in Web Dev, last 5 in Data Science (some overlap)
        foreach (array_slice($students, 0, 5) as $student) {
            Enrollment::create([
                'cohort_id' => $webDevCohort->id,
                'user_id' => $student->id,
                'status' => 'active',
                'enrolled_at' => now(),
            ]);
        }

        foreach (array_slice($students, 3, 5) as $student) {
            Enrollment::create([
                'cohort_id' => $dataScienceCohort->id,
                'user_id' => $student->id,
                'status' => 'active',
                'enrolled_at' => now(),
            ]);
        }

        // Create today's sessions for both cohorts
        $this->createTodaySessions($webDevCohort);
        $this->createTodaySessions($dataScienceCohort);

        $this->command->info('Test data created successfully!');
        $this->command->info('');
        $this->command->info('Login credentials:');
        $this->command->info('  Admin:       admin@attendance.local / password (PIN: 1234)');
        $this->command->info('  Coordinator: coordinator@attendance.local / password (PIN: 5678)');
        $this->command->info('  Verifier:    verifier@attendance.local / password (PIN: 9012)');
        $this->command->info('  Instructor:  instructor@attendance.local / password (PIN: 3456)');
        $this->command->info('  Students:    alice@example.com through henri@example.com / password');
        $this->command->info('               (PINs: 1000-1007)');
    }

    private function createRoles(): void
    {
        $roles = ['admin', 'coordinator', 'verifier', 'instructor', 'attendee'];
        foreach ($roles as $role) {
            Role::findOrCreate($role, 'web');
        }
    }

    private function createTodaySessions(Cohort $cohort): void
    {
        $today = Carbon::today();
        $dayOfWeek = strtolower($today->format('l'));

        // Check if there's a schedule rule for today
        $rule = $cohort->scheduleRules()->where('day_of_week', $dayOfWeek)->first();

        // If no rule exists or it's a weekend, still create a session for demo purposes
        $session = AttendanceSession::create([
            'cohort_id' => $cohort->id,
            'session_date' => $today,
            'status' => 'scheduled',
        ]);

        // Create AM slot
        if (!$rule || $rule->has_am_slot) {
            Slot::create([
                'attendance_session_id' => $session->id,
                'type' => 'am',
                'state' => 'scheduled',
            ]);
        }

        // Create PM slot
        if (!$rule || $rule->has_pm_slot) {
            Slot::create([
                'attendance_session_id' => $session->id,
                'type' => 'pm',
                'state' => 'scheduled',
            ]);
        }
    }
}
