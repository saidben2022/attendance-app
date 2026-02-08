import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, todaySessions, recentActivity, userRole }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Tableau de bord
                    </h2>
                    {['admin', 'coordinator'].includes(userRole) && (
                        <div className="flex gap-3">
                            <Link
                                href={route('admin.courses.index')}
                                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-600 hover:to-purple-700 transition shadow-lg shadow-indigo-500/25"
                            >
                                Formations
                            </Link>
                            <Link
                                href={route('admin.users.index')}
                                className="rounded-xl bg-white/80 backdrop-blur border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white hover:shadow-sm transition"
                            >
                                Utilisateurs
                            </Link>
                        </div>
                    )}
                </div>
            }
        >
            <Head title="Tableau de bord" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Object.entries(stats).map(([key, value]) => (
                            <StatCard key={key} statKey={key} value={value} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Today's Sessions */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl shadow-gray-200/50 overflow-hidden">
                            <div className="border-b border-gray-100 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Sessions du jour
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6">
                                {todaySessions?.length > 0 ? (
                                    <ul className="space-y-4">
                                        {todaySessions.map((session) => {
                                            // Only allow verifier, admin, coordinator, instructor to click sessions
                                            const canAccessSlot = ['admin', 'coordinator', 'verifier', 'instructor'].includes(userRole);
                                            const slotId = session.am_slot?.id || session.pm_slot?.id;
                                            const isClickable = canAccessSlot && slotId;
                                            const SessionWrapper = isClickable ? Link : 'div';
                                            const wrapperProps = isClickable 
                                                ? { href: route('verifier.slot', slotId) }
                                                : {};
                                            
                                            return (
                                                <li key={session.id}>
                                                    <SessionWrapper 
                                                        {...wrapperProps}
                                                        className={`block p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition ${isClickable ? 'cursor-pointer' : ''}`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-semibold text-gray-900">
                                                                    {session.cohort_name}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {session.course_name}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {session.am_slot && (
                                                                    <SlotBadge type="Matin" state={session.am_slot.state} />
                                                                )}
                                                                {session.pm_slot && (
                                                                    <SlotBadge type="Après-midi" state={session.pm_slot.state} />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </SessionWrapper>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="h-12 w-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">Aucune session aujourd'hui</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl shadow-gray-200/50 overflow-hidden">
                            <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Pointages récents
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6">
                                {recentActivity?.length > 0 ? (
                                    <ul className="space-y-3">
                                        {recentActivity.map((event) => (
                                            <li key={event.id} className="p-3 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                                                            <span className="text-xs font-bold text-white">
                                                                {event.user_name?.charAt(0)?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {event.user_name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {event.cohort_name} - {event.slot_type === 'am' ? 'Matin' : 'Après-midi'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <StatusBadge status={event.status} />
                                                        <span className="text-xs text-gray-400">
                                                            {event.checked_in_at}
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="h-12 w-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">Aucun pointage récent</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ statKey, value }) {
    const config = {
        total_users: {
            label: 'Utilisateurs',
            gradient: 'from-blue-500 to-indigo-600',
            bgGradient: 'from-blue-500/10 to-indigo-500/10',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        active_cohorts: {
            label: 'Cohortes actives',
            gradient: 'from-emerald-500 to-teal-600',
            bgGradient: 'from-emerald-500/10 to-teal-500/10',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        today_sessions: {
            label: 'Sessions du jour',
            gradient: 'from-orange-500 to-amber-600',
            bgGradient: 'from-orange-500/10 to-amber-500/10',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
        check_ins_today: {
            label: 'Pointages aujourd\'hui',
            gradient: 'from-purple-500 to-pink-600',
            bgGradient: 'from-purple-500/10 to-pink-500/10',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        attendance_rate: {
            label: 'Taux de présence',
            gradient: 'from-cyan-500 to-blue-600',
            bgGradient: 'from-cyan-500/10 to-blue-500/10',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        my_enrollments: {
            label: 'Mes inscriptions',
            gradient: 'from-indigo-500 to-purple-600',
            bgGradient: 'from-indigo-500/10 to-purple-500/10',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        total_courses: {
            label: 'Formations actives',
            gradient: 'from-violet-500 to-purple-600',
            bgGradient: 'from-violet-500/10 to-purple-500/10',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        total_enrollments: {
            label: 'Inscriptions actives',
            gradient: 'from-rose-500 to-pink-600',
            bgGradient: 'from-rose-500/10 to-pink-500/10',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        my_cohorts: {
            label: 'Mes cohortes',
            gradient: 'from-teal-500 to-cyan-600',
            bgGradient: 'from-teal-500/10 to-cyan-500/10',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        total_check_ins: {
            label: 'Total pointages',
            gradient: 'from-emerald-500 to-teal-600',
            bgGradient: 'from-emerald-500/10 to-teal-500/10',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        open_slots: {
            label: 'Créneaux ouverts',
            gradient: 'from-green-500 to-emerald-600',
            bgGradient: 'from-green-500/10 to-emerald-500/10',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        pending_check_ins: {
            label: 'Pointages en attente',
            gradient: 'from-amber-500 to-orange-600',
            bgGradient: 'from-amber-500/10 to-orange-500/10',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    };

    const cfg = config[statKey] || {
        label: statKey.replace(/_/g, ' '),
        gradient: 'from-gray-500 to-gray-600',
        bgGradient: 'from-gray-500/10 to-gray-500/10',
        icon: null,
    };
    
    const isRate = statKey.includes('rate');

    return (
        <div className={`overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.bgGradient} backdrop-blur-sm border border-white/50 shadow-xl shadow-gray-200/30`}>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <dt className="text-sm font-medium text-gray-600">{cfg.label}</dt>
                        <dd className="mt-2 text-3xl font-bold text-gray-900">
                            {isRate ? `${value}%` : value}
                        </dd>
                    </div>
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-lg`}>
                        {cfg.icon}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SlotBadge({ type, state }) {
    const stateColors = {
        scheduled: 'bg-gray-100 text-gray-700 border-gray-200',
        open: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        closed: 'bg-amber-100 text-amber-700 border-amber-200',
        locked: 'bg-red-100 text-red-700 border-red-200',
    };

    const stateLabels = {
        scheduled: 'Planifié',
        open: 'Ouvert',
        closed: 'Fermé',
        locked: 'Verrouillé',
    };

    return (
        <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${stateColors[state] || stateColors.scheduled}`}>
            {type}: {stateLabels[state] || state}
        </span>
    );
}

function StatusBadge({ status }) {
    const statusColors = {
        present: 'bg-emerald-100 text-emerald-700',
        late: 'bg-amber-100 text-amber-700',
        absent: 'bg-red-100 text-red-700',
        excused: 'bg-blue-100 text-blue-700',
    };

    const statusLabels = {
        present: 'Présent',
        late: 'Retard',
        absent: 'Absent',
        excused: 'Excusé',
    };

    return (
        <span className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
            {statusLabels[status] || status}
        </span>
    );
}
