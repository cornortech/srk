import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody } from "@nextui-org/react";
import { XCircle, RefreshCw, Home, AlertTriangle, User, CreditCard, DollarSign, Calendar } from "lucide-react";

export default function SendMoneyFailurePage() {
    const navigate = useNavigate();
    // Dummy data , it would come from props/data in real 
    const transactionData = {
        amount: 100,
        description: "Test payment",
        receiverAccountName: "John Doe",
        receiverAccountNumber: "1234567890",
        failureReason: "Insufficient funds in your account",
        errorCode: "ERR_" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    const handleTryAgain = () => {
        navigate("/bank/dashboard/send-money");
    };

    const handleBackToDashboard = () => {
        navigate("/bank/dashboard");
    };

    return (
        <div className="min-h-screen w-full bg-black p-4 sm:p-6">
            <div className="max-w-md mx-auto">
                {/* Failure Animation */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 animate-pulse"
                        style={{
                            background: 'linear-gradient(125deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))',
                            border: '2px solid #ef4444'
                        }}
                    >
                        <XCircle className="w-10 h-10 sm:w-12 sm:h-12" style={{color: '#ef4444'}} />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Transfer Failed</h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Your transaction could not be completed
                    </p>
                </div>

                {/* Error Information */}
                <Card className="bg-[#1a1a1a] border border-red-500/40 shadow-2xl shadow-red-500/10 rounded-2xl mb-4 sm:mb-6">
                    <CardBody className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                        {/* Error Message - Highlighted */}
                        <div 
                            className="p-4 sm:p-5 rounded-xl"
                            style={{
                                background: 'linear-gradient(125deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                                border: '1px solid rgba(239, 68, 68, 0.3)'
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#ef4444'}} />
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-400 mb-1">Reason</p>
                                    <p className="text-sm sm:text-base text-red-400 font-medium">
                                        {transactionData.failureReason}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Error Code */}
                        <div 
                            className="p-3 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4" 
                            style={{backgroundColor: '#2a2520'}}
                        >
                            <div className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center rounded-full"
                                style={{backgroundColor: 'rgba(239, 68, 68, 0.2)'}}
                            >
                                <span className="text-xs font-bold" style={{color: '#ef4444'}}>#</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-400">Error Code</p>
                                <p className="text-white text-sm sm:text-base font-mono font-medium">
                                    {transactionData.errorCode}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Transaction Details */}
                <Card className="bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 rounded-2xl mb-4 sm:mb-6">
                    <CardBody className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                        <div className="pb-2" style={{borderBottom: '1px solid rgba(182, 137, 56, 0.2)'}}>
                            <p className="text-xs sm:text-sm font-semibold" style={{color: '#b68938'}}>
                                Attempted Transaction Details
                            </p>
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
                                    ${transactionData.amount.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Recipient */}
                        <div 
                            className="p-3 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4" 
                            style={{backgroundColor: '#2a2520'}}
                        >
                            <User className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#b68938'}} />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-400">To</p>
                                <p className="text-white text-sm sm:text-base font-medium truncate">
                                    {transactionData.receiverAccountName}
                                </p>
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
                                <p className="text-white text-sm sm:text-base font-mono font-medium break-all">
                                    {transactionData.receiverAccountNumber}
                                </p>
                            </div>
                        </div>

                        {/* Date */}
                        <div 
                            className="p-3 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4" 
                            style={{backgroundColor: '#2a2520'}}
                        >
                            <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#b68938'}} />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-400">Attempted At</p>
                                <p className="text-white text-sm sm:text-base font-medium">
                                    {transactionData.date}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Help Alert */}
                <div 
                    className="p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 flex items-start gap-3 text-xs sm:text-sm backdrop-blur-sm"
                    style={{
                        backgroundColor: 'rgba(182, 137, 56, 0.1)',
                        borderColor: 'rgba(182, 137, 56, 0.4)',
                        border: '1px solid rgba(182, 137, 56, 0.4)',
                        color: '#b68938'
                    }}
                >
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p>
                        If you continue to experience issues, please contact our support team for assistance.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3 mb-4">
                    <Button 
                        onPress={handleTryAgain}
                        className="w-full h-10 sm:h-11 text-sm sm:text-base text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{background: 'linear-gradient(125deg, #e1ba73, #b68938)'}}
                        startContent={<RefreshCw className="w-4 h-4" />}
                    >
                        Try Again
                    </Button>

                    <Button 
                        onPress={handleBackToDashboard}
                        variant="bordered"
                        className="w-full h-10 sm:h-11 text-sm sm:text-base font-semibold"
                        style={{borderColor: '#b68938', color: '#b68938'}}
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