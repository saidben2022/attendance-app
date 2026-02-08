import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Settings({ organization, stats }) {
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        name: organization?.name || '',
        address: organization?.address || '',
        phone: organization?.phone || '',
        email: organization?.email || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.settings.organization'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Paramètres
                </h2>
            }
        >
            <Head title="Paramètres" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* System Stats */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">Vue d'ensemble</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard label="Utilisateurs" value={stats.total_users} icon="👥" />
                                <StatCard label="Formations" value={stats.total_courses} icon="📚" />
                                <StatCard label="Cohortes actives" value={stats.active_cohorts} icon="🎓" />
                                <StatCard label="Total pointages" value={stats.total_checkins} icon="✅" />
                            </div>
                        </div>
                    </div>

                    {/* Organization Settings */}
                    {organization && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-medium text-gray-900">Paramètres de l'organisation</h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nom de l'organisation</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Adresse</label>
                                    <textarea
                                        value={data.address || ''}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={2}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                        <input
                                            type="text"
                                            value={data.phone || ''}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={data.email || ''}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                    {recentlySuccessful && (
                                        <span className="text-sm text-green-600">Enregistré !</span>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Quick Links */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">Actions rapides</h3>
                        </div>
                        <div className="p-6 grid gap-4 sm:grid-cols-2">
                            <QuickAction
                                title="Gérer les utilisateurs"
                                description="Ajouter, modifier ou supprimer des comptes"
                                href={route('admin.users.index')}
                                icon="👤"
                            />
                            <QuickAction
                                title="Gérer les formations"
                                description="Configurer les formations et paramètres"
                                href={route('admin.courses.index')}
                                icon="📖"
                            />
                            <QuickAction
                                title="Gérer les cohortes"
                                description="Voir et modifier les emplois du temps"
                                href={route('admin.cohorts.index')}
                                icon="📅"
                            />
                            <QuickAction
                                title="Sessions du jour"
                                description="Suivre les sessions de présence du jour"
                                href={route('verifier.today')}
                                icon="📋"
                            />
                        </div>
                    </div>

                    {/* About */}
                    <div className="overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm sm:rounded-lg text-white">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">AttendEase</h3>
                                    <p className="text-sm opacity-80">Système de gestion des présences</p>
                                </div>
                            </div>
                            <p className="text-sm opacity-90">
                                Un système moderne de suivi des présences conçu pour les organismes de formation. 
                                Pointage par QR code, vérification par PIN, et rapports complets.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{icon}</span>
                <span className="text-2xl font-bold text-gray-900">{value}</span>
            </div>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    );
}

function QuickAction({ title, description, href, icon }) {
    return (
        <a
            href={href}
            className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition"
        >
            <span className="text-2xl">{icon}</span>
            <div>
                <h4 className="font-medium text-gray-900">{title}</h4>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </a>
    );
}
