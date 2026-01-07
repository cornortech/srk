import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserDetails } from '../types/types';
import { useSRKFileUpload } from '@srk/shared/hooks';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: UserDetails;
  packagePrice: string;
  packageName: string;
  onSubmit: (data: {
    transactionId: string;
    paymentProofUrl: string;
    paymentMethod: string;
  }) => Promise<void>;
}

type PaymentMethod = 'esewa' | 'khalti' | 'bank' | null;

const PaymentModel: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  userDetails,
  packagePrice,
  packageName,
  onSubmit,
}) => {
  const [step, setStep] = useState<'payment' | 'success'>('payment');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { uploadFile } = useSRKFileUpload('grow');
  const paymentMethods = [
    {
      id: 'esewa' as PaymentMethod,
      name: 'eSewa',
      icon: '🟢',
      description: 'Pay with eSewa wallet',
      color: 'from-green-600 to-green-700',
    },
    {
      id: 'khalti' as PaymentMethod,
      name: 'Khalti',
      icon: '🟣',
      description: 'Pay with Khalti wallet',
      color: 'from-purple-600 to-purple-700',
    },
    {
      id: 'bank' as PaymentMethod,
      name: 'Bank Transfer',
      icon: '🏦',
      description: 'Direct bank transfer',
      color: 'from-blue-600 to-blue-700',
    },
  ];

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (!selectedMethod || !transactionId || !screenshot) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      const { url } = await uploadFile(screenshot, 'image');

      await onSubmit({
        transactionId,
        paymentProofUrl: url,
        paymentMethod: selectedMethod,
      });

      setStep('success');
    } catch (error: any) {
      console.error('Payment submission failed', error);
      const msg =
        error?.body?.message ||
        error?.message ||
        'Failed to process payment. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('payment');
    setSelectedMethod(null);
    setTransactionId('');
    setScreenshot(null);
    setScreenshotPreview('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative max-w-[90vw]  sm:max-w-3xl bg-[#1a1410] rounded-3xl border border-[#b68938]/30 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-black/40 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto no-scrollbar p-2 sm:p-6">
              {/* Payment Form */}
              {step === 'payment' && (
                <div className="p-8 pt-12">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      Complete Your Payment
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Select payment method and provide transaction details
                    </p>
                  </div>

                  {/* Total Amount Box */}
                  <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-[#b68938]/10 border border-[#b68938]/30">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-lg">
                        Total Amount:
                      </span>
                      <span className="text-2xl sm:text-4xl font-bold text-[#b68938]">
                        {packagePrice}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-8">
                    <label className="block text-sm sm:text-base font-bold text-gray-400 mb-4 uppercase tracking-widest">
                      Select Payment Method *
                    </label>
                    <div className="space-y-4 sm:space-y-3">
                      {paymentMethods.map((method) => (
                        <motion.button
                          key={method.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`w-full p-5 rounded-xl border-2 transition-all ${
                            selectedMethod === method.id
                              ? 'border-[#b68938] bg-[#b68938]/10'
                              : 'border-white/10 bg-white/5 hover:border-[#b68938]/50'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}
                            >
                              {method.icon}
                            </div>
                            <div className="flex-1 text-left">
                              <h3
                                className={`text-sm sm:text-lg font-bold transition-colors ${
                                  selectedMethod === method.id
                                    ? 'text-[#b68938]'
                                    : 'text-white'
                                }`}
                              >
                                {method.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-400">
                                {method.description}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedMethod === method.id
                                  ? 'border-[#b68938] bg-[#b68938]'
                                  : 'border-white/30'
                              }`}
                            >
                              {selectedMethod === method.id && (
                                <div className="w-3 h-3 rounded-full bg-black"></div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Instructions */}
                  {selectedMethod && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 p-4 sm:p-5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-sm sm:text-base"
                    >
                      <h4 className="font-bold text-white mb-2">
                        Payment Instructions:
                      </h4>
                      <ol className="text-sm sm:text-base text-gray-300 space-y-1 list-decimal list-inside">
                        <li>
                          Open your{' '}
                          {
                            paymentMethods.find((m) => m.id === selectedMethod)
                              ?.name
                          }{' '}
                          app
                        </li>
                        <li>
                          Send{' '}
                          <strong className="text-[#b68938]">
                            {packagePrice}
                          </strong>{' '}
                          to our account
                        </li>
                        <li>Take a screenshot of the transaction</li>
                        <li>Upload the screenshot below</li>
                        <li>Enter your transaction ID</li>
                      </ol>
                    </motion.div>
                  )}

                  {/* Screenshot Upload */}
                  <div className="mb-6">
                    <label className="block text-sm sm:text-base font-bold text-gray-400 mb-3 uppercase tracking-widest">
                      Upload Payment Screenshot *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden"
                        id="screenshot-upload"
                      />
                      <label
                        htmlFor="screenshot-upload"
                        className="block w-full p-4 sm:p-6  rounded-xl border-2 border-dashed border-white/20 hover:border-[#b68938]/50 bg-white/5 cursor-pointer transition-all group"
                      >
                        {screenshotPreview ? (
                          <div className="flex items-center space-x-4">
                            <img
                              src={screenshotPreview}
                              alt="Screenshot preview"
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-[#b68938]/30"
                            />
                            <div className="flex-1">
                              <p className="text-white font-bold mb-1">
                                {screenshot?.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-400">
                                Click to change image
                              </p>
                            </div>
                            <CheckCircle size={24} className="text-green-500" />
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload
                              size={32}
                              className="mx-auto mb-2 text-gray-400 group-hover:text-[#b68938] transition-colors"
                            />
                            <p className="text-white font-bold mb-1 text-sm sm:text-base">
                              Click to upload screenshot
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400">
                              PNG, JPG up to 10MB
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Transaction ID Input */}
                  <div className="mb-4">
                    <label className="block text-sm sm:text-base  font-bold text-gray-400 mb-3 uppercase tracking-widest">
                      Transaction ID / Reference Number *
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter your transaction ID"
                      className="w-full  px-4 py-3 sm:py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-2 focus:ring-[#b68938]/50 transition-all text-sm sm:text-lg"
                    />
                    <p className="mt-2 text-xs sm:text-sm text-gray-500">
                      This can be found in your transaction receipt or
                      confirmation message
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                      <p className="text-sm text-red-500 text-center font-medium">
                        {errorMessage}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={
                      !selectedMethod ||
                      !transactionId ||
                      !screenshot ||
                      isProcessing
                    }
                    className="w-full  py-4 sm:py-5 rounded-full font-bold text-sm sm:text-lg uppercase tracking-widest transition-all bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_40px_rgba(182,137,56,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center space-x-2">
                        <span className="animate-spin">⏳</span>
                        <span>Processing Payment...</span>
                      </span>
                    ) : (
                      'Place Order'
                    )}
                  </motion.button>

                  <p className="mt-2 sm:mt-4 text-center text-xs sm:text-sm text-gray-500">
                    Your order will be verified within 24 hours after payment
                    confirmation
                  </p>
                </div>
              )}

              {/* Success Screen */}
              {step === 'success' && (
                <div className="p-4 sm:p-8 text-center pt-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6  rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center"
                  >
                    <CheckCircle size={48} className="text-white" />
                  </motion.div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Order Placed Successfully!
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base mb-8">
                    Your payment is being verified
                  </p>

                  <div className="space-y-4 sm:space-y-6 mb-8">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
                      <h3 className="text-lg font-bold text-white mb-4">
                        Order Details
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Order ID:</span>
                          <span className="font-mono text-white">
                            #ORD{Date.now().toString().slice(-8)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Package:</span>
                          <span className="text-white font-bold">
                            {packageName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Platform:</span>
                          <span className="text-white capitalize">
                            {userDetails.platform}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white capitalize">
                            {userDetails.engagementType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Method:</span>
                          <span className="text-white capitalize">
                            {selectedMethod}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Transaction ID:</span>
                          <span className="font-mono text-white text-sm">
                            {transactionId}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-white/10 pt-2 sm:pt-3">
                          <span className="text-gray-400">Amount Paid:</span>
                          <span className="text-2xl font-bold text-[#b68938]">
                            {packagePrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                      <p className="text-sm text-green-400">
                        ✅ A confirmation email has been sent to{' '}
                        <strong>{userDetails.email}</strong>
                      </p>
                    </div>

                    <div className="p-3 sm:p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                      <p className="text-sm text-yellow-400">
                        ⏳ Your payment will be verified within 24 hours. We'll
                        notify you once confirmed.
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="w-full  py-4 sm:py-5 rounded-full font-bold text-sm sm:text-lg uppercase tracking-widest transition-all bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_40px_rgba(182,137,56,0.6)]"
                  >
                    Done
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
};

export default PaymentModel;
