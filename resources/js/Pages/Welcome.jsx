import { Head, Link } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister }) {
    return (
        <>
            <Head title="Bienvenue - Gestion des Présences" />
            
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-white">AttendEase</span>
                            </div>
                            
                            {canLogin && (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-sm font-medium text-white hover:text-emerald-300 transition"
                                    >
                                        Connexion
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition shadow-lg shadow-emerald-500/25"
                                        >
                                            Commencer
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                                    Suivi des Présences
                                    <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                        Rapide et Précis
                                    </span>
                                </h1>
                                <p className="mt-6 text-lg text-indigo-200 max-w-xl mx-auto lg:mx-0">
                                    Gérez facilement les présences pour les formations et événements de votre association. 
                                    Pointage par QR code, suivi en temps réel et rapports complets — tout en un seul endroit.
                                </p>
                                
                                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition shadow-xl shadow-emerald-500/30 text-lg"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Se connecter
                                        </Link>
                                    )}
                                    <a
                                        href="#features"
                                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition text-lg"
                                    >
                                        En savoir plus
                                    </a>
                                </div>
                            </div>
                            
                            {/* Hero Illustration */}
                            <div className="relative hidden lg:block">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
                                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                                    <div className="space-y-4">
                                        {/* Mock attendance card */}
                                        <div className="bg-white rounded-xl p-4 shadow-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Développement Web 101</h3>
                                                    <p className="text-sm text-gray-500">Session du Lundi Matin</p>
                                                </div>
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">Ouvert</span>
                                            </div>
                                            <div className="mt-4 flex items-center gap-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-emerald-600">24</div>
                                                    <div className="text-xs text-gray-500">Présents</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-yellow-600">3</div>
                                                    <div className="text-xs text-gray-500">Retards</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-red-600">1</div>
                                                    <div className="text-xs text-gray-500">Absents</div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* QR Badge */}
                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center">
                                                    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Scanner pour Pointer</p>
                                                    <p className="text-sm text-indigo-200">QR codes rapides et sécurisés</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-20 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900">Tout ce dont vous avez besoin</h2>
                            <p className="mt-4 text-lg text-gray-600">Des fonctionnalités puissantes conçues pour les associations et établissements de formation</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                }
                                title="Pointage par QR Code"
                                description="Les participants scannent un QR code et confirment avec leur PIN. Rapide, sécurisé et fonctionne sur tous les appareils."
                            />
                            <FeatureCard
                                icon={
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                }
                                title="Statistiques en Temps Réel"
                                description="Suivez les taux de présence, identifiez les tendances et générez des rapports instantanément."
                            />
                            <FeatureCard
                                icon={
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                }
                                title="Accès par Rôle"
                                description="Admins, coordinateurs, vérificateurs, formateurs et stagiaires — chacun avec ses propres permissions."
                            />
                            <FeatureCard
                                icon={
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                }
                                title="Planning Flexible"
                                description="Définissez les sessions matin/après-midi, les délais de tolérance, gérez les jours fériés et exceptions facilement."
                            />
                            <FeatureCard
                                icon={
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                }
                                title="Historique Complet"
                                description="Chaque modification manuelle est enregistrée. Transparence et traçabilité totales."
                            />
                            <FeatureCard
                                icon={
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                }
                                title="Interface en Français"
                                description="Interface entièrement en français pour une expérience utilisateur optimale."
                            />
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-20 bg-gradient-to-r from-emerald-600 to-cyan-600">
                    <div className="mx-auto max-w-4xl px-4 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Prêt à simplifier votre gestion des présences ?</h2>
                        <p className="text-lg text-emerald-100 mb-10">Rejoignez les associations qui utilisent déjà AttendEase pour gérer efficacement leurs formations.</p>
                        {canLogin && (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-xl text-lg"
                            >
                                Commencer maintenant
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 py-12">
                    <div className="mx-auto max-w-7xl px-4 text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white">AttendEase</span>
                        </div>
                        <p className="text-gray-500">© 2026 Système de Gestion des Présences. Fait avec ❤️</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition group">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}
