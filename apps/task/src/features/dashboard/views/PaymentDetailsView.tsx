import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  AlertCircle,
  CheckCircle,
  Wallet,
  Clock,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';
import { useSRKFileUpload } from '@srk/shared/hooks';
import { getTaskAssetUrl } from '../../../lib/cdn';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface PaymentDetailsViewProps {
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void;
}

export const PaymentDetailsView: React.FC<PaymentDetailsViewProps> = ({
  addNotification,
}) => {
  const { taskUserID } = useTaskAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { uploadFile, isUploading } = useSRKFileUpload('task');

  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    branchName: '',
    qrCodeUrl: '',
  });

  const handleQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addNotification('Please select an image file', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        addNotification('Image size should be less than 5MB', 'error');
        return;
      }
      setQrFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeQrFile = () => {
    setQrFile(null);
    setQrPreview('');
    setFormData({ ...formData, qrCodeUrl: '' });
  };

  const { data: paymentDetailsData, refetch } =
    api.srkTask.getUserPaymentDetails.useQuery(
      ['getUserPaymentDetails', taskUserID],
      { params: { userId: taskUserID || '' } },
      {
        enabled: !!taskUserID,
        queryKey: ['getUserPaymentDetails', taskUserID || ''],
      }
    );

  const submitMutation = api.srkTask.submitPaymentDetailsRequest.useMutation({
    onSuccess: () => {
      addNotification(
        'Payment details submitted successfully! Awaiting admin approval.',
        'success'
      );
      setIsEditing(false);
      setFormData({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        branchName: '',
        qrCodeUrl: '',
      });
      setQrFile(null);
      setQrPreview('');
      setUploadProgress(0);
      refetch();
    },
    onError: (error: unknown) => {
      addNotification(
        (error as ApiError)?.response?.data?.message ||
          'Failed to submit payment details. Please try again.',
        'error'
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.accountHolderName ||
      !formData.bankName ||
      !formData.accountNumber ||
      !formData.branchName
    ) {
      addNotification('Please fill in all fields', 'error');
      return;
    }

    if (!qrFile && !formData.qrCodeUrl) {
      addNotification('Please upload a QR code image', 'error');
      return;
    }

    try {
      let qrCodeUrl = formData.qrCodeUrl;

      // Upload QR code if a new file is selected
      if (qrFile) {
        addNotification('Uploading QR code...', 'info');
        const { key } = await uploadFile(qrFile, 'image', (progress) => {
          setUploadProgress(progress);
        });
        qrCodeUrl = key;
      }

      // Submit to backend
      submitMutation.mutate({
        params: { userId: taskUserID || '' },
        body: {
          ...formData,
          qrCodeUrl,
        },
      });
    } catch (error) {
      console.error('QR upload error:', error);
      addNotification('Failed to upload QR code. Please try again.', 'error');
    }
  };

  const approvedDetails = paymentDetailsData?.body.approvedDetails;
  const pendingRequest = paymentDetailsData?.body.pendingRequest;
  const rejectedRequest = paymentDetailsData?.body.rejectedRequest;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B68938] to-[#E1BA73] flex items-center justify-center">
          <Wallet className="w-6 h-6 text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Payment Details</h2>
          <p className="text-gray-400">
            Manage your bank account and payment QR code
          </p>
        </div>
      </motion.div>

      {/* Rejected Request Notice */}
      {rejectedRequest && !pendingRequest && !approvedDetails && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-500 mb-2">
                Payment Details Rejected
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="font-medium">Account Holder:</span>{' '}
                  {rejectedRequest.accountHolderName}
                </p>
                <p>
                  <span className="font-medium">Bank:</span>{' '}
                  {rejectedRequest.bankName}
                </p>
                <p>
                  <span className="font-medium">Account Number:</span>{' '}
                  {rejectedRequest.accountNumber}
                </p>
                <p>
                  <span className="font-medium">Branch:</span>{' '}
                  {rejectedRequest.branchName}
                </p>
                {rejectedRequest.rejectionReason && (
                  <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400 font-medium text-sm">
                      Rejection Reason:
                    </p>
                    <p className="text-gray-300 mt-1">
                      {rejectedRequest.rejectionReason}
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Submitted on{' '}
                  {new Date(rejectedRequest.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 rounded-lg bg-[#B68938] hover:bg-[#E1BA73] text-black font-medium transition-colors"
              >
                Submit New Details
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pending Request Notice */}
      {pendingRequest && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
        >
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">
                Payment Details Under Review
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="font-medium">Account Holder:</span>{' '}
                  {pendingRequest.accountHolderName}
                </p>
                <p>
                  <span className="font-medium">Bank:</span>{' '}
                  {pendingRequest.bankName}
                </p>
                <p>
                  <span className="font-medium">Account Number:</span>{' '}
                  {pendingRequest.accountNumber}
                </p>
                <p>
                  <span className="font-medium">Branch:</span>{' '}
                  {pendingRequest.branchName}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Submitted on{' '}
                  {new Date(pendingRequest.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Approved Details Display */}
      {approvedDetails && !isEditing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
        >
          <div className="flex items-start gap-4 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-500 mb-4">
                Verified Payment Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Account Holder</p>
                  <p className="font-medium">{approvedDetails.accountHolderName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Bank Name</p>
                  <p className="font-medium">{approvedDetails.bankName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Account Number</p>
                  <p className="font-medium">{approvedDetails.accountNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400">Branch</p>
                  <p className="font-medium">{approvedDetails.branchName}</p>
                </div>
              </div>
              {approvedDetails.qrCodeUrl && (
                <div className="mt-4">
                  <p className="text-gray-400 mb-2">Payment QR Code</p>
                  <img
                    src={getTaskAssetUrl(approvedDetails.qrCodeUrl)}
                    alt="Payment QR"
                    className="w-48 h-48 rounded-lg border border-gray-700"
                  />
                </div>
              )}
            </div>
          </div>
          {!pendingRequest && !approvedDetails && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 rounded-lg bg-[#B68938] hover:bg-[#E1BA73] text-black font-medium transition-colors"
            >
              Update Payment Details
            </button>
          )}
        </motion.div>
      )}

      {/* Form for Adding/Editing */}
      {(!approvedDetails || isEditing) && !pendingRequest && (
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-[#B68938]" />
            <p className="text-sm text-gray-400">
              {approvedDetails
                ? 'Update your payment details. Changes require admin approval.'
                : 'Add your bank account and payment QR code to receive payouts.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Account Holder Name *
              </label>
              <input
                type="text"
                value={formData.accountHolderName}
                onChange={(e) =>
                  setFormData({ ...formData, accountHolderName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-[#B68938] focus:outline-none transition-colors"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-[#B68938] focus:outline-none transition-colors"
                placeholder="Example Bank Ltd."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Account Number *
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-[#B68938] focus:outline-none transition-colors"
                placeholder="1234567890"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Branch Name *
              </label>
              <input
                type="text"
                value={formData.branchName}
                onChange={(e) =>
                  setFormData({ ...formData, branchName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-[#B68938] focus:outline-none transition-colors"
                placeholder="Main Branch"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Payment QR Code *
              </label>
              
              {!qrPreview ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrFileChange}
                    className="hidden"
                    id="qr-upload"
                  />
                  <label
                    htmlFor="qr-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-[#B68938] transition-colors bg-black/30"
                  >
                    <ImageIcon className="w-12 h-12 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload QR code</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={qrPreview}
                    alt="QR Code Preview"
                    className="w-full max-w-xs mx-auto rounded-lg border border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={removeQrFile}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-[#B68938] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-center">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                Upload a clear QR code image for mobile payment apps
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitMutation.isPending || isUploading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#B68938] to-[#E1BA73] text-black font-semibold hover:shadow-lg hover:shadow-[#B68938]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isUploading 
                ? 'Uploading...' 
                : submitMutation.isPending 
                ? 'Submitting...' 
                : 'Submit for Review'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    accountHolderName: '',
                    bankName: '',
                    accountNumber: '',
                    branchName: '',
                    qrCodeUrl: '',
                  });
                  setQrFile(null);
                  setQrPreview('');
                  setUploadProgress(0);
                }}
                className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.form>
      )}

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20"
      >
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Important Information
        </h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>
              All payment details must be verified by admin before becoming active
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>
              Ensure all information is accurate to avoid payout delays
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>
              You can update your payment details anytime, but changes require
              re-verification
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>
              Upload a clear QR code image for mobile payment apps
            </span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};
