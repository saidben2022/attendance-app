import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CohortCreate({ courses, daysOfWeek }) {
    const { data, setData, post, processing, errors } = useForm({
        course_id: courses[0]?.id || '',
        name: '',
        start_date: '',
        end_date: '',
        am_start: '08:00',
        am_end: '12:00',
        pm_start: '13:00',
        pm_end: '17:00',
        grace_period_minutes: 15,
        schedule_rules: daysOfWeek.map(day => ({
            day_of_week: day,
            has_am_slot: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day),
            has_pm_slot: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day),
        })),
    });

    const dayLabels = {
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche',
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.cohorts.store'));
    };

    const updateScheduleRule = (dayIndex, field, value) => {
        const newRules = [...data.schedule_rules];
        newRules[dayIndex] = { ...newRules[dayIndex], [field]: value };
        setData('schedule_rules', newRules);
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Link href={route('admin.cohorts.index')} className="text-sm text-gray-500 hover:text-gray-700">
                        ← Retour aux cohortes
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 mt-1">
                        Créer une cohorte
                    </h2>
                </div>
            }
        >
            <Head title="Créer une cohorte" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-medium text-gray-900">Informations générales</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Formation *</label>
                                        <select
                                            value={data.course_id}
                                            onChange={(e) => setData('course_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            {courses.map((course) => (
                                                <option key={course.id} value={course.id}>{course.name}</option>
                                            ))}
                                        </select>
                                        {errors.course_id && <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nom de la cohorte *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="ex: Printemps 2026"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date de début *</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date de fin *</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Session Times */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-medium text-gray-900">Horaires des sessions</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-700">Session du matin</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-600">Début</label>
                                                <input
                                                    type="time"
                                                    value={data.am_start}
                                                    onChange={(e) => setData('am_start', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600">Fin</label>
                                                <input
                                                    type="time"
                                                    value={data.am_end}
                                                    onChange={(e) => setData('am_end', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-700">Session de l'après-midi</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-600">Début</label>
                                                <input
                                                    type="time"
                                                    value={data.pm_start}
                                                    onChange={(e) => setData('pm_start', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600">Fin</label>
                                                <input
                                                    type="time"
                                                    value={data.pm_end}
                                                    onChange={(e) => setData('pm_end', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Période de grâce (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.grace_period_minutes}
                                        onChange={(e) => setData('grace_period_minutes', parseInt(e.target.value))}
                                        className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        min="0"
                                        max="60"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Temps après le début de la session pendant lequel les pointages sont marqués "en retard" au lieu de "absent"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Schedule */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-medium text-gray-900">Emploi du temps hebdomadaire</h3>
                                <p className="text-sm text-gray-500">Sélectionnez les jours avec sessions matin et après-midi</p>
                            </div>
                            <div className="p-6">
                                <div className="grid gap-3">
                                    {data.schedule_rules.map((rule, index) => (
                                        <div key={rule.day_of_week} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium w-32">{dayLabels[rule.day_of_week]}</span>
                                            <div className="flex gap-6">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={rule.has_am_slot}
                                                        onChange={(e) => updateScheduleRule(index, 'has_am_slot', e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Matin</span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={rule.has_pm_slot}
                                                        onChange={(e) => updateScheduleRule(index, 'has_pm_slot', e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Après-midi</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href={route('admin.cohorts.index')}
                                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Création...' : 'Créer et générer les sessions'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
