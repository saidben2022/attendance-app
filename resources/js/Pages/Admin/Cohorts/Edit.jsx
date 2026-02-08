import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/Context/ToastContext';
import ConfirmModal from '@/Components/ConfirmModal';

export default function CohortEdit({ cohort, courses, daysOfWeek }) {
    const toast = useToast();
    const [deleteModal, setDeleteModal] = useState(false);
    const [actionProcessing, setActionProcessing] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: cohort.name || '',
        start_date: cohort.start_date?.split('T')[0] || '',
        end_date: cohort.end_date?.split('T')[0] || '',
        am_start: cohort.am_start || '08:00',
        am_end: cohort.am_end || '12:00',
        pm_start: cohort.pm_start || '13:00',
        pm_end: cohort.pm_end || '17:00',
        grace_period_minutes: cohort.grace_period_minutes || 15,
        is_active: cohort.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.cohorts.update', cohort.id), {
            onSuccess: () => toast.success('Modifications enregistrées'),
        });
    };

    const handleDelete = () => {
        setActionProcessing(true);
        router.delete(route('admin.cohorts.destroy', cohort.id), {
            onSuccess: () => toast.success('Cohorte supprimée'),
            onFinish: () => {
                setActionProcessing(false);
                setDeleteModal(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Link href={route('admin.cohorts.show', cohort.id)} className="text-sm text-gray-500 hover:text-gray-700">
                        ← Retour à la cohorte
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 mt-1">
                        Modifier : {cohort.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Modifier ${cohort.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-medium text-gray-900">Détails de la cohorte</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Formation</label>
                                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{cohort.course?.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">La formation ne peut pas être modifiée après création</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nom de la cohorte *</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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

                                <div className="grid gap-6 md:grid-cols-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Matin début</label>
                                        <input
                                            type="time"
                                            value={data.am_start}
                                            onChange={(e) => setData('am_start', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Matin fin</label>
                                        <input
                                            type="time"
                                            value={data.am_end}
                                            onChange={(e) => setData('am_end', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Après-midi début</label>
                                        <input
                                            type="time"
                                            value={data.pm_start}
                                            onChange={(e) => setData('pm_start', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Après-midi fin</label>
                                        <input
                                            type="time"
                                            value={data.pm_end}
                                            onChange={(e) => setData('pm_end', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Période de grâce (minutes)</label>
                                    <input
                                        type="number"
                                        value={data.grace_period_minutes}
                                        onChange={(e) => setData('grace_period_minutes', parseInt(e.target.value))}
                                        className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        min="0"
                                        max="60"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">Active</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => setDeleteModal(true)}
                                className="rounded-md bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                            >
                                Supprimer
                            </button>
                            <div className="flex gap-4">
                                <Link
                                    href={route('admin.cohorts.show', cohort.id)}
                                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                                >
                                    Annuler
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    {processing ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                show={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                title="Supprimer la cohorte"
                message={`Êtes-vous sûr de vouloir supprimer "${cohort.name}" ? Cela supprimera également toutes les sessions et données de pointage.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
                processing={actionProcessing}
            />
        </AuthenticatedLayout>
    );
}
