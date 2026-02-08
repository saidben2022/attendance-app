import { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';

export default function QrScanner({ onScan, onError, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [facingMode, setFacingMode] = useState('environment');
    const streamRef = useRef(null);
    const animationRef = useRef(null);

    const startCamera = useCallback(async () => {
        try {
            // Stop any existing stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setHasPermission(true);
                setIsScanning(true);
            }
        } catch (err) {
            console.error('Camera access error:', err);
            setHasPermission(false);
            
            // Only show error once
            if (!hasPermission) {
                let msg = 'Impossible d\'accéder à la caméra.';
                if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                    msg = 'La caméra nécessite HTTPS ou localhost. Sur mobile, utilisez chrome://flags pour autoriser "Insecure origins".';
                }
                if (onError) onError(msg);
            }
        }
    }, [facingMode, hasPermission]); // Removed onError from dependency to prevent loop

    const stopCamera = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsScanning(false);
    }, []);

    const scanFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || !isScanning) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                // QR code found!
                stopCamera();
                if (onScan) onScan(code.data);
                return;
            }
        }

        animationRef.current = requestAnimationFrame(scanFrame);
    }, [isScanning, onScan, stopCamera]);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    useEffect(() => {
        if (isScanning) {
            animationRef.current = requestAnimationFrame(scanFrame);
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isScanning, scanFrame]);

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => { stopCamera(); onClose?.(); }}
                        className="text-white p-2 rounded-full bg-white/20 hover:bg-white/30"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-white font-semibold text-lg">Scanner le QR code</h2>
                    <button
                        onClick={toggleCamera}
                        className="text-white p-2 rounded-full bg-white/20 hover:bg-white/30"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Camera View */}
            <div className="flex-1 relative">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Scan overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-64 h-64">
                        {/* Corner markers */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />
                        
                        {/* Scanning line animation */}
                        {isScanning && (
                            <div className="absolute left-2 right-2 h-0.5 bg-emerald-500 animate-scan" />
                        )}
                    </div>
                </div>

                {/* Permission denied message */}
                {hasPermission === false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <div className="text-center text-white p-6">
                            <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-lg font-medium mb-2">Accès caméra refusé</p>
                            <p className="text-gray-400 text-sm">Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white/80 text-center text-sm">
                    Placez le QR code dans le cadre
                </p>
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: calc(100% - 2px); }
                    100% { top: 0; }
                }
                .animate-scan {
                    animation: scan 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
