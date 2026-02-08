import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function UserCreate({ organizations, roles }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        organization_id: organizations[0]?.id || '',
        role: 'attendee',
        pin: '',
    });

    const roleLabels = {
        admin: 'Administrateur',
        coordinator: 'Coordinateur',
        verifier: 'Vérificateur',
        instructor: 'Formateur',
        attendee: 'Stagiaire',
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    const generatePin = () => {
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        setData('pin', pin);
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Link href={route('admin.users.index')} className="text-sm text-gray-500 hover:text-gray-700">
                        ← Retour aux utilisateurs
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 mt-1">
                        Créer un utilisateur
                    </h2>
                </div>
            }
        >
            <Head title="Créer un utilisateur" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-medium text-gray-900">Informations utilisateur</h3>
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

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mot de passe *</label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe *</label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
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
                                    <label className="block text-sm font-medium text-gray-700">PIN de pointage</label>
                                    <div className="mt-1 flex gap-2">
                                        <input
                                            type="text"
                                            value={data.pin}
                                            onChange={(e) => setData('pin', e.target.value)}
                                            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="4 chiffres"
                                            maxLength={4}
                                        />
                                        <button
                                            type="button"
                                            onClick={generatePin}
                                            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                        >
                                            Générer
                                        </button>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Utilisé pour la vérification lors du pointage par QR code</p>
                                    {errors.pin && <p className="mt-1 text-sm text-red-600">{errors.pin}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link
                                href={route('admin.users.index')}
                                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Création...' : 'Créer l\'utilisateur'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
