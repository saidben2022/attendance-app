import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CoursesIndex({ courses, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.courses.index'), { search }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Formations
                    </h2>
                    <Link
                        href={route('admin.courses.create')}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        + Nouvelle formation
                    </Link>
                </div>
            }
        >
            <Head title="Formations" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Search */}
                    <div className="mb-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher des formations..."
                                className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                            >
                                Rechercher
                            </button>
                        </form>
                    </div>

                    {/* Courses Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Nom
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Organisation
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Cohortes
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {courses.data.map((course) => (
                                    <tr key={course.id}>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <Link
                                                href={route('admin.courses.show', course.id)}
                                                className="font-medium text-indigo-600 hover:text-indigo-900"
                                            >
                                                {course.name}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {course.code || '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {course.organization?.name || '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {course.cohorts?.length || 0} active(s)
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                course.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {course.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <Link
                                                href={route('admin.courses.edit', course.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Modifier
                                            </Link>
                                            <Link
                                                href={route('admin.cohorts.create', { course_id: course.id })}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                + Cohorte
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {courses.data.length === 0 && (
                            <div className="py-12 text-center text-gray-500">
                                Aucune formation trouvée. Créez votre première formation pour commencer.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {courses.links && courses.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="flex gap-1">
                                {courses.links.map((link, index) => (
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
