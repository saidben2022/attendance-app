import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function History({ checkIns }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'late': return 'bg-yellow-100 text-yellow-800';
            case 'absent': return 'bg-red-100 text-red-800';
            case 'excused': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const statusLabels = {
        present: 'Présent',
        late: 'Retard',
        absent: 'Absent',
        excused: 'Excusé',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={route('attendee.dashboard')} className="text-sm text-gray-500 hover:text-gray-700">
                            ← Retour au tableau de bord
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 mt-1">
                            Historique de présence
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Historique de présence" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Tous les pointages ({checkIns.total || checkIns.data?.length || 0})
                            </h3>
                        </div>
                        
                        {checkIns.data?.length > 0 ? (
                            <>
                                <div className="divide-y divide-gray-200">
                                    {checkIns.data.map((checkIn) => (
                                        <div key={checkIn.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${getStatusColor(checkIn.status)}`}>
                                                        {checkIn.slot?.type?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {checkIn.slot?.attendance_session?.cohort?.course?.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {checkIn.slot?.attendance_session?.cohort?.name} • {' '}
                                                            {new Date(checkIn.slot?.attendance_session?.session_date).toLocaleDateString('fr-FR', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(checkIn.status)}`}>
                                                        {statusLabels[checkIn.status] || checkIn.status}
                                                    </span>
                                                    {checkIn.checked_in_at && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {new Date(checkIn.checked_in_at).toLocaleTimeString('fr-FR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    )}
                                                    {checkIn.is_manual_entry && (
                                                        <p className="text-xs text-gray-400 italic">saisie manuelle</p>
                                                    )}
                                                </div>
                                            </div>
                                            {checkIn.notes && (
                                                <p className="mt-2 text-sm text-gray-500 bg-gray-50 rounded p-2">
                                                    Note : {checkIn.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {checkIns.last_page > 1 && (
                                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            Affichage de {checkIns.from} à {checkIns.to} sur {checkIns.total}
                                        </p>
                                        <div className="flex gap-2">
                                            {checkIns.prev_page_url && (
                                                <Link
                                                    href={checkIns.prev_page_url}
                                                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                                                >
                                                    Précédent
                                                </Link>
                                            )}
                                            {checkIns.next_page_url && (
                                                <Link
                                                    href={checkIns.next_page_url}
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
                                <h3 className="text-lg font-medium text-gray-900">Aucun pointage</h3>
                                <p className="mt-2 text-gray-500">Votre historique de présence apparaîtra ici une fois que vous commencerez à pointer.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
