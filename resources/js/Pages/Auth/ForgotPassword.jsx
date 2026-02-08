import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Mot de passe oublié - AttendEase" />

            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white">Réinitialiser le mot de passe</h2>
            </div>

            <div className="mb-6 text-sm text-indigo-200">
                Mot de passe oublié ? Pas de problème. Entrez votre adresse email
                et nous vous enverrons un lien de réinitialisation.
            </div>

            {status && (
                <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm font-medium text-emerald-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500"
                        isFocused={true}
                        placeholder="vous@exemple.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                >
                    {processing ? 'Envoi en cours...' : 'Envoyer le lien'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <Link href={route('login')} className="text-emerald-400 hover:text-emerald-300 text-sm transition">
                    ← Retour à la connexion
                </Link>
            </div>
        </GuestLayout>
    );
}
