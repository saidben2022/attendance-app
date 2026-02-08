<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $courses = Course::with([
            'organization',
            'cohorts' => function ($query) {
                $query->where('is_active', true);
            }
        ])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        $organizations = Organization::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Courses/Create', [
            'organizations' => $organizations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_id' => ['required', 'exists:organizations,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('courses')->where('organization_id', $request->organization_id)],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        Course::create($validated);

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course created successfully.');
    }

    public function show(Course $course)
    {
        $course->load([
            'organization',
            'cohorts' => function ($query) {
                $query->orderBy('start_date', 'desc');
            }
        ]);

        return Inertia::render('Admin/Courses/Show', [
            'course' => $course,
        ]);
    }

    public function edit(Course $course)
    {
        $organizations = Organization::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Courses/Edit', [
            'course' => $course,
            'organizations' => $organizations,
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'organization_id' => ['required', 'exists:organizations,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('courses')->where('organization_id', $request->organization_id)->ignore($course->id)],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $course->update($validated);

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        if ($course->cohorts()->exists()) {
            return back()->with('error', 'Cannot delete course with existing cohorts.');
        }

        $course->delete();

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course deleted successfully.');
    }
}
