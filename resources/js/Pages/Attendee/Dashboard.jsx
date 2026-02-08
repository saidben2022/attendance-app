import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AttendeeDashboard({ todaySessions, recentCheckIns, stats }) {
    const statusLabels = {
        present: 'Présent',
        late: 'Retard',
        absent: 'Absent',
        excused: 'Excusé',
        pending: 'En attente',
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'late': return 'bg-yellow-100 text-yellow-800';
            case 'absent': return 'bg-red-100 text-red-800';
            case 'excused': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getSlotStateColor = (state) => {
        switch (state) {
            case 'open': return 'bg-green-500';
            case 'closed': return 'bg-yellow-500';
            case 'locked': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Ma Présence
                </h2>
            }
        >
            <Head title="Ma Présence" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* QR Scanner Button */}
                    <Link
                        href={route('attendee.scan-qr')}
                        className="mb-6 flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-2xl hover:from-emerald-600 hover:to-cyan-600 transition shadow-lg shadow-emerald-500/20"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        📷 Scanner un QR Code
                    </Link>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
                            <p className="text-3xl font-bold">{stats.attendance_rate}%</p>
                            <p className="text-sm opacity-80">Taux de présence</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                            <p className="text-sm text-gray-500">Présent</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                            <p className="text-sm text-gray-500">Retard</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                            <p className="text-sm text-gray-500">Absent</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-2xl font-bold text-blue-600">{stats.excused}</p>
                            <p className="text-sm text-gray-500">Excusé</p>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Today's Sessions */}
                        <div className="lg:col-span-2">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Sessions du jour</h3>
                                </div>
                                {todaySessions.length > 0 ? (
                                    <div className="divide-y divide-gray-200">
                                        {todaySessions.map((session, index) => (
                                            <div key={index} className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{session.course_name}</h4>
                                                        <p className="text-sm text-gray-500">{session.cohort_name}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 grid grid-cols-2 gap-3">
                                                    {session.slots.map((slot) => (
                                                        <div 
                                                            key={slot.id}
                                                            className={`p-4 rounded-lg border-2 ${
                                                                slot.status === 'pending' && slot.state === 'open'
                                                                    ? 'border-green-400 bg-green-50'
                                                                    : slot.status !== 'pending'
                                                                    ? 'border-gray-200 bg-gray-50'
                                                                    : 'border-gray-200 bg-gray-50'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-medium text-gray-700">
                                                                    {slot.type === 'am' ? 'Matin' : 'Après-midi'}
                                                                </span>
                                                                <div className={`h-2 w-2 rounded-full ${getSlotStateColor(slot.state)}`} />
                                                            </div>
                                                            
                                                            {slot.status !== 'pending' ? (
                                                                <div>
                                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(slot.status)}`}>
                                                                        {statusLabels[slot.status] || slot.status}
                                                                    </span>
                                                                    {slot.checked_in_at && (
                                                                        <p className="text-xs text-gray-400 mt-1">à {slot.checked_in_at}</p>
                                                                    )}
                                                                </div>
                                                            ) : slot.state === 'open' ? (
                                                                <p className="text-sm text-green-600 font-medium">
                                                                    Scannez le QR pour pointer
                                                                </p>
                                                            ) : (
                                                                <p className="text-sm text-gray-400">
                                                                    {slot.state === 'scheduled' ? 'Pas encore ouvert' : 'Session fermée'}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">Aucune session aujourd'hui</h3>
                                        <p className="mt-2 text-gray-500">Vous n'avez pas de sessions programmées aujourd'hui.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Check-ins */}
                        <div>
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Pointages récents</h3>
                                    <Link 
                                        href={route('attendee.history')}
                                        className="text-sm text-indigo-600 hover:text-indigo-900"
                                    >
                                        Voir tout
                                    </Link>
                                </div>
                                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                                    {recentCheckIns.length > 0 ? (
                                        recentCheckIns.map((checkIn) => (
                                            <div key={checkIn.id} className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{checkIn.course_name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {checkIn.session_date} • {checkIn.slot_type === 'am' ? 'Matin' : 'Après-midi'}
                                                        </p>
                                                    </div>
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(checkIn.status)}`}>
                                                        {statusLabels[checkIn.status] || checkIn.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            Aucun pointage
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Help */}
                            <div className="mt-6 overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm sm:rounded-lg text-white">
                                <div className="p-6">
                                    <h3 className="font-medium mb-2">Comment pointer</h3>
                                    <ol className="text-sm space-y-2 opacity-90">
                                        <li className="flex items-start gap-2">
                                            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
                                            <span>Attendez que le QR code s'affiche sur le projecteur</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
                                            <span>Scannez le QR code avec l'appareil photo de votre téléphone</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs">3</span>
                                            <span>Entrez votre code PIN à 4 chiffres pour confirmer</span>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
