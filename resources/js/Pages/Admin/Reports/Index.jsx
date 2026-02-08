import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function ReportsIndex({ reportData, courses, cohorts, filters }) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
    };

    const applyFilters = () => {
        router.get(route('admin.reports.index'), localFilters, { preserveState: true });
    };

    const exportCsv = () => {
        window.location.href = route('admin.reports.export-csv', localFilters);
    };

    const exportPdf = () => {
        window.location.href = route('admin.reports.export-pdf', localFilters);
    };

    const filteredCohorts = localFilters.course_id
        ? cohorts.filter(c => c.course_id == localFilters.course_id)
        : cohorts;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Présent': return 'bg-emerald-100 text-emerald-700';
            case 'Retard': return 'bg-amber-100 text-amber-700';
            case 'Absent': return 'bg-red-100 text-red-700';
            case 'Excusé': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Rapports de présence
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={exportCsv}
                            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Exporter CSV
                        </button>
                        <button
                            onClick={exportPdf}
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Exporter HTML
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Rapports" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                                <input
                                    type="date"
                                    value={localFilters.start_date}
                                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                                <input
                                    type="date"
                                    value={localFilters.end_date}
                                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Formation</label>
                                <select
                                    value={localFilters.course_id || ''}
                                    onChange={(e) => handleFilterChange('course_id', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Toutes</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>{course.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cohorte</label>
                                <select
                                    value={localFilters.cohort_id || ''}
                                    onChange={(e) => handleFilterChange('cohort_id', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Toutes</option>
                                    {filteredCohorts.map((cohort) => (
                                        <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                <select
                                    value={localFilters.status || ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Tous</option>
                                    <option value="present">Présent</option>
                                    <option value="late">Retard</option>
                                    <option value="absent">Absent</option>
                                    <option value="excused">Excusé</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={applyFilters}
                                    className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-indigo-600 hover:to-purple-700 transition shadow-lg"
                                >
                                    Filtrer
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">{reportData.length}</span> résultats trouvés
                        </p>
                    </div>

                    {/* Report Table */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Étudiant
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cohorte
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Créneau
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Heure
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.length > 0 ? (
                                        reportData.map((row) => (
                                            <tr key={row.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{row.user_name}</div>
                                                        <div className="text-xs text-gray-500">{row.user_email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm text-gray-900">{row.cohort_name}</div>
                                                        <div className="text-xs text-gray-500">{row.course_name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {row.session_date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {row.slot_type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(row.status)}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {row.checked_in_at || '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="mt-4">Aucun pointage trouvé pour cette période</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
