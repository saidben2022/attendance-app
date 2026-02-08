import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/Context/ToastContext';

export default function TodaySessions({ sessions }) {
    const toast = useToast();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        router.reload({
            onSuccess: () => {
                toast.success('Actualisé');
            },
            onFinish: () => setRefreshing(false),
        });
    };

    const getStateColor = (state) => {
        switch (state) {
            case 'scheduled': return 'bg-gray-100 text-gray-700';
            case 'open': return 'bg-green-100 text-green-700';
            case 'closed': return 'bg-yellow-100 text-yellow-700';
            case 'locked': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
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
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Sessions du jour
                    </h2>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500 disabled:opacity-50"
                    >
                        {refreshing ? 'Actualisation...' : 'Actualiser'}
                    </button>
                </div>
            }
        >
            <Head title="Sessions du jour" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {sessions?.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {sessions.map((session) => (
                                <div key={session.id} className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {session.cohort_name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{session.course_name}</p>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {session.slots && session.slots.length > 0 ? (
                                                session.slots.map((slot) => (
                                                    <SlotRow 
                                                        key={slot.id}
                                                        slot={slot} 
                                                        type={slot.type === 'am' ? 'Matin' : 'Après-midi'} 
                                                        stateColor={getStateColor(slot.state)}
                                                        stateLabel={stateLabels[slot.state]}
                                                    />
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-sm">Aucun créneau disponible</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-12 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune session aujourd'hui</h3>
                                <p className="mt-2 text-gray-500">Revenez plus tard ou contactez un administrateur.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SlotRow({ slot, type, stateColor, stateLabel }) {
    return (
        <Link 
            href={route('verifier.slot', slot.id)} 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
            <div>
                <div className="font-medium text-gray-900">{type}</div>
                <div className="text-sm text-gray-500">{slot.check_in_count || 0} pointages</div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${stateColor}`}>
                    {stateLabel}
                </span>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
}

