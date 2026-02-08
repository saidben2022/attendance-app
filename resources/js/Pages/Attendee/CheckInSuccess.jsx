import { Head, Link } from '@inertiajs/react';

export default function CheckInSuccess({ status, checkedInAt, message, alreadyCheckedIn }) {
    const getStatusConfig = () => {
        switch (status) {
            case 'present':
                return {
                    icon: '✓',
                    color: 'from-emerald-400 to-green-500',
                    bgColor: 'bg-emerald-500/20',
                    borderColor: 'border-emerald-500/30',
                };
            case 'late':
                return {
                    icon: '⏰',
                    color: 'from-yellow-400 to-orange-500',
                    bgColor: 'bg-yellow-500/20',
                    borderColor: 'border-yellow-500/30',
                };
            default:
                return {
                    icon: '✓',
                    color: 'from-blue-400 to-indigo-500',
                    bgColor: 'bg-blue-500/20',
                    borderColor: 'border-blue-500/30',
                };
        }
    };

    const config = getStatusConfig();

    return (
        <>
            <Head title="Check-in Successful" />
            
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    {/* Success Animation */}
                    <div className={`h-24 w-24 mx-auto rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center mb-6 animate-bounce`}>
                        <span className="text-4xl text-white">{config.icon}</span>
                    </div>

                    {/* Status */}
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {alreadyCheckedIn ? 'Already Checked In' : 'Success!'}
                    </h1>
                    
                    <div className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold capitalize mb-4 ${config.bgColor} ${config.borderColor} border text-white`}>
                        {status}
                    </div>

                    {/* Message */}
                    <p className="text-indigo-200 mb-4">{message}</p>

                    {/* Time */}
                    {checkedInAt && (
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 mb-6">
                            <p className="text-indigo-300 text-sm">Checked in at</p>
                            <p className="text-2xl font-bold text-white">{checkedInAt}</p>
                        </div>
                    )}

                    {/* Action Button */}
                    <Link
                        href={route('attendee.dashboard')}
                        className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </>
    );
}
