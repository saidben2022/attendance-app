import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/Context/ToastContext';
import ConfirmModal from '@/Components/ConfirmModal';

export default function SlotPanel({ slot, session, cohort, enrolledUsers, stats }) {
    const toast = useToast();
    const [selectedUser, setSelectedUser] = useState(null);
    const [showManualCheckIn, setShowManualCheckIn] = useState(false);
    const [lockModal, setLockModal] = useState(false);
    const [actionProcessing, setActionProcessing] = useState(false);

    const statusLabels = {
        present: 'Présent',
        late: 'Retard',
        absent: 'Absent',
        excused: 'Excusé',
        not_checked_in: 'En attente',
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'late': return 'bg-yellow-100 text-yellow-800';
            case 'absent': return 'bg-red-100 text-red-800';
            case 'excused': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const handleOpenSlot = () => {
        router.post(route('verifier.slot.open', slot.id), {}, {
            onSuccess: () => toast.success('Créneau ouvert ✓'),
        });
    };

    const handleCloseSlot = () => {
        router.post(route('verifier.slot.close', slot.id), {}, {
            onSuccess: () => toast.success('Créneau fermé ✓'),
        });
    };

    const handleLockSlot = () => {
        setActionProcessing(true);
        router.post(route('verifier.slot.lock', slot.id), {}, {
            onSuccess: () => {
                toast.success('Créneau verrouillé ✓');
                setLockModal(false);
            },
            onFinish: () => setActionProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={route('verifier.today')} className="text-sm text-gray-500 hover:text-gray-700">
                            ← Retour aux sessions
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 mt-1">
                            {cohort.course_name} — {cohort.name}
                        </h2>
                        <p className="text-sm text-gray-500">{slot.type.toUpperCase()} Session • {session.date}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('verifier.qr', slot.id)}
                            className="rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-500"
                        >
                            Afficher QR
                        </Link>
                        {slot.state === 'scheduled' && (
                            <button onClick={handleOpenSlot} className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500">
                                Ouvrir le créneau
                            </button>
                        )}
                        {slot.state === 'open' && (
                            <button onClick={handleCloseSlot} className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-500">
                                Fermer le créneau
                            </button>
                        )}
                        {(slot.state === 'open' || slot.state === 'closed') && (
                            <button onClick={handleLockSlot} className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500">
                                Verrouiller
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`${slot.type.toUpperCase()} - ${cohort.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                        <StatCard label="Inscrits" value={stats.total_enrolled} color="gray" />
                        <StatCard label="Présents" value={stats.present} color="green" />
                        <StatCard label="Retards" value={stats.late} color="yellow" />
                        <StatCard label="Absents" value={stats.absent} color="red" />
                        <StatCard label="Excusés" value={stats.excused} color="blue" />
                        <StatCard label="En attente" value={stats.not_checked_in} color="purple" />
                    </div>

                    {/* Slot State Banner */}
                    <SlotStateBanner state={slot.state} />

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Liste de présence</h3>
                                    <button
                                        onClick={() => setShowManualCheckIn(true)}
                                        disabled={slot.state === 'locked'}
                                        className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        + Pointage manuel
                                    </button>
                                </div>
                                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                                    {enrolledUsers.map((user) => (
                                        <div 
                                            key={user.id} 
                                            className="p-4 flex items-center justify-between hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                    {user.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {user.checked_in_at && (
                                                    <span className="text-xs text-gray-400">{user.checked_in_at}</span>
                                                )}
                                                {user.is_manual && (
                                                    <span className="text-xs text-gray-400 italic">manuel</span>
                                                )}
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(user.status)}`}>
                                                    {statusLabels[user.status] || user.status}
                                                </span>
                                                {slot.state !== 'locked' && (
                                                    <button
                                                        onClick={() => { setSelectedUser(user); setShowManualCheckIn(true); }}
                                                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                    >
                                                        Modifier
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* QR Preview */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Pointage QR</h3>
                                </div>
                                <div className="p-6 text-center">
                                    {slot.state === 'open' && slot.qr_token ? (
                                        <>
                                            <div className="h-32 w-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                                <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                                </svg>
                                            </div>
                                            <Link
                                                href={route('verifier.qr', slot.id)}
                                                className="inline-flex items-center text-indigo-600 hover:text-indigo-900 font-medium"
                                            >
                                                Ouvrir en plein écran
                                                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </Link>
                                        </>
                                    ) : (
                                        <p className="text-gray-500">
                                            {slot.state === 'open' ? 'Génération du QR...' : 'Ouvrez le créneau pour activer le pointage QR'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Actions</h3>
                                </div>
                                <div className="p-4 space-y-2">
                                    {slot.state === 'scheduled' && (
                                        <button
                                            onClick={handleOpenSlot}
                                            className="w-full flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
                                        >
                                            <div className="h-8 w-8 rounded bg-green-500 flex items-center justify-center text-white">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.262a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="ml-3 font-medium text-gray-900">Ouvrir pour les pointages</span>
                                        </button>
                                    )}
                                    {slot.state === 'open' && (
                                        <>
                                            <button
                                                onClick={() => router.post(route('verifier.qr.refresh', slot.id))}
                                                className="w-full flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                                            >
                                                <div className="h-8 w-8 rounded bg-indigo-500 flex items-center justify-center text-white">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                </div>
                                                <span className="ml-3 font-medium text-gray-900">Actualiser le QR</span>
                                            </button>
                                            <button
                                                onClick={handleCloseSlot}
                                                className="w-full flex items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
                                            >
                                                <div className="h-8 w-8 rounded bg-yellow-500 flex items-center justify-center text-white">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                                    </svg>
                                                </div>
                                                <span className="ml-3 font-medium text-gray-900">Fermer le créneau</span>
                                            </button>
                                        </>
                                    )}
                                    {(slot.state === 'open' || slot.state === 'closed') && (
                                        <button
                                            onClick={() => setLockModal(true)}
                                            className="w-full flex items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition"
                                        >
                                            <div className="h-8 w-8 rounded bg-red-500 flex items-center justify-center text-white">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <span className="ml-3 font-medium text-gray-900">Verrouiller le créneau</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual Check-in Modal */}
            {showManualCheckIn && (
                <ManualCheckInModal
                    slot={slot}
                    user={selectedUser}
                    onClose={() => { setShowManualCheckIn(false); setSelectedUser(null); }}
                />
            )}

            {/* Lock Slot Confirmation Modal */}
            <ConfirmModal
                show={lockModal}
                onClose={() => setLockModal(false)}
                onConfirm={handleLockSlot}
                title="Verrouiller le créneau"
                message="Verrouiller ce créneau ? Tous les stagiaires restants seront marqués absents. Cette action est irréversible."
                confirmText="Confirmer"
                cancelText="Annuler"
                variant="danger"
                processing={actionProcessing}
            />
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, color }) {
    const colors = {
        gray: 'bg-gray-50 text-gray-700',
        green: 'bg-green-50 text-green-700',
        yellow: 'bg-yellow-50 text-yellow-700',
        red: 'bg-red-50 text-red-700',
        blue: 'bg-blue-50 text-blue-700',
        purple: 'bg-purple-50 text-purple-700',
    };

    return (
        <div className={`rounded-lg p-4 ${colors[color]}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm opacity-75">{label}</p>
        </div>
    );
}

function SlotStateBanner({ state }) {
    const config = {
        scheduled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '🕐', message: 'Créneau planifié. Ouvrez-le pour commencer les pointages.' },
        open: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', message: 'Créneau ouvert. Les stagiaires peuvent pointer maintenant.' },
        closed: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏸️', message: 'Créneau fermé. Modifications manuelles uniquement.' },
        locked: { bg: 'bg-red-100', text: 'text-red-800', icon: '🔒', message: 'Créneau verrouillé. Aucune modification possible.' },
    };

    const c = config[state] || config.scheduled;

    return (
        <div className={`mb-6 p-4 rounded-lg ${c.bg} ${c.text} flex items-center gap-3`}>
            <span className="text-2xl">{c.icon}</span>
            <span className="font-medium">{c.message}</span>
        </div>
    );
}

function ManualCheckInModal({ slot, user, onClose }) {
    const { data, setData, post, processing } = useForm({
        user_id: user?.id || '',
        status: user?.status === 'not_checked_in' ? 'present' : user?.status || 'present',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('verifier.slot.manual-checkin', slot.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {user ? `Modifier : ${user.name}` : 'Pointage manuel'}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!user && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">ID utilisateur</label>
                                <input
                                    type="text"
                                    value={data.user_id}
                                    onChange={(e) => setData('user_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Statut</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="present">Présent</option>
                                <option value="late">Retard</option>
                                <option value="excused">Excusé</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Notes (optionnel)</label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={2}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
