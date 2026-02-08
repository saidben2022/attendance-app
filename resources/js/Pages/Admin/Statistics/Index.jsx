import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function StatisticsIndex({
    overallStats,
    attendanceByStatus,
    dailyTrend,
    cohortComparison,
    topPerformers,
    atRiskStudents,
    courses,
    cohorts,
    filters,
}) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
    };

    const applyFilters = () => {
        router.get(route('admin.statistics.index'), localFilters, { preserveState: true });
    };

    const filteredCohorts = localFilters.course_id
        ? cohorts.filter(c => c.course_id == localFilters.course_id)
        : cohorts;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Statistiques
                    </h2>
                </div>
            }
        >
            <Head title="Statistiques" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                            <div className="flex items-end">
                                <button
                                    onClick={applyFilters}
                                    className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-indigo-600 hover:to-purple-700 transition shadow-lg"
                                >
                                    Appliquer
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Overall Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <StatCard
                            label="Taux de présence"
                            value={`${overallStats.attendance_rate}%`}
                            gradient="from-emerald-500 to-teal-600"
                            icon={
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Total pointages"
                            value={overallStats.total_check_ins}
                            gradient="from-blue-500 to-indigo-600"
                            icon={
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Étudiants actifs"
                            value={overallStats.active_students}
                            gradient="from-purple-500 to-pink-600"
                            icon={
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Cohortes actives"
                            value={overallStats.active_cohorts}
                            gradient="from-orange-500 to-amber-600"
                            icon={
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            }
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Attendance by Status - Pie Chart */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par statut</h3>
                            <div className="flex items-center justify-center">
                                <div className="relative w-48 h-48">
                                    <PieChart data={attendanceByStatus} />
                                </div>
                                <div className="ml-6 space-y-2">
                                    {attendanceByStatus.map((item) => (
                                        <div key={item.name} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Daily Trend - Bar Chart */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendance quotidienne</h3>
                            {dailyTrend.length > 0 ? (
                                <div className="h-48 overflow-x-auto">
                                    <BarChart data={dailyTrend} />
                                </div>
                            ) : (
                                <div className="h-48 flex items-center justify-center text-gray-500">
                                    Aucune donnée pour cette période
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cohort Comparison */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparaison cohortes</h3>
                            <div className="space-y-3">
                                {cohortComparison.map((cohort) => (
                                    <div key={cohort.name} className="p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-gray-900 text-sm">{cohort.name}</span>
                                            <span className="text-sm font-semibold text-emerald-600">{cohort.attendance_rate}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                                                style={{ width: `${cohort.attendance_rate}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{cohort.students} étudiants</span>
                                    </div>
                                ))}
                                {cohortComparison.length === 0 && (
                                    <p className="text-gray-500 text-sm text-center py-4">Aucune cohorte active</p>
                                )}
                            </div>
                        </div>

                        {/* Top Performers */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Meilleurs élèves</h3>
                            <div className="space-y-3">
                                {topPerformers.map((student, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                                {index + 1}
                                            </span>
                                            <span className="font-medium text-gray-900 text-sm">{student.name}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-emerald-600">{student.attendance_rate}%</span>
                                    </div>
                                ))}
                                {topPerformers.length === 0 && (
                                    <p className="text-gray-500 text-sm text-center py-4">Pas assez de données</p>
                                )}
                            </div>
                        </div>

                        {/* At Risk Students */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Élèves à risque</h3>
                            <div className="space-y-3">
                                {atRiskStudents.map((student, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
                                        <div>
                                            <span className="font-medium text-gray-900 text-sm">{student.name}</span>
                                            <p className="text-xs text-gray-500">{student.absences} absences</p>
                                        </div>
                                        <span className="text-sm font-semibold text-red-600">{student.attendance_rate}%</span>
                                    </div>
                                ))}
                                {atRiskStudents.length === 0 && (
                                    <p className="text-gray-500 text-sm text-center py-4">Aucun élève à risque</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, gradient, icon }) {
    return (
        <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-80">{label}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-xl">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function PieChart({ data }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                Aucune donnée
            </div>
        );
    }

    let cumulativePercent = 0;
    const arcs = data.map((item) => {
        const percent = (item.value / total) * 100;
        const startPercent = cumulativePercent;
        cumulativePercent += percent;
        return { ...item, percent, startPercent };
    });

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {arcs.map((arc, index) => {
                const circumference = 2 * Math.PI * 40;
                const offset = (arc.startPercent / 100) * circumference;
                const length = (arc.percent / 100) * circumference;
                return (
                    <circle
                        key={index}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={arc.color}
                        strokeWidth="20"
                        strokeDasharray={`${length} ${circumference - length}`}
                        strokeDashoffset={-offset}
                    />
                );
            })}
        </svg>
    );
}

function BarChart({ data }) {
    const maxValue = Math.max(...data.map(d => d.present + d.late + d.absent), 1);

    return (
        <div className="flex items-end gap-1 h-full min-w-max">
            {data.map((day, index) => {
                const total = day.present + day.late + day.absent;
                const heightPercent = (total / maxValue) * 100;
                return (
                    <div key={index} className="flex flex-col items-center">
                        <div
                            className="w-8 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg"
                            style={{ height: `${heightPercent}%`, minHeight: total > 0 ? '10px' : '0' }}
                            title={`${day.date}: ${total} pointages`}
                        />
                        <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-left">
                            {day.date.slice(5)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
