import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { ArrowLeft, Send, QrCode } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useAuthStore, useIsMobileView } from "@srk/shared/hooks";
import useSendMoneyStore from "../../../store/useSendMoneyStore";
import { bankApi, createPaymentIntentSchema, TCreatePaymentIntentForm } from "@srk/shared/api";


export default function SendMoneyPage() {

    const { srkBank, userDetails } = useAuthStore()

    // Initialize form
    const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm<TCreatePaymentIntentForm>({
        resolver: zodResolver(createPaymentIntentSchema),
        defaultValues: {
            recipientAccount: "",
            recipientName: "",
            amount: 0,
            description: "",
        },
    });

    // Mock user data

    const [error, setError] = useState("");
    const [isFromQR, setIsFromQR] = useState(false);
    const isMobileView = useIsMobileView();
    const navigate = useNavigate();
    const { setSendMoneyDetails, receiverAccountName, receiverAccountNumber } = useSendMoneyStore();



    console.log("debug 1", receiverAccountName, receiverAccountNumber);

    useEffect(() => {
        if (receiverAccountName && receiverAccountNumber) {
            setIsFromQR(true);
            // setValue("recipientName", receiverAccountName);
            // setValue("recipientAccount", receiverAccountNumber);
            reset({
                recipientName: receiverAccountName,
                recipientAccount: receiverAccountNumber,
                amount: 0,
                description: "",
            })
        } else {
            setIsFromQR(false);
            reset();
        }

    }, [receiverAccountName, receiverAccountNumber])

    // useEffect(() => {
    //     const scannedData = sessionStorage.getItem("scanned_recipient");
    //     if (scannedData) {
    //         const recipient = JSON.parse(scannedData);

    //         setIsFromQR(true);
    //         sessionStorage.removeItem("scanned_recipient");
    //     }
    // }, []);

    const { mutate: createPaymentIntentMutation } = useMutation({
        mutationKey: ['create-payment-intent'],
        mutationFn: async (data: TCreatePaymentIntentForm) => {

            // Call API to create payment intent
            return await bankApi.createPaymentIntent({
                userId: userDetails!._id,
                amount: data.amount,
                receiverAccountNumber: data.recipientAccount,
                description: data.description,
                recipientName: data.recipientName,
            });
        },
        onSuccess: (data: AxiosResponse<{ paymentIntentId: string }>) => {
            // On success, navigate to preview page with intent ID
            setSendMoneyDetails({
                amount: getValues("amount"),
                receiverAccountNumber: getValues("recipientAccount"),
                receiverAccountName: getValues("recipientName"),
                description: getValues("description"),
                intentId: data.data.paymentIntentId,
            });

            navigate("/bank/dashboard/send-money/preview");
        },
        onError: (error: any) => {
            // Handle error
            setError(error?.response?.data?.message || "An error occurred. Please try again.");
        },
    })

    const onSubmit = () => {

        if (!userDetails?._id) {
            setError("Please log in");
            return;
        }

        if (getValues("amount") <= 0) {
            setError("Please enter a valid amount");
            return;
        }
        if (!getValues("recipientAccount") || !getValues("recipientName")) {
            setError("Please fill in all required fields");
            return;
        }

        // Trigger mutation to create payment intent

        createPaymentIntentMutation({
            amount: getValues("amount"),
            recipientAccount: getValues("recipientAccount"),
            recipientName: getValues("recipientName"),
            description: getValues("description"),
        });


    }
    console.log(error);
    return (
        <div className="min-h-screen w-full relative top-[10vh] bg-black p-4 sm:p-6 pt-12 sm:pt-16">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6">
                    <Button

                        onClick={() => navigate(-1)}
                        isIconOnly
                        variant="light"
                        className="text-white hover:opacity-80"
                    >
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                    <h1 className="text-lg sm:text-xl font-bold text-white">Send Money</h1>
                </div>

                <Card className="bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 rounded-2xl">
                    <CardHeader className="flex flex-col items-start gap-2 sm:gap-3">
                        <div className="flex items-center gap-2">
                            <Send className="w-5 h-5" style={{ color: '#b68938' }} />
                            <h1 className="font-bold text-white text-base sm:text-lg">Transfer Funds</h1>
                            {isFromQR && <QrCode className="w-4 h-4" style={{ color: '#b68938' }} />}
                        </div>
                        <h3 className="text-gray-400 text-xs sm:text-sm">
                            Available Balance: NRS.{srkBank?.amount?.toLocaleString()}
                        </h3>
                        {isFromQR && (
                            <h3 className="text-xs sm:text-sm font-semibold" style={{ color: '#b68938' }}>
                                Recipient details loaded from QR code
                            </h3>
                        )}
                    </CardHeader>

                    <div
                        className="h-px w-full"
                        style={{
                            background: 'linear-gradient(90deg, transparent, #b68938, transparent)',
                            opacity: 0.3
                        }}
                    ></div>

                    <CardBody className="px-4 sm:px-6 py-4 sm:py-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                            {error && (
                                <div className="bg-red-950/30 border border-red-800/50 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm backdrop-blur-sm flex items-start gap-2">
                                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            <Input
                                label="Recipient Account Number *"
                                variant="bordered"
                                {...register("recipientAccount")}
                                classNames={{
                                    input: "text-white text-sm sm:text-base",
                                    label: "text-[#b68938] text-xs sm:text-sm",
                                    inputWrapper: "bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]"
                                }}
                                placeholder="Enter account number"
                                isReadOnly={isFromQR}
                            />

                            {errors.recipientAccount && (
                                <span className="text-red-400 text-xs sm:text-sm">
                                    {errors.recipientAccount.message}
                                </span>
                            )}

                            <Input
                                label="Recipient Name *"
                                variant="bordered"
                                classNames={{
                                    input: "text-white text-sm sm:text-base",
                                    label: "text-[#b68938] text-xs sm:text-sm",
                                    inputWrapper: "bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]"
                                }}
                                placeholder="Enter recipient name"
                                isReadOnly={isFromQR}
                                {...register("recipientName")}
                            />
                            {errors.recipientName && (
                                <span className="text-red-400 text-xs sm:text-sm">
                                    {errors.recipientName.message}
                                </span>
                            )}

                            <Input
                                label="Amount *"
                                type="number"
                                variant="bordered"
                                {...register("amount")}
                                classNames={{
                                    input: "text-white text-sm sm:text-base",
                                    label: "text-[#b68938] text-xs sm:text-sm",
                                    inputWrapper: "bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]"
                                }}
                                placeholder="0.00"
                            />

                            {errors.amount && (
                                <span className="text-red-400 text-xs sm:text-sm">
                                    {errors.amount.message}
                                </span>
                            )}

                            <Input
                                label="Description (Optional)"
                                variant="bordered"
                                {...register("description")}
                                classNames={{
                                    input: "text-white text-sm sm:text-base",
                                    label: "text-[#b68938] text-xs sm:text-sm",
                                    inputWrapper: "bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]"
                                }}
                                placeholder="What's this for?"
                            />

                            {errors.description && (
                                <span className="text-red-400 text-xs sm:text-sm">
                                    {errors.description.message}
                                </span>
                            )}

                            <div
                                className="h-px w-full"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, #b68938, transparent)',
                                    opacity: 0.3
                                }}
                            ></div>

                            <Button
                                type="submit"
                                className="w-full h-10 sm:h-11 text-sm sm:text-base text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                style={{ background: 'linear-gradient(125deg, #e1ba73, #b68938)' }}
                            >
                                Continue
                            </Button>

                            {!isMobileView && (
                                <Link to="/bank/dashboard/QRpay" className="w-full">
                                    <Button
                                        variant="bordered"
                                        className="w-full h-10 sm:h-11 text-sm sm:text-base font-semibold mt-3"
                                        style={{ borderColor: '#b68938', color: '#b68938' }}
                                    >
                                        <QrCode className="w-4 h-4" />
                                        Scan QR Code Instead
                                    </Button>
                                </Link>
                            )}
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}