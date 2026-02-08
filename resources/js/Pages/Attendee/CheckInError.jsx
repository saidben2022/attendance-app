import { Head, Link } from '@inertiajs/react';

export default function CheckInError({ error, message }) {
    const getErrorConfig = () => {
        switch (error) {
            case 'invalid_qr':
                return {
                    icon: '🔗',
                    title: 'Invalid QR Code',
                    suggestion: 'The QR code may have expired or the session has closed. Ask your instructor to refresh the QR code.',
                };
            case 'not_enrolled':
                return {
                    icon: '🚫',
                    title: 'Not Enrolled',
                    suggestion: 'You are not enrolled in this course. Contact your administrator if you believe this is an error.',
                };
            case 'session_closed':
                return {
                    icon: '⏰',
                    title: 'Session Closed',
                    suggestion: 'Check-in for this session has ended. Contact your instructor if you need assistance.',
                };
            case 'invalid_token':
                return {
                    icon: '🎫',
                    title: 'Invalid Token',
                    suggestion: 'This second-chance token is invalid or has expired.',
                };
            default:
                return {
                    icon: '❌',
                    title: 'Check-in Failed',
                    suggestion: 'Please try again or contact your instructor.',
                };
        }
    };

    const config = getErrorConfig();

    return (
        <>
            <Head title="Check-in Error" />
            
            <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-900 to-red-800 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    {/* Error Icon */}
                    <div className="h-24 w-24 mx-auto rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-6">
                        <span className="text-5xl">{config.icon}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {config.title}
                    </h1>

                    {/* Message */}
                    <p className="text-red-200 mb-4">{message}</p>

                    {/* Suggestion */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 mb-6">
                        <p className="text-white/80 text-sm">{config.suggestion}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            href={route('attendee.dashboard')}
                            className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-white text-red-900 font-semibold hover:bg-gray-100 transition"
                        >
                            Go to Dashboard
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
