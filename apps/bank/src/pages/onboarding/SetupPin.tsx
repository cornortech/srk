"use client"

import React, { useState, useRef } from "react"
import { Card, CardHeader, CardBody } from "@nextui-org/card"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { Spacer } from "@nextui-org/spacer"
import { Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@srk/shared/hooks"
import { bankApi } from "@srk/shared/api"

export default function BankSetupPinPage() {
    const [pin, setPin] = useState("")
    const [confirmPin, setConfirmPin] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { userDetails } = useAuthStore()

    const pinInputRef = useRef<HTMLInputElement | null>(null)
    const confirmInputRef = useRef<HTMLInputElement | null>(null)

    const handlePinInput = (value: string, isConfirm = false) => {
        const numericValue = value.replace(/\D/g, "").slice(0, 4)
        if (isConfirm) {
            setConfirmPin(numericValue)
        } else {
            setPin(numericValue)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const userId = userDetails?._id;
        if (!userId) {
            setError("User not found")
            return
        }

        if (pin.length !== 4) {
            setError("PIN must be 4 digits")
            return
        }

        if (pin !== confirmPin) {
            setError("PINs do not match")
            return
        }

        setIsLoading(true)
        try {
            await bankApi.createBankTransactionPin(userId, pin);
            navigate("/bank/dashboard");
        } catch {
            setError("Failed to set PIN. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const renderPinBoxes = (value: string, isConfirm = false) => (
        <div
            className="flex justify-center gap-4 cursor-text"
            onClick={() =>
                isConfirm ? confirmInputRef.current?.focus() : pinInputRef.current?.focus()
            }
        >
            {[0, 1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center border-2 text-2xl sm:text-3xl font-bold transition-all duration-300"
                    style={{
                        borderColor: value[i] ? '#b68938' : '#b68938/30',
                        backgroundColor: '#2a2520'
                    }}
                >
                    <span style={{color: value[i] ? '#b68938' : 'transparent'}}>
                        {value[i] ? "•" : ""}
                    </span>
                </div>
            ))}
        </div>
    )

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 py-8 sm:py-12">
            <Card className="w-full max-w-lg bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 rounded-2xl">
                <CardHeader className="flex flex-col items-center text-center gap-3 sm:gap-4 pt-4 sm:pt-6 pb-4 sm:pb-6">
                    <div 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl" 
                        style={{background: 'linear-gradient(125deg, #e1ba73, #b68938)'}}
                    >
                        <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold" style={{color: '#b68938'}}>
                        Setup Transaction PIN
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base max-w-sm">
                        Create a 4-digit PIN to secure your transactions
                    </p>
                </CardHeader>

                <CardBody className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-6 sm:space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                        {error && (
                            <div className="bg-red-950/30 border border-red-800/50 text-red-400 p-3 sm:p-4 rounded-xl text-sm sm:text-base backdrop-blur-sm flex items-start gap-3">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="leading-relaxed">{error}</span>
                            </div>
                        )}

                        {/* PIN */}
                        <div className="space-y-3 sm:space-y-4">
                            <label className="text-white font-semibold text-sm sm:text-base" style={{color: '#b68938'}}>
                                Enter PIN
                            </label>
                            {renderPinBoxes(pin)}
                            <Input
                                ref={pinInputRef}
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                value={pin}
                                onChange={(e) => handlePinInput(e.target.value)}
                                maxLength={4}
                                className="sr-only"
                            />
                        </div>

                        {/* Confirm PIN */}
                        <div className="space-y-3 sm:space-y-4">
                            <label className="text-white font-semibold text-sm sm:text-base" style={{color: '#b68938'}}>
                                Confirm PIN
                            </label>
                            {renderPinBoxes(confirmPin, true)}
                            <Input
                                ref={confirmInputRef}
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                value={confirmPin}
                                onChange={(e) => handlePinInput(e.target.value, true)}
                                maxLength={4}
                                className="sr-only"
                            />
                        </div>

                        <Spacer y={2} />

                        <div 
                            className="h-px w-full" 
                            style={{
                                background: 'linear-gradient(90deg, transparent, #b68938, transparent)', 
                                opacity: 0.3
                            }}
                        ></div>

                        <Button
                            type="submit"
                            className="w-full h-11 sm:h-12 text-sm sm:text-base text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                            style={{background: 'linear-gradient(125deg, #e1ba73, #b68938)'}}
                            isDisabled={isLoading || pin.length !== 4 || confirmPin.length !== 4}
                            isLoading={isLoading}
                        >
                            {isLoading ? "Setting up..." : "Setup PIN"}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

// function cn(...classes: (string | undefined | false | null)[]): string {
//     return classes.filter(Boolean).join(" ")
// }