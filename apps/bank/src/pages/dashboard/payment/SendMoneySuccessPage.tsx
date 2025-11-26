import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody } from "@nextui-org/react";
import { CheckCircle, Download, Share2, Home, User, CreditCard, DollarSign, FileText, Calendar } from "lucide-react";
import useSendMoneyStore from "../../../store/useSendMoneyStore";

export default function SendMoneySuccessPage() {
    const navigate = useNavigate();

    // Transaction data - in real app, this would come from state/props

    const { amount, description, receiverAccountName, receiverAccountNumber } = useSendMoneyStore()


    const handleDownloadReceipt = () => {
        // In a real app, this would generate and download a PDF receipt
        alert("Receipt download functionality would be implemented here");
    };

    const handleShare = () => {
        // In a real app, this would open a share dialog
        alert("Share functionality would be implemented here");
    };

    const handleDone = () => {
        navigate("/bank/dashboard");
    };

    return (
        <div className="min-h-screen w-full bg-black p-4 sm:p-6">
            <div className="max-w-md mx-auto">
                {/* Success Animation */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 animate-pulse"
                        style={{
                            background: 'linear-gradient(125deg, rgba(225, 186, 115, 0.2), rgba(182, 137, 56, 0.2))',
                            border: '2px solid #b68938'
                        }}
                    >
                        <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: '#b68938' }} />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Transfer Successful!</h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Your money has been sent successfully
                    </p>
                </div>

                {/* Transaction Summary */}
                <Card className="bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 rounded-2xl mb-4 sm:mb-6">
                    <CardBody className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                        {/* Amount - Highlighted */}
                        <div
                            className="p-4 sm:p-5 rounded-xl text-center"
                            style={{
                                background: 'linear-gradient(125deg, rgba(225, 186, 115, 0.1), rgba(182, 137, 56, 0.1))',
                                border: '1px solid rgba(182, 137, 56, 0.3)'
                            }}
                        >
                            <p className="text-xs sm:text-sm text-gray-400 mb-1">Amount Sent</p>
                            <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#b68938' }}>
                                Nrs.{amount.toLocaleString()}
                            </p>
                        </div>

                        {/* Recipient */}
                        <div
                            className="p-3 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4"
                            style={{ backgroundColor: '#2a2520' }}
                        >
                            <User className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#b68938' }} />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-400">To</p>
                                <p className="text-white text-sm sm:text-base font-medium truncate">
                                    {receiverAccountName}
                                </p>
                            </div>
                        </div>

                        {/* Account Number */}
                        <div
                            className="p-3 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4"
                            style={{ backgroundColor: '#2a2520' }}
                        >
                            <CreditCard className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#b68938' }} />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-400">Account Number</p>
                                <p className="text-white text-sm sm:text-base font-mono font-medium break-all">
                                    {receiverAccountNumber}
                                </p>
                            </div>
                        </div>

                        {/* Transaction ID */}
                        <div
                            className="p-3 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4"
                            style={{ backgroundColor: '#2a2520' }}
                        >
                            <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#b68938' }} />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-400">Transaction ID</p>
                                <p className="text-white text-sm sm:text-base font-mono font-medium break-all">
                                    TXN1234567890
                                </p>
                            </div>
                        </div>

                        {/* Date */}
                        <div
                            className="p-3 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4"
                            style={{ backgroundColor: '#2a2520' }}
                        >
                            <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#b68938' }} />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-400">Date & Time</p>
                                <p className="text-white text-sm sm:text-base font-medium">
                                    {/* {transactionData.date} */}
                                    {new Date().toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {description && (
                            <div
                                className="p-3 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4"
                                style={{ backgroundColor: '#2a2520' }}
                            >
                                <DollarSign className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#b68938' }} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm text-gray-400">Description</p>
                                    <p className="text-white text-sm sm:text-base">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <Button
                            onPress={handleDownloadReceipt}
                            variant="bordered"
                            className="h-10 sm:h-11 text-sm sm:text-base font-semibold"
                            style={{ borderColor: '#b68938', color: '#b68938' }}
                            startContent={<Download className="w-4 h-4" />}
                        >
                            Receipt
                        </Button>
                        <Button
                            onPress={handleShare}
                            variant="bordered"
                            className="h-10 sm:h-11 text-sm sm:text-base font-semibold"
                            style={{ borderColor: '#b68938', color: '#b68938' }}
                            startContent={<Share2 className="w-4 h-4" />}
                        >
                            Share
                        </Button>
                    </div>

                    <Button
                        onPress={handleDone}
                        className="w-full h-10 sm:h-11 text-sm sm:text-base text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{ background: 'linear-gradient(125deg, #e1ba73, #b68938)' }}
                        startContent={<Home className="w-4 h-4" />}
                    >
                        Back to Dashboard
                    </Button>
                </div>

                {/* Help Text */}
                <p className="text-center text-xs sm:text-sm text-gray-500">
                    Need help? Contact support at support@yourbank.com
                </p>
            </div>
        </div>
    );
}