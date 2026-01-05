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
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientText } from '../features/verification/components/ui/GradientText';
import { GlassCard } from '../features/verification/components/ui/GlassCard';
import { useSRKFileUpload } from '@srk/shared/hooks';
import { api } from '../lib/api';
import useGrowAuthStore from '../store/useGrowAuthStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resubmitGrowVerificationSchema } from '@srk/shared/contracts';
import { z } from 'zod';
import { useToast } from '../lib/contexts/ToastContext';

type TResubmitForm = z.infer<typeof resubmitGrowVerificationSchema>;

export const UserVerificationPage = () => {
  const navigate = useNavigate();
  const { user: storeUser, logout } = useGrowAuthStore();
  const toast = useToast();
  // const [kycFiles, setKycFiles] = useState<File[]>([]);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const { uploadFile, isUploading: isUploadingFiles } =
    useSRKFileUpload('grow-resubmission');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<TResubmitForm>({
    resolver: zodResolver(resubmitGrowVerificationSchema),
  });

  // API Hooks
  const { data: profileData, refetch, isLoading } = api.grow.getSrkGrowProfile.useQuery(
    ['growProfile', storeUser?._id],
    storeUser?._id ? { params: { userId: storeUser._id } } : ({} as any),
    {
      queryKey: ['growProfile', storeUser?._id],
      enabled: !!storeUser?._id,
      refetchOnWindowFocus: true,
    }
  );

  const user = profileData?.status === 200 ? profileData.body : null;

  const resubmitMutation = api.grow.resubmitGrowVerification.useMutation({
    onSuccess: (data) => {
      if (data.status === 200) {
        toast.success('Resubmission successful!');
        refetch();
        // setKycFiles([]);
        setPaymentProof(null);
        reset();
      } else {
        toast.error(data.body.message || 'Resubmission failed');
      }
    },
    onError: (error: any) => {
      console.error('Resubmission error:', error);
      toast.error(
        error?.body?.message || 'An error occurred during resubmission.'
      );
    },
  });

  // Sync profile data to local state
  useEffect(() => {
    if (user?.userDetails) {
      const updatedUser = user.userDetails;
      const payment = user.enrollmentData?.enrollmentPaymentDetails;

      if (updatedUser._id) setValue('userId', updatedUser._id);
      if (payment?.transactionId)
        setValue('transactionId', payment.transactionId);
      if (payment?.paymentUrl) setValue('paymentURL', payment.paymentUrl);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (!storeUser) {
      navigate('/login');
      return;
    }

    if (storeUser.status === 'portalActivated') {
      navigate('/dashboard');
    }
  }, [storeUser, navigate]);

  // const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const newFiles = Array.from(e.target.files);
  //     setKycFiles((prev) => [...prev, ...newFiles]);
  //   }
  // };

  // const removeNewFile = (index: number) => {
  //   setKycFiles((prev) => prev.filter((_, i) => i !== index));
  // };

  // const removeCurrentDoc = (index: number) => {
  //   const updatedDocs = currentKycDocs.filter((_, i) => i !== index);
  //   setCurrentKycDocs(updatedDocs);
  //   setValue('kycURLs', updatedDocs);
  // };

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const onFormSubmit = async (data: TResubmitForm) => {
    if (!user) return;

    // if (currentKycDocs.length === 0 && kycFiles.length === 0) {
    //   toast.error('Please provide at least one KYC document.');
    //   return;
    // }

    try {
      // 1. Upload new KYC files
      // let newKycUrls: string[] = [];
      // for (const file of kycFiles) {
      //   const { url } = await uploadFile(file, 'image');
      //   newKycUrls.push(url);
      // }

      // 2. Upload new Payment Proof if changed
      let finalPaymentUrl = data.paymentURL;
      if (paymentProof) {
        const { url } = await uploadFile(paymentProof, 'image');
        finalPaymentUrl = url;
      }

      // 3. Combine
      // const totalKycUrls = [...currentKycDocs, ...newKycUrls];

      // 4. Call Backend
      resubmitMutation.mutate({
        body: {
          userId: user.userDetails._id || "",
          kycURLs: [],
          transactionId: data.transactionId,
          paymentURL: finalPaymentUrl,
        },
      });
    } catch (error) {
      console.error('Resubmission failed', error);
      toast.error('Failed to upload documents. Please try again.');
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

        {isLoading ? (
          <GlassCard className="max-w-xl mx-auto text-center py-12 px-8">
            <div className="text-white">Loading verification status...</div>
          </GlassCard>
        ) : !user ? (
          <GlassCard className="max-w-xl mx-auto text-center py-12 px-8">
            <div className="text-white">Unable to load user data</div>
          </GlassCard>
        ) : user.userDetails.status === 'verificationPending' ? (
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
        ) : user.userDetails.status === 'verificationRejected' ? (
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
                    {user.enrollmentData?.enrollmentPaymentDetails
                      ?.rejectionReason ||
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

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-widest"
                >
                  <ExternalLink size={16} />
                  Back to Home
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-widest"
                >
                  <X size={16} />
                  Logout
                </button>
              </div>
            </div>

            <div className="lg:col-span-3">
              <GlassCard>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Update Verification
                </h3>
                <form
                  onSubmit={handleSubmit(onFormSubmit)}
                  className="space-y-6"
                >
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
                        {...register('transactionId')}
                        type="text"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border ${errors.transactionId
                          ? 'border-red-500'
                          : 'border-white/10'
                          } text-white focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all`}
                        placeholder="Original: 123XYZ..."
                        required
                      />
                    </div>
                    {errors.transactionId && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.transactionId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                      Payment Screenshot
                    </label>

                    {!paymentProof && watch('paymentURL') && (
                      <div className="mb-3 relative group rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={watch('paymentURL')}
                          alt="Current Proof"
                          className="w-full h-32 object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-2">
                          <span className="bg-black/60 px-3 py-1 rounded-full text-xs text-white backdrop-blur-sm border border-white/10">
                            Current Upload
                          </span>
                          <a
                            href={watch('paymentURL')}
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
                            : watch('paymentURL')
                              ? 'Change screenshot'
                              : 'Select screenshot'}
                        </span>
                        <Upload size={18} className="text-gray-500" />
                      </label>
                    </div>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                      KYC Documents
                    </label>

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
                  </div> */}

                  <button
                    type="submit"
                    disabled={isUploadingFiles || resubmitMutation.isPending}
                    className="w-full py-4 rounded-xl font-bold uppercase tracking-widest bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_20px_rgba(182,137,56,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isUploadingFiles || resubmitMutation.isPending ? (
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
        ) : null}
      </div>
    </div>
  );
};
