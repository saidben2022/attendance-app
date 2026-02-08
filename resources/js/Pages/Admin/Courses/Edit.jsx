import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/Context/ToastContext';
import ConfirmModal from '@/Components/ConfirmModal';

export default function CourseEdit({ course, organizations }) {
    const toast = useToast();
    const [deleteModal, setDeleteModal] = useState(false);
    const [actionProcessing, setActionProcessing] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        organization_id: course.organization_id || '',
        name: course.name || '',
        code: course.code || '',
        description: course.description || '',
        is_active: course.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.courses.update', course.id), {
            onSuccess: () => toast.success('Modifications enregistrées'),
        });
    };

    const handleDelete = () => {
        setActionProcessing(true);
        router.delete(route('admin.courses.destroy', course.id), {
            onSuccess: () => toast.success('Formation supprimée'),
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
                    <Link 
                        href={route('admin.courses.show', course.id)} 
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Retour à la formation
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 mt-1">
                        Modifier : {course.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Modifier ${course.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Organisation
                                </label>
                                <select
                                    value={data.organization_id}
                                    onChange={(e) => setData('organization_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.organization_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.organization_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nom de la formation *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Code de la formation
                                </label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="ex: FORM101"
                                />
                                {errors.code && (
                                    <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label className="ml-2 block text-sm text-gray-900">
                                    Active
                                </label>
                            </div>

                            <div className="flex justify-between pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setDeleteModal(true)}
                                    className="rounded-md bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                                >
                                    Supprimer
                                </button>
                                <div className="flex gap-4">
                                    <Link
                                        href={route('admin.courses.show', course.id)}
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
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                show={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                title="Supprimer la formation"
                message={`Êtes-vous sûr de vouloir supprimer "${course.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
                processing={actionProcessing}
            />
        </AuthenticatedLayout>
    );
}
