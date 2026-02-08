import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/Context/ToastContext';
import ConfirmModal from '@/Components/ConfirmModal';

export default function UserShow({ user, stats, recentCheckIns }) {
    const toast = useToast();
    const [resetModal, setResetModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const roleLabels = {
        admin: 'Administrateur',
        coordinator: 'Coordinateur',
        verifier: 'Vérificateur',
        instructor: 'Formateur',
        attendee: 'Stagiaire',
    };

    const statusLabels = {
        present: 'Présent',
        late: 'Retard',
        absent: 'Absent',
        excused: 'Excusé',
        active: 'Actif',
        completed: 'Terminé',
        withdrawn: 'Retiré',
    };

    const handleResetPin = () => {
        setProcessing(true);
        router.post(route('admin.users.reset-pin', user.id), {}, {
            onSuccess: () => {
                toast.success('PIN réinitialisé avec succès');
                setResetModal(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={route('admin.users.index')} className="text-sm text-gray-500 hover:text-gray-700">
                            ← Retour aux utilisateurs
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 mt-1">
                            {user.name}
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setResetModal(true)}
                            className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-500"
                        >
                            Réinitialiser le PIN
                        </button>
                        <Link
                            href={route('admin.users.edit', user.id)}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Modifier le profil
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={user.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* User Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Détails utilisateur</h3>
                                </div>
                                <div className="p-6">
                                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Nom</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.phone || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">N° Membre</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.member_id || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Organisation</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.organization?.name || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Rôles</dt>
                                            <dd className="mt-1 flex flex-wrap gap-1">
                                                {user.roles?.map((role) => (
                                                    <span
                                                        key={role.id}
                                                        className="inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
                                                    >
                                                        {roleLabels[role.name] || role.name}
                                                    </span>
                                                ))}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Membre depuis</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">État du PIN</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {user.pin ? (
                                                    <span className="text-green-600">Défini</span>
                                                ) : (
                                                    <span className="text-gray-400">Non défini</span>
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Enrollments */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Inscriptions</h3>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {user.enrollments?.length > 0 ? (
                                        user.enrollments.map((enrollment) => (
                                            <div key={enrollment.id} className="p-4 hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Link
                                                            href={route('admin.cohorts.show', enrollment.cohort?.id)}
                                                            className="font-medium text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            {enrollment.cohort?.name}
                                                        </Link>
                                                        <p className="text-sm text-gray-500">
                                                            {enrollment.cohort?.course?.name}
                                                        </p>
                                                    </div>
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        enrollment.status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {statusLabels[enrollment.status] || enrollment.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-gray-500">
                                            Aucune inscription
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Stats */}
                            {stats && (
                                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Statistiques de présence</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-indigo-600">
                                                {stats.attendance_rate}%
                                            </div>
                                            <div className="text-sm text-gray-500">Taux de présence</div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-4 text-center text-sm">
                                            <div>
                                                <div className="font-semibold text-green-600">{stats.present || 0}</div>
                                                <div className="text-gray-500">Présent</div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-yellow-600">{stats.late || 0}</div>
                                                <div className="text-gray-500">Retard</div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-red-600">{stats.absent || 0}</div>
                                                <div className="text-gray-500">Absent</div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-blue-600">{stats.excused || 0}</div>
                                                <div className="text-gray-500">Excusé</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Recent Check-ins */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Pointages récents</h3>
                                </div>
                                <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                                    {recentCheckIns?.length > 0 ? (
                                        recentCheckIns.map((checkIn) => (
                                            <div key={checkIn.id} className="p-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm">
                                                        <p className="text-gray-900">{checkIn.cohort_name}</p>
                                                        <p className="text-gray-500">{checkIn.date} - {checkIn.slot_type}</p>
                                                    </div>
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        checkIn.status === 'present' ? 'bg-green-100 text-green-800' :
                                                        checkIn.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {statusLabels[checkIn.status] || checkIn.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-gray-500 text-sm">
                                            Aucun pointage enregistré
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reset PIN Modal */}
            <ConfirmModal
                show={resetModal}
                onClose={() => setResetModal(false)}
                onConfirm={handleResetPin}
                title="Réinitialiser le PIN"
                message={`Générer un nouveau PIN à 4 chiffres pour ${user.name} ?`}
                confirmText="Confirmer"
                cancelText="Annuler"
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
