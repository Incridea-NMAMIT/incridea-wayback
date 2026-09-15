import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { X, Camera, AlertCircle } from 'lucide-react'

interface QrScannerProps {
    onScan: (data: string) => void
    onClose: () => void
    title?: string
    description?: string
}

export default function QrScanner({ onScan, onClose, title = "Scan PID QR Code", description = "Point camera at the PID QR code" }: QrScannerProps) {
    const [error, setError] = useState<string | null>(null)
    const [isInit, setIsInit] = useState(false)
    const scannerRef = useRef<Html5Qrcode | null>(null)

    // Stable callbacks pattern: store props in refs so useEffect doesn't need to depend on them
    const onScanRef = useRef(onScan)
    const onCloseRef = useRef(onClose)

    useEffect(() => {
        onScanRef.current = onScan
    }, [onScan])

    useEffect(() => {
        onCloseRef.current = onClose
    }, [onClose])

    useEffect(() => {
        let isMounted = true
        // Lock body scroll
        const originalStyle = window.getComputedStyle(document.body).overflow
        document.body.style.overflow = 'hidden'

        const scannerId = "reader"
        const html5QrCode = new Html5Qrcode(scannerId)
        scannerRef.current = html5QrCode

        const startScanner = async () => {
            try {
                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                }

                if (!isMounted) return

                await html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        if (isMounted) onScanRef.current(decodedText)
                    },
                    undefined
                )

                if (isMounted) setIsInit(true)
            } catch (err: any) {
                if (isMounted) {
                    console.error("Failed to start scanner:", err)
                    setError(err?.message || "Camera access denied or not found")
                }
            }
        }

        startScanner()

        return () => {
            isMounted = false
            // Restore body scroll
            document.body.style.overflow = originalStyle

            const scanner = scannerRef.current
            if (scanner) {
                // Remove the reference immediately to prevent further calls
                scannerRef.current = null

                if (scanner.isScanning) {
                    scanner.stop()
                        .then(() => {
                            try {
                                scanner.clear()
                            } catch (e) { }
                        })
                        .catch(() => { })
                }
            }
        }
    }, []) // Effect runs only once on mount

    return (
        <div className="fixed inset-0 z-[100] preserve-3d">
            {/* Full-screen Blurred Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-2xl animate-in fade-in duration-500"
                onClick={onClose}
            ></div>

            {/* Centered Modal Container */}
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 pointer-events-none">
                <div className="relative w-full max-w-xl bg-gray-900/80 rounded-[3rem] border border-white/10 shadow-2xl shadow-purple-500/10 overflow-hidden pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">

                    {/* Header with Close Button */}
                    <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-20 bg-gradient-to-b from-gray-900/90 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-2xl border border-purple-500/20">
                                <Camera className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{description}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all active:scale-90"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Camera Viewport Container */}
                    <div className="aspect-square sm:aspect-video relative overflow-hidden bg-black">
                        <div id="reader" className="w-full h-full"></div>

                        {/* Scanning Overlay (Visible only when Init) */}
                        {isInit && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]">
                                    {/* Animated Corners */}
                                    <div className="absolute -top-2 -left-2 w-10 h-10 border-t-4 border-l-4 border-purple-500 rounded-tl-2xl shadow-[0_0_15px_rgba(168,85,247,0.4)]"></div>
                                    <div className="absolute -top-2 -right-2 w-10 h-10 border-t-4 border-r-4 border-purple-500 rounded-tr-2xl shadow-[0_0_15px_rgba(168,85,247,0.4)]"></div>
                                    <div className="absolute -bottom-2 -left-2 w-10 h-10 border-b-4 border-l-4 border-purple-500 rounded-bl-2xl shadow-[0_0_15px_rgba(168,85,247,0.4)]"></div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-4 border-r-4 border-purple-500 rounded-br-2xl shadow-[0_0_15px_rgba(168,85,247,0.4)]"></div>

                                    {/* Laser Line */}
                                    <div className="absolute top-0 left-2 right-2 h-[2px] bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,1)] animate-[scan_2s_ease-in-out_infinite]"></div>

                                    {/* Frame Darkening Overlay */}
                                    <div className="absolute -inset-[100vmax] border-[100vmax] border-black/40"></div>
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {!isInit && !error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10 gap-4">
                                <div className="relative">
                                    <div className="w-14 h-14 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-purple-300 tracking-[0.2em] uppercase">Initializing...</span>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95 z-10 p-8">
                                <div className="flex flex-col items-center text-center space-y-5 max-w-xs">
                                    <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
                                        <AlertCircle className="w-10 h-10 text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">Camera Error</h4>
                                        <p className="text-xs text-gray-500">{error}</p>
                                    </div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold py-3 rounded-2xl border border-red-500/20 transition-all"
                                    >
                                        Try Refreshing
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Branding */}
                    <div className="p-6 bg-gray-900 flex justify-center items-center gap-3">
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1 h-3 bg-purple-500/30 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-500 font-black tracking-[0.4em] uppercase">Live Scan Active</p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0%, 100% { top: 2%; opacity: 0.3; }
                    50% { top: 98%; opacity: 1; }
                }
                #reader {
                    background: transparent !important;
                }
                #reader video {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    border-radius: 0 !important;
                }
                #reader__scan_region {
                    display: none !important;
                }
            `}</style>
        </div>
    )
}
