import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function QRDisplay({ slot, session, cohort, checkInUrl }) {
    const [showRefreshHint, setShowRefreshHint] = useState(false);

    useEffect(() => {
        // Auto-refresh the page every 30 seconds to keep QR token fresh
        const interval = setInterval(() => {
            router.reload({ only: ['slot', 'checkInUrl'] });
        }, 30000);

        // Show refresh hint after 5 minutes
        const hintTimeout = setTimeout(() => {
            setShowRefreshHint(true);
        }, 300000);

        return () => {
            clearInterval(interval);
            clearTimeout(hintTimeout);
        };
    }, []);

    const handleRefreshQR = () => {
        router.post(route('verifier.qr.refresh', slot.id), {}, {
            onSuccess: () => setShowRefreshHint(false),
        });
    };

    // Generate QR code as SVG (simplified - in production use a library like qrcode.react)
    const qrCodeUrl = checkInUrl 
        ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(checkInUrl)}`
        : null;

    return (
        <>
            <Head title="Check-in QR Code" />
            
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <Link 
                            href={route('verifier.slot', slot.id)} 
                            className="text-white/70 hover:text-white flex items-center gap-2"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Control Panel
                        </Link>
                        <button
                            onClick={handleRefreshQR}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh QR
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center">
                        {/* Course & Cohort Info */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-white mb-2">{cohort.course_name}</h1>
                            <p className="text-2xl text-indigo-200">{cohort.name}</p>
                            <div className="mt-4 flex items-center justify-center gap-4 text-white/70">
                                <span className="flex items-center gap-2">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {session.date}
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${slot.state === 'open' ? 'bg-green-400' : 'bg-gray-400'}`} />
                                    {slot.type.toUpperCase()} Session
                                </span>
                            </div>
                        </div>

                        {/* QR Code */}
                        {slot.state === 'open' && qrCodeUrl ? (
                            <div className="relative">
                                <div className="bg-white p-6 rounded-3xl shadow-2xl inline-block">
                                    <img 
                                        src={qrCodeUrl} 
                                        alt="Check-in QR Code" 
                                        className="w-80 h-80 md:w-96 md:h-96"
                                    />
                                </div>
                                
                                {/* Pulsing indicator */}
                                <div className="absolute -top-2 -right-2 flex items-center justify-center">
                                    <span className="relative flex h-6 w-6">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500" />
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/10 backdrop-blur-lg p-12 rounded-3xl border border-white/20">
                                <svg className="h-32 w-32 mx-auto text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p className="mt-6 text-xl text-white/70">
                                    Slot is {slot.state}.<br />
                                    Open the slot to display the QR code.
                                </p>
                                <Link
                                    href={route('verifier.slot', slot.id)}
                                    className="mt-6 inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition"
                                >
                                    Go to Control Panel
                                </Link>
                            </div>
                        )}

                        {/* Instructions */}
                        {slot.state === 'open' && (
                            <div className="mt-8 text-white/80">
                                <p className="text-lg">Scan this QR code with your phone to check in</p>
                                {showRefreshHint && (
                                    <p className="mt-2 text-yellow-300 animate-pulse">
                                        Hint: Refresh the QR code periodically for security
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Token Display (for debugging/verification) */}
                        {slot.state === 'open' && slot.qr_token && (
                            <div className="mt-6 text-white/40 text-sm">
                                Token: {slot.qr_token.substring(0, 8)}...
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white/10 backdrop-blur-md border-t border-white/20 px-6 py-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-white/50 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="font-medium text-white">AttendEase</span>
                        </div>
                        <span>•</span>
                        <span>Auto-refreshes every 30 seconds</span>
                    </div>
                </div>
            </div>
        </>
    );
}
