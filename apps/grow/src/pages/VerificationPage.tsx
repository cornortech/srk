import { useState, useEffect } from 'react';
import {
  Shield,
  Clock,
  AlertTriangle,
  Upload,
  FileText,
  CreditCard,
  Loader2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientText } from '../features/verification/components/ui/GradientText';
import { GlassCard } from '../features/verification/components/ui/GlassCard';
import { useSRKFileUpload } from '@srk/shared/hooks';
import { api } from '../lib/api';
import useGrowAuthStore, { GrowUser } from '../store/useGrowAuthStore';

export const GrowVerificationPage = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useGrowAuthStore();
  const [kycFiles, setKycFiles] = useState<File[]>([]);
  const [currentKycDocs, setCurrentKycDocs] = useState<string[]>([]);
  const [transactionId, setTransactionId] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const { uploadFile, isUploading } = useSRKFileUpload('grow-resubmission');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Hooks
  const { data: profileData, refetch } = api.grow.getSrkGrowProfile.useQuery(
    ['growProfile', user?._id || ''],
    { params: { id: user?._id || '' } },
    {
      enabled: !!user?._id,
      refetchOnWindowFocus: true,
      queryKey: ['growProfile', user?._id || ''],
    }
  );

  const resubmitMutation = api.grow.resubmitGrowVerification.useMutation({
    onSuccess: (data) => {
      if (data.status === 200) {
        console.log('✅ Resubmission successful');
        refetch(); // Refresh profile to get updated status
        setKycFiles([]);
        setPaymentProof(null);
      } else {
        alert(data.body.message || 'Resubmission failed');
      }
    },
    onError: (error) => {
      console.error('Resubmission error:', error);
      alert('An error occurred during resubmission.');
    },
  });

  // Sync profile data to store and local state
  useEffect(() => {
    if (profileData?.status === 200) {
      const updatedUser = profileData.body.result;
      setUser({
        ...user!,
        status: updatedUser.status as any,
        rejectionReason: updatedUser.rejectionReason,
        kycURL: updatedUser.kycURL,
        phone: updatedUser.phone,
        country: updatedUser.country,
        createdAt: updatedUser.createdAt,
        transactionId: updatedUser.transactionId,
        paymentURL: updatedUser.paymentURL,
        paymentMethod: updatedUser.paymentMethod as any,
      });

      // Prefill fields
      if (updatedUser.transactionId)
        setTransactionId(updatedUser.transactionId);
      if (updatedUser.kycURL) {
        setCurrentKycDocs(
          Array.isArray(updatedUser.kycURL)
            ? updatedUser.kycURL
            : [updatedUser.kycURL]
        );
      }
    }
  }, [profileData, setUser]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.status === 'portalActivated') {
      navigate('/srk-grow/dashboard');
    }
  }, [user, navigate]);

  const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setKycFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeNewFile = (index: number) => {
    setKycFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeCurrentDoc = (index: number) => {
    setCurrentKycDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (currentKycDocs.length === 0 && kycFiles.length === 0) {
      alert('Please provide at least one KYC document.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload new KYC files
      let newKycUrls: string[] = [];
      for (const file of kycFiles) {
        const { url } = await uploadFile(file, 'image');
        newKycUrls.push(url);
      }

      // 2. Upload new Payment Proof if changed
      let finalPaymentUrl = user.paymentURL || '';
      if (paymentProof) {
        const { url } = await uploadFile(paymentProof, 'image');
        finalPaymentUrl = url;
      }

      // 3. Combine remaining current docs and new ones
      const totalKycUrls = [...currentKycDocs, ...newKycUrls];

      // 4. Call Backend API
      resubmitMutation.mutate({
        body: {
          userId: user._id,
          kycURLs: totalKycUrls,
          transactionId,
          paymentURL: finalPaymentUrl,
        },
      });
    } catch (error) {
      console.error('Resubmission failed', error);
      alert('Failed to upload documents. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0705] to-black text-white flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <GradientText>Account Verification</GradientText>
          </h1>
          <p className="text-gray-400">Manage your verification status</p>
        </div>

        {user.status === 'verificationPending' && (
          <GlassCard className="max-w-xl mx-auto text-center py-12 px-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Clock size={48} className="text-blue-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">
              Verification Pending
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Your documents are currently under review by our admin team. This
              process typically takes 24-48 hours. You will receive an email
              notification once your account is verified.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400">
              <Shield size={16} />
              <span>Secure Verification Process</span>
            </div>
            <div className="mt-8">
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="text-gray-500 hover:text-white transition-colors text-sm underline"
              >
                Logout
              </button>
            </div>
          </GlassCard>
        )}

        {user.status === 'verificationRejected' && (
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="border-red-500/30 bg-red-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle size={24} className="text-red-500" />
                  <h3 className="text-xl font-bold text-red-500">
                    Action Required
                  </h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Your verification application was rejected. Please review the
                  feedback and resubmit your documents.
                </p>
                <div className="p-4 rounded-xl bg-black/40 border border-red-500/20">
                  <span className="text-xs uppercase tracking-widest text-red-400 font-bold block mb-2">
                    Reason for Rejection
                  </span>
                  <p className="text-white text-sm">
                    {user.rejectionReason ||
                      'One or more documents were blurry or invalid.'}
                  </p>
                </div>
              </GlassCard>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-bold text-white mb-2">Need Help?</h4>
                <p className="text-xs text-gray-400">
                  Contact support@srk.com for assistance with your verification.
                </p>
              </div>
            </div>

            <div className="lg:col-span-3">
              <GlassCard>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Update Verification
                </h3>
                <form onSubmit={handleResubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                      Transaction ID
                    </label>
                    <div className="relative">
                      <CreditCard
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                        placeholder="Original: 123XYZ..."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                      Payment Screenshot
                    </label>

                    {!paymentProof && user.paymentURL && (
                      <div className="mb-3 relative group rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={user.paymentURL}
                          alt="Current Proof"
                          className="w-full h-32 object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-2">
                          <span className="bg-black/60 px-3 py-1 rounded-full text-xs text-white backdrop-blur-sm border border-white/10">
                            Current Upload
                          </span>
                          <a
                            href={user.paymentURL}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-white/10 rounded-full text-white hover:bg-[#b68938] transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="relative group cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePaymentProofChange}
                        className="hidden"
                        id="payment-upload"
                      />
                      <label
                        htmlFor="payment-upload"
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-[#b68938]/50 transition-all"
                      >
                        <span className="text-gray-400 truncate">
                          {paymentProof
                            ? paymentProof.name
                            : user.paymentURL
                            ? 'Change screenshot'
                            : 'Select screenshot'}
                        </span>
                        <Upload size={18} className="text-gray-500" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                      KYC Documents
                    </label>

                    {/* Current Documents */}
                    <div className="space-y-2 mb-4">
                      {currentKycDocs.map((url, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText size={16} className="text-[#b68938]" />
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-gray-300 truncate hover:text-[#b68938] underline"
                            >
                              Existing Document {idx + 1}
                            </a>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCurrentDoc(idx)}
                            className="p-1 text-gray-500 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}

                      {/* New Documents */}
                      {kycFiles.map((file, idx) => (
                        <div
                          key={`new-${idx}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-[#b68938]/10 border border-[#b68938]/30"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <Upload size={16} className="text-[#b68938]" />
                            <span className="text-sm text-white truncate">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewFile(idx)}
                            className="p-1 text-[#b68938] hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="relative group cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        multiple
                        onChange={handleKycFileChange}
                        className="hidden"
                        id="kyc-upload"
                      />
                      <label
                        htmlFor="kyc-upload"
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-[#b68938]/50 transition-all"
                      >
                        <span className="text-gray-400 truncate">
                          Add more documents
                        </span>
                        <Upload size={18} className="text-gray-500" />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isUploading || isSubmitting || resubmitMutation.isPending
                    }
                    className="w-full py-4 rounded-xl font-bold uppercase tracking-widest bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_20px_rgba(182,137,56,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isUploading ||
                    isSubmitting ||
                    resubmitMutation.isPending ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'submit for review'
                    )}
                  </button>
                </form>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
