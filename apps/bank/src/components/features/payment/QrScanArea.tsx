import { Camera } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

interface QrScanAreaProps {
    onScanSuccess: (decodedText: string) => void;
}

const QrScanArea: React.FC<QrScanAreaProps> = ({ onScanSuccess }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const scannerRef = useRef<QrScanner | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startScanner = async () => {
        try {
            setError(null);
            setIsScanning(true);
            if (!videoRef.current) return;

            // Initialize QR Scanner
            scannerRef.current = new QrScanner(
                videoRef.current,
                (result) => {
                    if (result?.data) {
                        onScanSuccess(result.data);
                        stopScanner(); // Stop scanning after success
                    }
                },
                {
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );

            await scannerRef.current.start();
        } catch (err) {
            console.error(err);
            setError("Camera access failed. Please allow permission.");
            setIsScanning(false);
        }
    };

    const stopScanner = async () => {
        console.log("Stopping scanner", scannerRef.current);
        if (scannerRef.current) {
            await scannerRef.current.stop();
            scannerRef.current.destroy();
            scannerRef.current = null;
        }
        setIsScanning(false);
    };

    useEffect(() => {
        return () => {
            stopScanner(); // Cleanup on unmount
        };
    }, []);

    return (
        <div
            className="rounded-2xl p-6 text-center relative overflow-hidden"
            style={{
                background:
                    "linear-gradient(135deg, #1a1410 0%, #2a2520 50%, #1a1410 100%)",
                border: isScanning
                    ? "2px solid #b68938"
                    : "2px dashed rgba(182, 137, 56, 0.3)",
            }}
        >
            {isScanning && (
                <div className="absolute inset-0 bg-[#b68938]/10 animate-pulse"></div>
            )}

            {/* Video Preview */}
            <div className="relative mx-auto mb-4 rounded-xl overflow-hidden w-full max-w-sm">
                <video
                    ref={videoRef}
                    className="w-full rounded-xl"
                    style={{ display: isScanning ? "block" : "none" }}
                />
                {!isScanning && (
                    <div
                        className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto"
                        style={{ backgroundColor: "rgba(182, 137, 56, 0.1)" }}
                    >
                        <Camera className="w-12 h-12" style={{ color: "#b68938" }} />
                    </div>
                )}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
                {isScanning ? "Scanning..." : "Scan QR Code"}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
                {isScanning
                    ? "Hold your camera steady"
                    : "Position the QR code within the frame"}
            </p>

            <button
                onClick={isScanning ? stopScanner : startScanner}
                className="py-3 px-8 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#b68938]/30"
                style={{
                    background: "linear-gradient(135deg, #e1ba73, #b68938)",
                }}
            >
                {isScanning ? "Stop Scanning" : "Start Scanning"}
            </button>

            {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
        </div>
    );
};

export default QrScanArea;