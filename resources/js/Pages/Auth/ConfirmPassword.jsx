import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirmer le mot de passe - AttendEase" />

            <div className="text-center mb-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Confirmer le mot de passe</h2>
            </div>

            <div className="mb-6 text-sm text-indigo-200 text-center">
                Ceci est une zone sécurisée de l'application. Veuillez confirmer
                votre mot de passe avant de continuer.
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500"
                        isFocused={true}
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                >
                    {processing ? 'Confirmation...' : 'Confirmer'}
                </button>
            </form>
        </GuestLayout>
    );
}
