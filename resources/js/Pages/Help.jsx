import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Help() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Aide & Guide
                </h2>
            }
        >
            <Head title="Aide" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Quick Start */}
                    <div className="overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm sm:rounded-lg text-white">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-4">
                                🎯 Guide Rapide
                            </h3>
                            <p className="opacity-90">
                                Bienvenue dans AttendEase ! Voici comment utiliser le système selon votre rôle.
                            </p>
                        </div>
                    </div>

                    {/* Admin/Coordinator Guide */}
                    <RoleSection
                        role="Administrateur / Coordinateur"
                        icon="👔"
                        items={[
                            { title: 'Formations', desc: 'Créez des formations (ex: "Développement Web"). Chaque formation peut avoir plusieurs cohortes.', link: '/admin/courses' },
                            { title: 'Cohortes', desc: 'Créez des groupes d\'apprenants avec dates et horaires. Les sessions sont générées automatiquement selon le planning.', link: '/admin/cohorts' },
                            { title: 'Utilisateurs', desc: 'Gérez les comptes. Assignez les rôles: admin, coordinateur, vérificateur, formateur, stagiaire.', link: '/admin/users' },
                            { title: 'Paramètres', desc: 'Configurez votre organisation et consultez les statistiques globales.', link: '/admin/settings' },
                        ]}
                    />

                    {/* Verifier/Instructor Guide */}
                    <RoleSection
                        role="Vérificateur / Formateur"
                        icon="📋"
                        items={[
                            { title: 'Sessions du Jour', desc: 'Cliquez sur "Sessions" dans le menu pour voir les sessions d\'aujourd\'hui et gérer les créneaux.', link: '/verifier/today' },
                            { title: 'Ouvrir un Créneau', desc: 'Cliquez sur une session puis "Ouvrir le créneau". Les stagiaires pourront alors pointer.' },
                            { title: 'Afficher le QR', desc: 'Utilisez le bouton "QR Plein écran" pour projeter le code QR. Les stagiaires le scannent avec leur téléphone.' },
                            { title: 'Pointage Manuel', desc: 'Si un stagiaire ne peut pas scanner, utilisez le pointage manuel dans le panneau du créneau.' },
                            { title: 'Fermer & Verrouiller', desc: 'Fermez le créneau quand terminé, puis verrouillez pour finaliser les présences.' },
                        ]}
                    />

                    {/* Attendee Guide */}
                    <RoleSection
                        role="Stagiaire"
                        icon="🎓"
                        items={[
                            { title: 'Ma Présence', desc: 'Consultez vos sessions du jour et votre historique de présence.', link: '/attendee/dashboard' },
                            { title: 'Pointer', desc: '1. Scannez le QR code affiché dans la salle avec votre téléphone' },
                            { title: 'Saisir le PIN', desc: '2. Entrez votre code PIN à 4 chiffres pour confirmer votre identité' },
                            { title: 'Confirmation', desc: '3. Vous verrez un message de confirmation: Présent (vert) ou En retard (orange)' },
                            { title: 'Historique', desc: 'Consultez tout votre historique de présence dans "Mon Historique"', link: '/attendee/history' },
                        ]}
                    />

                    {/* Need Help */}
                    <div className="overflow-hidden bg-yellow-50 border border-yellow-200 shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-yellow-800 flex items-center gap-2">
                                💡 Besoin d'aide ?
                            </h3>
                            <p className="mt-2 text-yellow-700">
                                Si vous rencontrez un problème ou avez oublié votre PIN, contactez votre formateur ou coordinateur.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function RoleSection({ role, icon, items }) {
    return (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    {icon} {role}
                </h3>
            </div>
            <div className="divide-y divide-gray-100">
                {items.map((item, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-medium text-gray-900">{item.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                            </div>
                            {item.link && (
                                <a
                                    href={item.link}
                                    className="ml-4 text-sm text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
                                >
                                    →
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
