import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/Context/ToastContext';
import ConfirmModal from '@/Components/ConfirmModal';

export default function CohortShow({ cohort, enrollmentStats }) {
    const toast = useToast();
    const [regenerateModal, setRegenerateModal] = useState(false);
    const [actionProcessing, setActionProcessing] = useState(false);

    const handleRegenerateSessions = () => {
        setActionProcessing(true);
        router.post(route('admin.cohorts.regenerate-sessions', cohort.id), {}, {
            onSuccess: () => {
                toast.success('Sessions régénérées ✓');
                setRegenerateModal(false);
            },
            onFinish: () => setActionProcessing(false),
        });
    };

    const stateLabels = {
        scheduled: 'Planifié',
        open: 'Ouvert',
        closed: 'Fermé',
        locked: 'Verrouillé',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={route('admin.cohorts.index')} className="text-sm text-gray-500 hover:text-gray-700">
                            ← Retour aux cohortes
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 mt-1">
                            {cohort.name}
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setRegenerateModal(true)}
                            className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-500"
                        >
                            Régénérer les sessions
                        </button>
                        <Link
                            href={route('admin.cohorts.edit', cohort.id)}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Modifier
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={cohort.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Actifs" value={enrollmentStats.active} color="emerald" />
                        <StatCard label="Terminés" value={enrollmentStats.completed} color="blue" />
                        <StatCard label="Retirés" value={enrollmentStats.withdrawn} color="gray" />
                        <StatCard label="Sessions" value={cohort.attendance_sessions?.length || 0} color="indigo" />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Details */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Détails de la cohorte</h3>
                                </div>
                                <div className="p-6">
                                    <dl className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <dt className="font-medium text-gray-500">Formation</dt>
                                            <dd className="mt-1">
                                                <Link 
                                                    href={route('admin.courses.show', cohort.course?.id)} 
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {cohort.course?.name}
                                                </Link>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500">Organisation</dt>
                                            <dd className="mt-1 text-gray-900">{cohort.course?.organization?.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500">Période</dt>
                                            <dd className="mt-1 text-gray-900">
                                                {new Date(cohort.start_date).toLocaleDateString('fr-FR')} - {new Date(cohort.end_date).toLocaleDateString('fr-FR')}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500">Statut</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                    cohort.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {cohort.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500">Session matin</dt>
                                            <dd className="mt-1 text-gray-900">{cohort.am_start} - {cohort.am_end}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500">Session après-midi</dt>
                                            <dd className="mt-1 text-gray-900">{cohort.pm_start} - {cohort.pm_end}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500">Période de grâce</dt>
                                            <dd className="mt-1 text-gray-900">{cohort.grace_period_minutes || 15} min</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Weekly Schedule */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Emploi du temps</h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => {
                                            const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                                            const rule = cohort.schedule_rules?.find(r => r.day_of_week === dayNames[i]);
                                            return (
                                                <div key={day} className="space-y-1">
                                                    <div className="font-medium text-gray-700">{day}</div>
                                                    <div className={`py-1 px-2 rounded text-xs ${rule?.has_am_slot ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                                                        Matin
                                                    </div>
                                                    <div className={`py-1 px-2 rounded text-xs ${rule?.has_pm_slot ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                                                        Après-midi
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Sessions */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Sessions récentes</h3>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {cohort.attendance_sessions?.slice(0, 10).map((session) => (
                                        <div key={session.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {new Date(session.session_date).toLocaleDateString('fr-FR', { 
                                                            weekday: 'long', 
                                                            year: 'numeric', 
                                                            month: 'short', 
                                                            day: 'numeric' 
                                                        })}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{session.status}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {session.slots?.map((slot) => (
                                                        <span 
                                                            key={slot.id} 
                                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                slot.state === 'open' ? 'bg-green-100 text-green-800' :
                                                                slot.state === 'closed' ? 'bg-yellow-100 text-yellow-800' :
                                                                slot.state === 'locked' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}
                                                        >
                                                            {slot.type.toUpperCase()}: {stateLabels[slot.state] || slot.state}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!cohort.attendance_sessions || cohort.attendance_sessions.length === 0) && (
                                        <div className="p-8 text-center text-gray-500">
                                            Aucune session générée
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Enrollments */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Stagiaires inscrits</h3>
                                </div>
                                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                                    {cohort.enrollments?.filter(e => e.status === 'active').map((enrollment) => (
                                        <div key={enrollment.id} className="p-3 hover:bg-gray-50">
                                            <Link 
                                                href={route('admin.users.show', enrollment.user?.id)}
                                                className="font-medium text-gray-900 hover:text-indigo-600"
                                            >
                                                {enrollment.user?.name}
                                            </Link>
                                            <p className="text-xs text-gray-500">{enrollment.user?.email}</p>
                                        </div>
                                    ))}
                                    {(!cohort.enrollments || cohort.enrollments.filter(e => e.status === 'active').length === 0) && (
                                        <div className="p-6 text-center text-gray-500 text-sm">
                                            Aucune inscription active
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Exceptions */}
                            {cohort.schedule_exceptions?.length > 0 && (
                                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Exceptions</h3>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {cohort.schedule_exceptions.map((exception) => (
                                            <div key={exception.id} className="p-3">
                                                <p className="font-medium text-gray-900">
                                                    {new Date(exception.exception_date).toLocaleDateString('fr-FR')}
                                                </p>
                                                <p className="text-sm text-gray-500 capitalize">{exception.type}: {exception.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Regenerate Sessions Confirmation Modal */}
            <ConfirmModal
                show={regenerateModal}
                onClose={() => setRegenerateModal(false)}
                onConfirm={handleRegenerateSessions}
                title="Régénérer les sessions"
                message="Cela régénèrera toutes les sessions futures. Les données de pointage existantes seront conservées."
                confirmText="Confirmer"
                cancelText="Annuler"
                processing={actionProcessing}
            />
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, color }) {
    const colors = {
        emerald: 'bg-emerald-50 text-emerald-700',
        blue: 'bg-blue-50 text-blue-700',
        gray: 'bg-gray-50 text-gray-700',
        indigo: 'bg-indigo-50 text-indigo-700',
    };

    return (
        <div className={`rounded-lg p-4 ${colors[color]}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm opacity-75">{label}</p>
        </div>
    );
}
