import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white">AttendEase</span>
                    </Link>
                </div>

                {/* Content Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
                    {children}
                </div>

                {/* Back to home */}
                <div className="mt-8 text-center">
                    <Link href="/" className="text-indigo-300 hover:text-white text-sm transition">
                    ← Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
