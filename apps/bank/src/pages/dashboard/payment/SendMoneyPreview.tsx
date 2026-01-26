import { useNavigate, Link } from "react-router-dom";
import { Button, Card, CardHeader, CardBody } from "@nextui-org/react";
import { ArrowLeft, Send, User, CreditCard, DollarSign, FileText } from "lucide-react";
import useSendMoneyStore from "../../../store/useSendMoneyStore";

export default function SendMoneyPreviewPage() {

    const navigate = useNavigate();

    const { amount, description, receiverAccountName, receiverAccountNumber } = useSendMoneyStore();

    const handleConfirm = () => {
        navigate("/bank/dashboard/send-money/pin");
    };

    if (!amount || !receiverAccountName || !receiverAccountNumber) {
        return (
            <div className="min-h-screen w-full bg-black mt-32 flex items-center justify-center p-4">
                <div className="text-center">
                    <div
                        className="w-8 h-8 rounded-full border-2 mx-auto mb-4 animate-spin"
                        style={{
                            borderColor: '#b68938',
                            borderTopColor: 'transparent'
                        }}
                    />
                    <p className="text-white text-sm sm:text-base">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full mt-32 bg-black p-4 sm:p-6">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6">
                    <Link to="/bank/dashboard/send-money">
                        <Button 
                            variant="light" 
                            isIconOnly 
                            className="text-white hover:opacity-80"
                        >
                            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Button>
                    </Link>
                    <h1 className="text-lg sm:text-xl font-bold text-white">Review Transfer</h1>
                </div>

                {/* Transaction Details */}
                <Card className="bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 rounded-2xl mb-4 sm:mb-6">
                    <CardHeader className="pb-3 sm:pb-4" style={{borderBottom: '1px solid rgba(182, 137, 56, 0.2)'}}>
                        <div className="flex items-center gap-2 sm:gap-3 text-white">
                            <Send size={20} style={{color: '#b68938'}} />
                            <span className="text-sm sm:text-base font-semibold">Transaction Details</span>
                        </div>
                    </CardHeader>

                    <CardBody className="space-y-3 sm:space-y-4 pt-4">
                        {/* To */}
                        <div 
                            className="p-3 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4" 
                            style={{backgroundColor: '#2a2520'}}
                        >
                            <User className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#b68938'}} />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-400">To</p>
                                <p className="text-white text-sm sm:text-base font-medium truncate">{receiverAccountName}</p>
                            </div>
                        </div>

                        {/* Account Number */}
                        <div 
                            className="p-3 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4" 
                            style={{backgroundColor: '#2a2520'}}
                        >
                            <CreditCard className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#b68938'}} />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-400">Account Number</p>
                                <p className="text-white text-sm sm:text-base font-mono font-medium break-all">{receiverAccountNumber}</p>
                            </div>
                        </div>

                        {/* Amount */}
                        <div 
                            className="p-3 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4" 
                            style={{backgroundColor: '#2a2520'}}
                        >
                            <DollarSign className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#b68938'}} />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-400">Amount</p>
                                <p className="text-white text-lg sm:text-xl font-bold">
                                    ${amount.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {description && (
                            <div 
                                className="p-3 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4" 
                                style={{backgroundColor: '#2a2520'}}
                            >
                                <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#b68938'}} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm text-gray-400">Description</p>
                                    <p className="text-white text-sm sm:text-base">{description}</p>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Alert */}
                <div 
                    className="p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 flex items-start gap-3 text-xs sm:text-sm backdrop-blur-sm"
                    style={{
                        backgroundColor: '#b68938/10',
                        borderColor: '#b68938/40',
                        border: '1px solid rgba(182, 137, 56, 0.4)',
                        color: '#b68938'
                    }}
                >
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p>
                        Please review the details carefully. This transaction cannot be reversed once completed.
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-2 sm:space-y-3">
                    <Button 
                        onPress={handleConfirm} 
                        className="w-full h-10 mb-2 sm:h-11 text-sm sm:text-base text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{background: 'linear-gradient(125deg, #e1ba73, #b68938)'}}
                    >
                        Confirm Transfer
                    </Button>

                    <Link to="/bank/dashboard/send-money" className="w-full">
                        <Button 
                            variant="bordered" 
                            className="w-full h-10 sm:h-11 text-sm sm:text-base font-semibold"
                            style={{borderColor: '#b68938', color: '#b68938'}}
                        >
                            Edit Details
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}