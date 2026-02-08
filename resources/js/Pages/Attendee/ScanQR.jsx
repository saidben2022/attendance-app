import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QrScanner from '@/Components/QrScanner';
import { useToast } from '@/Context/ToastContext';
import { queueCheckIn, initOfflineQueue } from '@/Utils/offlineQueue';

export default function ScanQR() {
    const toast = useToast();
    const [showScanner, setShowScanner] = useState(true);
    const [scannedData, setScannedData] = useState(null);
    const [pin, setPin] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleScan = (data) => {
        setScannedData(data);
        setShowScanner(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pin.length !== 4) {
            toast.error('Le PIN doit contenir 4 chiffres');
            return;
        }

        setProcessing(true);

        // Check if online
        if (!navigator.onLine) {
            // Queue for later
            try {
                await initOfflineQueue();
                await queueCheckIn({ token: scannedData, pin });
                toast.success('Pointage enregistré hors ligne. Il sera synchronisé automatiquement.');
                router.visit('/attendee/dashboard');
            } catch (err) {
                toast.error('Erreur lors de l\'enregistrement hors ligne');
            }
            setProcessing(false);
            return;
        }

        // Submit online
        router.post('/check-in/verify', {
            token: scannedData,
            pin: pin,
        }, {
            onSuccess: () => {
                toast.success('Pointage enregistré avec succès!');
            },
            onError: (errors) => {
                toast.error(errors.message || 'Erreur lors du pointage');
                setShowScanner(true);
                setScannedData(null);
                setPin('');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleRescan = () => {
        setScannedData(null);
        setPin('');
        setShowScanner(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Scanner QR
                </h2>
            }
        >
            <Head title="Scanner QR" />

            {showScanner ? (
                <QrScanner
                    onScan={handleScan}
                    onError={(err) => toast.error(err)}
                    onClose={() => router.visit('/attendee/dashboard')}
                />
            ) : (
                <div className="py-12">
                    <div className="max-w-md mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            {/* Success indicator */}
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">QR Code scanné</h3>
                                <p className="text-gray-500 text-sm mt-1">Entrez votre PIN pour confirmer</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Code PIN (4 chiffres)
                                    </label>
                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={4}
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                        className="w-full text-center text-3xl tracking-[0.5em] py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="••••"
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || pin.length !== 4}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Validation...' : 'Valider le pointage'}
                                </button>
                            </form>

                            <button
                                onClick={handleRescan}
                                className="w-full mt-4 py-3 text-gray-600 hover:text-gray-800 font-medium"
                            >
                                ← Scanner un autre code
                            </button>

                            {/* Offline indicator */}
                            {!navigator.onLine && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700 text-sm">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829" />
                                    </svg>
                                    Mode hors ligne - le pointage sera synchronisé plus tard
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
