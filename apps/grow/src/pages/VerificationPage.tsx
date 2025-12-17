import { useState, useEffect } from 'react';
import {
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Upload,
  X,
  FileText,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientText } from '../features/verification/components/ui/GradientText';
import { GlassCard } from '../features/verification/components/ui/GlassCard';
import { UserData } from '../lib/types/types';
import { useSRKFileUpload } from '@srk/shared/hooks';

export const GrowVerificationPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [kycFiles, setKycFiles] = useState<File[]>([]);
  const [transactionId, setTransactionId] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const { uploadFile, isUploading } = useSRKFileUpload('grow-resubmission');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('srkgrow-activesession');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.transactionId) {
        setTransactionId(parsedUser.transactionId);
      }
      if (parsedUser.kycStatus === 'approved') {
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setKycFiles(Array.from(e.target.files));
    }
  };

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      // 1. Upload new files if present
      let kycUrls: string[] = [];
      if (kycFiles.length > 0) {
        // Mocking multi-upload sequential for simplicity using the hook
        // Ideally usePromise.all
        for (const file of kycFiles) {
          const { url } = await uploadFile(file, 'image');
          kycUrls.push(url);
        }
      }

      let paymentUrl = '';
      if (paymentProof) {
        const { url } = await uploadFile(paymentProof, 'image');
        paymentUrl = url;
      }

      // 2. Mock Backend Update
      // In real app: await api.updateVerification(user.id, { ... })

      const updatedUser: UserData = {
        ...user,
        kycStatus: 'pending',
        // In a real scenario we'd update these fields on the backend
      };

      localStorage.setItem(
        'srkgrow-activesession',
        JSON.stringify(updatedUser)
      );
      setUser(updatedUser);
      setKycFiles([]);
      setPaymentProof(null);
      setTransactionId('');
    } catch (error) {
      console.error('Resubmission failed', error);
      alert('Failed to resubmit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0705] to-black text-white flex items-center justify-center p-4">
      {/* Background Ambience */}
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

        {user.kycStatus === 'pending' && (
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
                  localStorage.removeItem('srkgrow-activesession');
                  navigate('/');
                }}
                className="text-gray-500 hover:text-white transition-colors text-sm underline"
              >
                Logout
              </button>
            </div>
          </GlassCard>
        )}

        {user.kycStatus === 'rejected' && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Status Panel */}
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
                    {/* Mock Reason */}
                    "One or more documents were blurry or invalid. Payment
                    screenshot transaction ID did not match."
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

            {/* Resubmission Form */}
            <div className="lg:col-span-3">
              <GlassCard>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Update Verification
                </h3>
                <form onSubmit={handleResubmit} className="space-y-6">
                  {/* Transaction ID */}
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

                  {/* Payment Screenshot */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                      Update Payment Screenshot
                    </label>

                    {/* Existing Proof Preview */}
                    {!paymentProof && user.paymentProofUrl && (
                      <div className="mb-3 relative group rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={user.paymentProofUrl}
                          alt="Current Proof"
                          className="w-full h-32 object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-black/60 px-3 py-1 rounded-full text-xs text-white backdrop-blur-sm border border-white/10">
                            Current Upload
                          </span>
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
                            : user.paymentProofUrl
                            ? 'Change screenshot'
                            : 'Select screenshot'}
                        </span>
                        <Upload size={18} className="text-gray-500" />
                      </label>
                    </div>
                  </div>

                  {/* KYC Docs */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                      Re-upload KYC Documents
                    </label>

                    {/* Existing KYC List */}
                    {user.kycDocuments &&
                      user.kycDocuments.length > 0 &&
                      kycFiles.length === 0 && (
                        <div className="mb-3 space-y-2">
                          {user.kycDocuments.map((doc: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <FileText
                                  size={16}
                                  className="text-gray-500 flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-sm text-gray-300 truncate">
                                    {doc.name}
                                  </p>
                                  <p className="text-xs text-red-400">
                                    Marked as Invalid
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <p className="text-xs text-gray-500 italic mt-1">
                            * Uploading new files will replace these.
                          </p>
                        </div>
                      )}

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
                          {kycFiles.length > 0
                            ? `${kycFiles.length} new files selected`
                            : 'Select new documents'}
                        </span>
                        <Upload size={18} className="text-gray-500" />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading || isSubmitting}
                    className="w-full py-4 rounded-xl font-bold uppercase tracking-widest bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_20px_rgba(182,137,56,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isUploading || isSubmitting ? (
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
