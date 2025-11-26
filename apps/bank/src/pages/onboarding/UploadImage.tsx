"use client";

import React, { useState, useRef } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Image
} from "@nextui-org/react";
import { Upload, Camera, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useUploadFile } from "@srk/shared/hooks";
import { bankApi } from "@srk/shared/api";

export default function BankUploadImage() {
    const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { userDetails } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { uploadFile } = useUploadFile();
    const navigate = useNavigate();

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setSelectedImage(e.target.result);
                    setError("");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {

        const file = fileInputRef.current?.files?.[0];

        if (!file) {
            setError("File not found");
            return;
        }

        if (!userDetails) {
            setError("User not found");
            return;
        }

        if (!selectedImage) {
            setError("Please select a profile image");
            return;
        }

        setIsLoading(true);

        try {

            const { url } = await uploadFile(file, "image", "bank", (progress) => {
                setUploadProgress(progress);
            });

            bankApi.uploadBankProfilePicture(userDetails._id, url);
            navigate("/onboarding/user-preview");

        } catch {
            setError("Failed to upload image. Please try again.");

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 py-8 sm:py-12">
            <Card className="w-full max-w-md bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 rounded-2xl p-6 sm:p-8">
                <CardHeader className="flex flex-col items-center text-center gap-3 sm:gap-4 pt-2 pb-4">
                    <div
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl mb-2 sm:mb-3"
                        style={{ background: 'linear-gradient(125deg, #e1ba73, #b68938)' }}
                    >
                        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#b68938' }}>
                        Profile Picture
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base max-w-sm">
                        Add a profile picture to personalize your account
                    </p>
                </CardHeader>

                <CardBody className="px-0 sm:px-2 space-y-5 sm:space-y-6">
                    {error && (
                        <div className="bg-red-950/30 border border-red-800/50 text-red-400 p-3 sm:p-4 rounded-xl text-sm sm:text-base backdrop-blur-sm flex items-start gap-3">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="leading-relaxed">{error}</span>
                        </div>
                    )}

                    <div className="flex flex-col items-center space-y-4 sm:space-y-5">
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#2a2520] border-2 flex items-center justify-center overflow-hidden shadow-lg" style={{ borderColor: '#b68938' }}>
                            {selectedImage ? (
                                <Image
                                    src={typeof selectedImage === "string" ? selectedImage : undefined}
                                    alt="Profile preview"
                                    className="object-cover"
                                />
                            ) : (
                                <User className="w-12 h-12 sm:w-16 sm:h-16" style={{ color: '#b68938' }} />
                            )}
                        </div>

                        {
                            uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="w-full bg-[#2a2520] rounded-full h-2.5 border border-[#b68938]/40">
                                    <div
                                        className="h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${uploadProgress}%`, background: 'linear-gradient(90deg, #e1ba73, #b68938)' }}
                                    ></div>
                                </div>
                            )
                        }

                        <div className="flex gap-3 flex-wrap justify-center">
                            <Button
                                variant="bordered"
                                className="h-10 sm:h-11 text-sm sm:text-base font-semibold transition-all duration-300"
                                style={{ borderColor: '#b68938', color: '#b68938' }}
                                onPress={() => fileInputRef.current?.click()}
                                startContent={<Upload className="w-4 h-4" />}
                            >
                                Upload
                            </Button>
                            <Button
                                variant="bordered"
                                className="h-10 sm:h-11 text-sm sm:text-base font-semibold transition-all duration-300"
                                style={{ borderColor: '#b68938', color: '#b68938' }}
                                onPress={() => fileInputRef.current?.click()}
                                startContent={<Camera className="w-4 h-4" />}
                            >
                                Camera
                            </Button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                    </div>

                    <div
                        className="h-px w-full"
                        style={{
                            background: 'linear-gradient(90deg, transparent, #b68938, transparent)',
                            opacity: 0.3
                        }}
                    ></div>

                    <div className="space-y-3">
                        <Button
                            className="w-full h-11 sm:h-12 text-sm sm:text-base text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            style={{ background: 'linear-gradient(125deg, #e1ba73, #b68938)' }}
                            isDisabled={isLoading || !selectedImage}
                            isLoading={isLoading}
                            onPress={handleSubmit}
                        >
                            {isLoading ? "Uploading..." : "Continue"}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}