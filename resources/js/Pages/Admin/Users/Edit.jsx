import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/Context/ToastContext';
import ConfirmModal from '@/Components/ConfirmModal';

export default function UserEdit({ user, organizations, roles }) {
    const toast = useToast();
    const [deleteModal, setDeleteModal] = useState(false);
    const [pinModal, setPinModal] = useState(false);
    const [actionProcessing, setActionProcessing] = useState(false);

    const roleLabels = {
        admin: 'Administrateur',
        coordinator: 'Coordinateur',
        verifier: 'Vérificateur',
        instructor: 'Formateur',
        attendee: 'Stagiaire',
    };

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        organization_id: user.organization_id || '',
        role: user.roles?.[0]?.name || 'attendee',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id), {
            onSuccess: () => toast.success('Modifications enregistrées'),
        });
    };

    const handleDelete = () => {
        setActionProcessing(true);
        router.delete(route('admin.users.destroy', user.id), {
            onSuccess: () => toast.success('Utilisateur supprimé'),
            onFinish: () => {
                setActionProcessing(false);
                setDeleteModal(false);
            },
        });
    };

    const handleResetPin = () => {
        setActionProcessing(true);
        router.post(route('admin.users.reset-pin', user.id), {}, {
            onSuccess: () => {
                toast.success('PIN réinitialisé ✓');
                setPinModal(false);
            },
            onFinish: () => setActionProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Link href={route('admin.users.show', user.id)} className="text-sm text-gray-500 hover:text-gray-700">
                        ← Retour au profil
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 mt-1">
                        Modifier : {user.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Modifier ${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nom complet *</label>
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
                                        <label className="block text-sm font-medium text-gray-700">Email *</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-medium text-gray-900">Rôle et Organisation</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Organisation</label>
                                        <select
                                            value={data.organization_id}
                                            onChange={(e) => setData('organization_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Aucune organisation</option>
                                            {organizations.map((org) => (
                                                <option key={org.id} value={org.id}>{org.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Rôle *</label>
                                        <select
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            {roles.map((role) => (
                                                <option key={role} value={role}>{roleLabels[role] || role}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setPinModal(true)}
                                        className="rounded-md bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                                    >
                                        Réinitialiser le PIN
                                    </button>
                                    <p className="mt-1 text-sm text-gray-500">Générer un nouveau PIN à 4 chiffres pour la vérification du pointage</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-medium text-gray-900">Changer le mot de passe</h3>
                                <p className="text-sm text-gray-500">Laissez vide pour conserver le mot de passe actuel</p>
                            </div>
                            <div className="p-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
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
                                    href={route('admin.users.show', user.id)}
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
                title="Supprimer l'utilisateur"
                message={`Êtes-vous sûr de vouloir supprimer ${user.name} ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
                processing={actionProcessing}
            />

            {/* Reset PIN Confirmation Modal */}
            <ConfirmModal
                show={pinModal}
                onClose={() => setPinModal(false)}
                onConfirm={handleResetPin}
                title="Réinitialiser le PIN"
                message={`Générer un nouveau PIN à 4 chiffres pour ${user.name} ?`}
                confirmText="Confirmer"
                cancelText="Annuler"
                processing={actionProcessing}
            />
        </AuthenticatedLayout>
    );
}
