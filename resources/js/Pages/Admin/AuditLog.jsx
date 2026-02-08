import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AuditLog({ activities, users, filters }) {
    const [localFilters, setLocalFilters] = useState({
        user_id: filters?.user_id || '',
        subject_type: filters?.subject_type || '',
        from_date: filters?.from_date || '',
        to_date: filters?.to_date || '',
        search: filters?.search || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.audit-log'), localFilters, { preserveState: true });
    };

    const clearFilters = () => {
        setLocalFilters({
            user_id: '',
            subject_type: '',
            from_date: '',
            to_date: '',
            search: '',
        });
        router.get(route('admin.audit-log'));
    };

    const getActionColor = (description) => {
        if (description.includes('created') || description.includes('checked in') || description.includes('créé') || description.includes('pointé')) {
            return 'bg-green-100 text-green-800';
        }
        if (description.includes('updated') || description.includes('changed') || description.includes('modifié')) {
            return 'bg-blue-100 text-blue-800';
        }
        if (description.includes('deleted') || description.includes('removed') || description.includes('supprimé')) {
            return 'bg-red-100 text-red-800';
        }
        return 'bg-gray-100 text-gray-800';
    };

    const subjectTypeLabels = {
        User: 'Utilisateur',
        Course: 'Formation',
        Cohort: 'Cohorte',
        Slot: 'Créneau',
        CheckInEvent: 'Pointage',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Journal d'activité
                    </h2>
                </div>
            }
        >
            <Head title="Journal d'activité" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-6">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
                        </div>
                        <form onSubmit={handleFilter} className="p-6">
                            <div className="grid gap-4 md:grid-cols-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Utilisateur</label>
                                    <select
                                        value={localFilters.user_id}
                                        onChange={(e) => setLocalFilters(f => ({...f, user_id: e.target.value}))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    >
                                        <option value="">Tous les utilisateurs</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select
                                        value={localFilters.subject_type}
                                        onChange={(e) => setLocalFilters(f => ({...f, subject_type: e.target.value}))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    >
                                        <option value="">Tous les types</option>
                                        <option value="User">Utilisateur</option>
                                        <option value="Course">Formation</option>
                                        <option value="Cohort">Cohorte</option>
                                        <option value="Slot">Créneau</option>
                                        <option value="CheckInEvent">Pointage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Depuis le</label>
                                    <input
                                        type="date"
                                        value={localFilters.from_date}
                                        onChange={(e) => setLocalFilters(f => ({...f, from_date: e.target.value}))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Jusqu'au</label>
                                    <input
                                        type="date"
                                        value={localFilters.to_date}
                                        onChange={(e) => setLocalFilters(f => ({...f, to_date: e.target.value}))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Recherche</label>
                                    <input
                                        type="text"
                                        value={localFilters.search}
                                        onChange={(e) => setLocalFilters(f => ({...f, search: e.target.value}))}
                                        placeholder="Rechercher des actions..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Appliquer les filtres
                                </button>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                                >
                                    Effacer
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Activity List */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                                Activités ({activities.total || 0})
                            </h3>
                        </div>
                        
                        {activities.data?.length > 0 ? (
                            <>
                                <div className="divide-y divide-gray-200">
                                    {activities.data.map((activity) => (
                                        <div key={activity.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                        {activity.causer_name?.charAt(0)?.toUpperCase() || 'S'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-medium text-gray-900">
                                                                {activity.causer_name}
                                                            </span>
                                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getActionColor(activity.description)}`}>
                                                                {activity.description}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                            {activity.subject_type && (
                                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                                    {subjectTypeLabels[activity.subject_type] || activity.subject_type} #{activity.subject_id}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {Object.keys(activity.properties).length > 0 && (
                                                            <details className="mt-2">
                                                                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                                                                    Afficher les détails
                                                                </summary>
                                                                <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                                                                    {JSON.stringify(activity.properties, null, 2)}
                                                                </pre>
                                                            </details>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-sm text-gray-500">{activity.created_at_human}</p>
                                                    <p className="text-xs text-gray-400">{activity.created_at}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {activities.last_page > 1 && (
                                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            Affichage de {activities.from} à {activities.to} sur {activities.total}
                                        </p>
                                        <div className="flex gap-2">
                                            {activities.prev_page_url && (
                                                <Link
                                                    href={activities.prev_page_url}
                                                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                                                >
                                                    Précédent
                                                </Link>
                                            )}
                                            {activities.next_page_url && (
                                                <Link
                                                    href={activities.next_page_url}
                                                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                                                >
                                                    Suivant
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Aucune activité trouvée</h3>
                                <p className="mt-2 text-gray-500">Essayez d'ajuster vos filtres.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
