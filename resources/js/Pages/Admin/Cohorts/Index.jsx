import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CohortsIndex({ cohorts, courses, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [courseId, setCourseId] = useState(filters.course_id || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.cohorts.index'), { search, course_id: courseId }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Cohortes
                    </h2>
                    <Link
                        href={route('admin.cohorts.create')}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        + Nouvelle cohorte
                    </Link>
                </div>
            }
        >
            <Head title="Cohortes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6">
                        <form onSubmit={handleFilter} className="flex gap-4 flex-wrap">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher des cohortes..."
                                className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <select
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Toutes les formations</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>{course.name}</option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                            >
                                Filtrer
                            </button>
                        </form>
                    </div>

                    {/* Cohorts Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {cohorts.data.map((cohort) => (
                            <div key={cohort.id} className="overflow-hidden bg-white shadow-sm sm:rounded-lg hover:shadow-md transition">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Link
                                                href={route('admin.cohorts.show', cohort.id)}
                                                className="text-lg font-semibold text-indigo-600 hover:text-indigo-900"
                                            >
                                                {cohort.name}
                                            </Link>
                                            <p className="text-sm text-gray-500">{cohort.course?.name}</p>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                            cohort.is_active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {cohort.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    
                                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>
                                                {new Date(cohort.start_date).toLocaleDateString('fr-FR')} - {new Date(cohort.end_date).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>
                                                Matin: {cohort.am_start}-{cohort.am_end} | Après-midi: {cohort.pm_start}-{cohort.pm_end}
                                            </span>
                                        </div>
                                        {cohort.course?.organization && (
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span>{cohort.course.organization.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Link
                                            href={route('admin.cohorts.show', cohort.id)}
                                            className="flex-1 text-center rounded bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                        >
                                            Voir
                                        </Link>
                                        <Link
                                            href={route('admin.cohorts.edit', cohort.id)}
                                            className="flex-1 text-center rounded bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
                                        >
                                            Modifier
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {cohorts.data.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg">
                            <p className="text-gray-500">Aucune cohorte trouvée. Créez votre première cohorte pour commencer le suivi des présences.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {cohorts.links && cohorts.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="flex gap-1">
                                {cohorts.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 text-sm rounded ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
