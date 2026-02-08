import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Inscription - AttendEase" />
            
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center px-4 py-12">
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
                        <h1 className="mt-6 text-2xl font-bold text-white">Créer votre compte</h1>
                        <p className="mt-2 text-indigo-200">Rejoignez le système de gestion des présences</p>
                    </div>

                    {/* Register Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="name" value="Nom complet" className="text-white" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-2 block w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500"
                                    autoComplete="name"
                                    isFocused={true}
                                    placeholder="Jean Dupont"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" className="text-white" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500"
                                    autoComplete="username"
                                    placeholder="vous@exemple.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Téléphone (optionnel)" className="text-white" />
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={data.phone}
                                    className="mt-2 block w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500"
                                    autoComplete="tel"
                                    placeholder="+33 6 12 34 56 78"
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Mot de passe" className="text-white" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" className="text-white" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-2 block w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
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
                                        Création en cours...
                                    </span>
                                ) : 'Créer le compte'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-indigo-200">
                                Vous avez déjà un compte ?{' '}
                                <Link href={route('login')} className="text-emerald-400 hover:text-emerald-300 font-medium transition">
                                    Se connecter
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
