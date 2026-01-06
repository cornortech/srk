import React from 'react';
import DashboardGradientText from '../components/ui/DashboardGradientText';
import { DashboardGlassCard } from '../components/ui/DashboardGlassCard';
import { motion } from 'framer-motion';
import {
  Camera,
  Check,
  CheckCircle,
  Crown,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Clock,
} from 'lucide-react';
import DashboardStatusBadge from '../components/ui/DashboardStatusBadge';
import MagneticButton from '../components/ui/DashboardMagneticButton';

interface VerificationViewProps {
  isApproved: boolean;
  setShowVerification: (show: boolean) => void;
  hasPurchased: boolean;
  setHasPurchased: (purchased: boolean) => void;
  addNotification: (message: string, type: 'success') => void;
  kycStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  isApproved,
  setShowVerification,
  hasPurchased,
  setHasPurchased,
  addNotification,
  kycStatus,
  rejectionReason,
}: VerificationViewProps) => {
  const getVerificationContent = () => {
    switch (kycStatus) {
      case 'approved':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-3"
          >
            <CheckCircle size={20} className="text-emerald-400" />
            <span className="text-sm text-emerald-300">
              Your identity has been verified! All features are now unlocked.
            </span>
          </motion.div>
        );
      
      case 'rejected':
        return (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/20"
            >
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm text-rose-300 font-semibold block mb-1">
                    Verification Rejected
                  </span>
                  {rejectionReason && (
                    <p className="text-sm text-rose-300/80">
                      Reason: {rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
            <MagneticButton
              onClick={() => setShowVerification(true)}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                <Camera size={18} />
                Retry Verification
              </span>
            </MagneticButton>
          </div>
        );
      
      case 'pending':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20"
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Clock size={20} className="text-amber-400 flex-shrink-0" />
              </motion.div>
              <div>
                <span className="text-sm text-amber-300 font-semibold block mb-1">
                  Verification Under Review
                </span>
                <p className="text-sm text-amber-300/80">
                  Your verification documents are being reviewed by our team. This usually takes 24-48 hours. You'll be notified once the review is complete.
                </p>
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return (
          <MagneticButton
            onClick={() => setShowVerification(true)}
            className="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              <Camera size={18} />
              Start Verification
            </span>
          </MagneticButton>
        );
    }
  };

  return (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold text-white mb-2">
        <DashboardGradientText>Account Verification</DashboardGradientText>
      </h1>
      <p className="text-zinc-400">
        Complete verification to unlock all earning features
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      {/* Identity Verification Card */}
      <DashboardGlassCard hover>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="w-12 h-12 rounded-xl bg-linear-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center"
              >
                <ShieldCheck size={24} className="text-amber-400" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Identity Verification
                </h3>
                <p className="text-sm text-zinc-400">Required for earning</p>
              </div>
            </div>
            <DashboardStatusBadge
              status={kycStatus === 'approved' ? 'Verified' : kycStatus === 'rejected' ? 'Rejected' : 'Pending'}
              pulse={kycStatus === 'pending'}
            />
          </div>

          <p className="text-zinc-400 mb-6">
            Verify your identity to access tasks, analytics, leaderboard, and
            coin exchange features. Upload a government-issued ID document for
            verification.
          </p>

          {getVerificationContent()}
        </div>
      </DashboardGlassCard>

      {/* SRK Grow Package Card (Only shows after verification) */}
      {isApproved && (
        <DashboardGlassCard
          hover
          gradient="purple"
          className="relative overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-pink-500/5" />

          <div className="p-8 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="w-12 h-12 rounded-xl bg-linear-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center"
                >
                  <Crown size={24} className="text-purple-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    SRK Grow Package
                  </h3>
                  <p className="text-sm text-zinc-400">Premium features</p>
                </div>
              </div>
              <DashboardStatusBadge
                status={hasPurchased ? 'Active' : 'Available'}
              />
            </div>

            <ul className="space-y-3 mb-6">
              {[
                'Profile customization & social links',
                'Request custom promotion tasks',
                'Higher commission rates (up to 30% more)',
                'Priority support & faster verification',
                'Advanced analytics dashboard',
                'Exclusive leaderboard badges',
                'Early access to new features',
                'Custom task scheduling',
              ].map((feature, idx) => (
                <motion.li
                  key={feature}
                  className="flex items-center gap-2 text-zinc-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Check size={16} className="text-purple-400" />
                  {feature}
                </motion.li>
              ))}
            </ul>

            <div className="flex items-center justify-between mb-6">
              <span className="text-zinc-400">One-time payment</span>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl font-bold text-purple-400"
              >
                Rs. 999
              </motion.div>
            </div>

            {!hasPurchased ? (
              <MagneticButton
                onClick={() => {
                  setHasPurchased(true);
                  addNotification(
                    'SRK Grow Package activated successfully!',
                    'success'
                  );
                }}
                variant="premium"
                className="w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <Crown size={18} />
                  Purchase Package
                </span>
              </MagneticButton>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 flex items-center gap-3"
              >
                <Sparkles size={20} className="text-purple-400" />
                <span className="text-sm text-purple-300">
                  Package active! Check Profile tab for premium features.
                </span>
              </motion.div>
            )}
          </div>
        </DashboardGlassCard>
      )}
    </div>

    {/* Progress indicator */}
    {!isApproved && (
      <DashboardGlassCard className="mt-8">
        <div className="p-6">
          <h4 className="text-lg font-bold text-white mb-4">
            Verification Progress
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">
                Step 1: Identity Verification
              </span>
              <DashboardStatusBadge
                status={isApproved ? 'Completed' : 'Pending'}
                small
              />
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-div-to-r from-amber-500 to-yellow-500"
                initial={{ width: '0%' }}
                animate={{ width: isApproved ? '50%' : '0%' }}
                transition={{ duration: 1 }}
              />
            </div>

            <div className="flex items-center justify-between opacity-50">
              <span className="text-zinc-400">Step 2: SRK Grow Package</span>
              <DashboardStatusBadge
                status={hasPurchased ? 'Completed' : 'Locked'}
                small
              />
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-div-to-r from-purple-500 to-pink-500"
                initial={{ width: '0%' }}
                animate={{
                  width: hasPurchased ? '100%' : isApproved ? '50%' : '0%',
                }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </DashboardGlassCard>
    )}
  </div>
  );
};