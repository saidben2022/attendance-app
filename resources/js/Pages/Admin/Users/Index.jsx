import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/Context/ToastContext';
import ConfirmModal from '@/Components/ConfirmModal';

export default function UsersIndex({ users, roles, filters }) {
    const toast = useToast();
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [confirmModal, setConfirmModal] = useState({ show: false, userId: null, userName: '' });
    const [processing, setProcessing] = useState(false);

    const roleLabels = {
        admin: 'Administrateur',
        coordinator: 'Coordinateur',
        verifier: 'Vérificateur',
        instructor: 'Formateur',
        attendee: 'Stagiaire',
    };

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search, role }, { preserveState: true });
    };

    const handleResetPin = () => {
        setProcessing(true);
        router.post(route('admin.users.reset-pin', confirmModal.userId), {}, {
            onSuccess: () => {
                toast.success('PIN réinitialisé ✓');
                setConfirmModal({ show: false, userId: null, userName: '' });
            },
            onError: () => {
                toast.error('Échec de la réinitialisation du PIN');
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Utilisateurs
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.bulk-import.index')}
                            className="rounded-md bg-white border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Import CSV
                        </Link>
                        <Link
                            href={route('admin.users.create')}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            + Créer un utilisateur
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Utilisateurs" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6">
                        <form onSubmit={handleFilter} className="flex gap-4 flex-wrap">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher..."
                                className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Tous les rôles</option>
                                {roles.map((r) => (
                                    <option key={r} value={r}>{roleLabels[r] || r}</option>
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

                    {/* Users Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Nom
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Email / Téléphone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        N° Membre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Rôles
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Organisation
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.data.map((user) => (
                                    <tr key={user.id}>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <Link
                                                href={route('admin.users.show', user.id)}
                                                className="font-medium text-indigo-600 hover:text-indigo-900"
                                            >
                                                {user.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                            {user.phone && (
                                                <div className="text-sm text-gray-500">{user.phone}</div>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {user.member_id || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles?.map((r) => (
                                                    <span
                                                        key={r.id}
                                                        className="inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
                                                    >
                                                        {roleLabels[r.name] || r.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {user.organization?.name || '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <Link
                                                href={route('admin.users.edit', user.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => setConfirmModal({ show: true, userId: user.id, userName: user.name })}
                                                className="text-yellow-600 hover:text-yellow-900"
                                            >
                                                Réinit. PIN
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users.data.length === 0 && (
                            <div className="py-12 text-center text-gray-500">
                                Aucun utilisateur trouvé
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="flex gap-1">
                                {users.links.map((link, index) => (
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

            {/* Confirm Modal */}
            <ConfirmModal
                show={confirmModal.show}
                onClose={() => setConfirmModal({ show: false, userId: null, userName: '' })}
                onConfirm={handleResetPin}
                title="Réinitialiser le PIN"
                message={`Générer un nouveau PIN pour ${confirmModal.userName} ?`}
                confirmText="Confirmer"
                cancelText="Annuler"
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
