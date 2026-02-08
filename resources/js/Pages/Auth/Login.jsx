import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Connexion - AttendEase" />
            
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center px-4">
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
                        <h1 className="mt-6 text-2xl font-bold text-white">Bienvenue</h1>
                        <p className="mt-2 text-indigo-200">Connectez-vous à votre compte</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
                        {status && (
                            <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm font-medium text-emerald-300">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email" className="text-white" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500"
                                    autoComplete="username"
                                    isFocused={true}
                                    placeholder="vous@exemple.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Mot de passe" className="text-white" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="bg-white/10 border-white/30"
                                    />
                                    <span className="ms-2 text-sm text-indigo-200">Se souvenir de moi</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-emerald-400 hover:text-emerald-300 transition"
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Connexion...
                                    </span>
                                ) : 'Se connecter'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-indigo-200">
                                Pas encore de compte ?{' '}
                                <Link href={route('register')} className="text-emerald-400 hover:text-emerald-300 font-medium transition">
                                    Créer un compte
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Back to home */}
                    <div className="mt-8 text-center">
                        <Link href="/" className="text-indigo-300 hover:text-white text-sm transition">
                            ← Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
