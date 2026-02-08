import { Head, router } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function PinEntry({ slot, session, cohort, token }) {
    const [pin, setPin] = useState(['', '', '', '']);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    const handlePinChange = (index, value) => {
        if (value.length > 1) return; // Only allow single digit
        if (value && !/^\d$/.test(value)) return; // Only allow digits

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }

        // Auto-submit when all 4 digits entered
        if (value && index === 3 && newPin.every(d => d !== '')) {
            submitPin(newPin.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const submitPin = (pinValue) => {
        setProcessing(true);
        setError(null);
        
        router.post(route('check-in.verify'), {
            token: token,
            pin: pinValue,
        }, {
            onError: (errors) => {
                setError(errors.pin || 'Invalid PIN. Please try again.');
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pin.every(d => d !== '')) {
            submitPin(pin.join(''));
        }
    };

    return (
        <>
            <Head title="Enter PIN" />
            
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mb-4">
                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Check-in</h1>
                        <p className="text-indigo-200">{cohort.course_name}</p>
                        <p className="text-indigo-300 text-sm">{cohort.name} • {slot.type.toUpperCase()} Session</p>
                        <p className="text-indigo-400 text-sm mt-1">{session.date}</p>
                    </div>

                    {/* PIN Entry Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                        <h2 className="text-center text-white text-lg font-medium mb-6">
                            Enter your 4-digit PIN
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="flex justify-center gap-3 mb-6">
                                {pin.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handlePinChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 border-white/20 bg-white/10 text-white focus:border-emerald-400 focus:ring-emerald-400 focus:outline-none transition"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                                    <p className="text-red-200 text-sm text-center">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing || !pin.every(d => d !== '')}
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : 'Check In'}
                            </button>
                        </form>
                    </div>

                    {/* Help Text */}
                    <p className="text-center text-indigo-300 text-sm mt-6">
                        Forgot your PIN? Contact your instructor.
                    </p>
                </div>
            </div>
        </>
    );
}
