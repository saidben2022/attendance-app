import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Réinitialiser le mot de passe - AttendEase" />

            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white">Nouveau mot de passe</h2>
                <p className="mt-2 text-indigo-200 text-sm">Choisissez un mot de passe sécurisé pour votre compte</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full bg-white/10 border-white/20 text-white/60"
                        autoComplete="username"
                        disabled
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">Nouveau mot de passe</label>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">Confirmer le mot de passe</label>
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                >
                    {processing ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                </button>
            </form>
        </GuestLayout>
    );
}
