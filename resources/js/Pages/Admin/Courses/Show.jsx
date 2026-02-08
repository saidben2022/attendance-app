import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function CourseShow({ course }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <Link 
                            href={route('admin.courses.index')} 
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            ← Retour aux formations
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 mt-1">
                            {course.name}
                        </h2>
                    </div>
                    <Link
                        href={route('admin.courses.edit', course.id)}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        Modifier
                    </Link>
                </div>
            }
        >
            <Head title={`${course.name} - Formation`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Course Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Détails de la formation</h3>
                                </div>
                                <div className="p-6">
                                    <dl className="grid grid-cols-2 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Code</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{course.code || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Organisation</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{course.organization?.name || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Statut</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                    course.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {course.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Total cohortes</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{course.cohorts?.length || 0}</dd>
                                        </div>
                                    </dl>
                                    {course.description && (
                                        <div className="mt-6">
                                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{course.description}</dd>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cohorts List */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Cohortes</h3>
                                    <Link
                                        href={route('admin.cohorts.create', { course_id: course.id })}
                                        className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
                                    >
                                        + Ajouter une cohorte
                                    </Link>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {course.cohorts?.length > 0 ? (
                                        course.cohorts.map((cohort) => (
                                            <div key={cohort.id} className="p-4 hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Link
                                                            href={route('admin.cohorts.show', cohort.id)}
                                                            className="font-medium text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            {cohort.name}
                                                        </Link>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(cohort.start_date).toLocaleDateString('fr-FR')} - {new Date(cohort.end_date).toLocaleDateString('fr-FR')}
                                                        </p>
                                                    </div>
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        cohort.is_active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {cohort.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-500">
                                            Aucune cohorte. Créez votre première cohorte pour commencer le suivi des présences.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="space-y-6">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Actions rapides</h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    <Link
                                        href={route('admin.cohorts.create', { course_id: course.id })}
                                        className="flex items-center p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium text-gray-900">Nouvelle cohorte</p>
                                            <p className="text-sm text-gray-500">Créer une nouvelle cohorte pour cette formation</p>
                                        </div>
                                    </Link>
                                    <Link
                                        href={route('admin.courses.edit', course.id)}
                                        className="flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium text-gray-900">Modifier la formation</p>
                                            <p className="text-sm text-gray-500">Modifier les détails de la formation</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
