import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Vérifier l'email - AttendEase" />

            <div className="text-center mb-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Vérifiez votre email</h2>
            </div>

            <div className="mb-6 text-sm text-indigo-200 text-center">
                Merci pour votre inscription ! Avant de commencer, veuillez vérifier
                votre adresse email en cliquant sur le lien que nous venons de vous envoyer.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm font-medium text-emerald-300 text-center">
                    Un nouveau lien de vérification a été envoyé à votre adresse email.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                >
                    {processing ? 'Envoi en cours...' : 'Renvoyer l\'email de vérification'}
                </button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full py-3 px-4 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition text-center"
                >
                    Se déconnecter
                </Link>
            </form>
        </GuestLayout>
    );
}
