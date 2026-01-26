"use client";

import { AlertCircle, Upload, CheckCircle, SendIcon, ScanBarcode } from "lucide-react";
import QrScanner from "qr-scanner";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanArea from "./QrScanArea";
import useSendMoneyStore from "../../store/useSendMoneyStore";

const QrScan = () => {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [decodedData, setDecodedData] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<{
        accountNumber: string;
        accountHolder: string;
    } | null>(null);
    // const [error, setError] = useState<string | null>(null);

    const { setSendMoneyDetails } = useSendMoneyStore()
    const router = useNavigate()


    const handleMakePayment = () => {
        alert("Redirecting to payment page...");
        if (!parsedData) return;
        console.log(parsedData)
        setSendMoneyDetails({
            receiverAccountNumber: parsedData.accountNumber,
            receiverAccountName: parsedData.accountHolder,
        });
        router("/bank/dashboard/send-money")
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const imageBitmap = await createImageBitmap(file);
            const result = await QrScanner.scanImage(imageBitmap);

            // If result is JSON, parse it safely
            const parsed = result;
            try {
                const parsedData = JSON.parse(result) as {
                    accountNumber: string;
                    accountHolder: string;
                };

                setParsedData(parsedData);
            } catch {
                // not JSON, keep as string
            }

            setDecodedData(JSON.stringify(parsed, null, 2));
            // setError(null);
        } catch (err) {
            console.error(err);
            // setError("Failed to read QR code. Please upload a clear image.");
            setDecodedData(null);
        }
    };

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleScanSuccess = (decodedText: string) => {
        // If result is JSON, parse it safely
        const parsed = decodedText;
        try {
            const parsedData = JSON.parse(decodedText) as {
                accountNumber: string;
                accountHolder: string;
            };

            setParsedData(parsedData);
        } catch {
            // not JSON, keep as string
        }

        setDecodedData(JSON.stringify(parsed, null, 2));
        // setError(null);
    }

    // If QR is decoded, show result UI
    if (decodedData) {
        return (
            <div className="space-y-6 p-6 rounded-2xl bg-[#1a1410] border border-[#b68938]/40 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="text-green-500 w-6 h-6" />
                    <h2 className="text-xl font-semibold">QR Code Scanned Successfully</h2>
                </div>

                <div className="p-4 rounded-xl bg-[#2a2520] border border-[#b68938]/20 space-y-2">
                    <p>
                        <span className="text-gray-400">Account Holder:</span>{" "}
                        <span className="font-semibold text-[#e1ba73]">
                            {`${parsedData?.accountHolder || "N/A"}`}
                        </span>
                    </p>
                    <p>
                        <span className="text-gray-400">Account Number:</span>{" "}
                        <span className="font-semibold text-[#e1ba73]">
                            {`${parsedData?.accountNumber || "N/A"}`}
                        </span>
                    </p>
                </div>

                <div className="bg-black/40 p-3 rounded-xl text-sm text-gray-300">
                    <p className="font-semibold mb-1 text-[#b68938]">Decoded Data:</p>
                    <pre className="whitespace-pre-wrap break-words text-gray-200 text-xs">
                        {decodedData}
                    </pre>
                </div>

                <div className="flex justify-start gap-4">

                    <button
                        onClick={() => setDecodedData(null)}
                        className="flex items-center gap-x-2 mt-4 py-2 px-6 rounded-xl bg-[#b68938] text-black font-semibold hover:bg-[#e1ba73] transition-all"
                    >
                        <ScanBarcode className="w-4 h-4" />
                        Scan Another QR
                    </button>

                    <button
                        onClick={handleMakePayment}
                        className=" flex items-center gap-x-2 mt-4 py-2 mx-2 px-6 rounded-xl bg-[#b68938] text-black font-semibold hover:bg-[#e1ba73] transition-all"
                    >
                        <SendIcon className="w-4 h-4" />
                        Make Payment
                    </button>
                </div>
            </div>
        );
    }

    // Default UI (before scanning)
    return (
        <div className="space-y-6">
            {/* Scan Area */}
            <QrScanArea onScanSuccess={handleScanSuccess} />

            {/* Upload Option */}
            <div className="text-center">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-[#b68938]/20"></div>
                    <span className="text-sm text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-[#b68938]/20"></div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <button
                    onClick={handleFileUpload}
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-black/50 border border-[#b68938]/40 text-white hover:border-[#b68938]/60 hover:bg-[#b68938]/10 transition-all"
                >
                    <Upload className="w-4 h-4" />
                    Upload QR Image
                </button>
            </div>

            {/* Instructions */}
            <div className="rounded-2xl p-5 bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-blue-400 font-semibold mb-2">How to Scan</h4>
                        <ul className="text-sm text-blue-300 space-y-1">
                            <li>• Ensure good lighting for better scanning</li>
                            <li>• Hold your device steady</li>
                            <li>• Position the QR code within the frame</li>
                            <li>• Verify payment details before confirming</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QrScan;
