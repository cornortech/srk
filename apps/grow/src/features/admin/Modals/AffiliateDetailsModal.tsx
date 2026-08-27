import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import moment from 'moment';
import { getGrowAssetUrl } from '../../../lib/cdn';

interface AffiliateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  affiliateData: {
    _id: string;
    username: string;
    email: string;
    status: string;
    verificationImageUrl: string;
    createdAt: string;
    gender?: string;
    country?: string;
    phoneNumber?: string;
    profilePicture?: string;
    rejectionReason?: string;
  } | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isApproving?: boolean;
  selectedItemId?: string | null;
}

export const AffiliateDetailsModal = ({
  isOpen,
  onClose,
  affiliateData,
  onApprove,
  onReject,
  isApproving,
  selectedItemId,
}: AffiliateDetailsModalProps) => {
  if (!isOpen || !affiliateData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Affiliate Details
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Complete verification information
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Information */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>👤</span> User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {affiliateData.profilePicture && (
                <div className="col-span-2 flex justify-center">
                  <img
                    src={getGrowAssetUrl(affiliateData.profilePicture)}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
                  />
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400">Full Name</p>
                <p className="text-white font-medium">
                  {affiliateData.username}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-medium">{affiliateData.email}</p>
              </div>
              {affiliateData.phoneNumber && (
                <div>
                  <p className="text-sm text-gray-400">Phone Number</p>
                  <p className="text-white font-medium">
                    {affiliateData.phoneNumber}
                  </p>
                </div>
              )}
              {affiliateData.gender && (
                <div>
                  <p className="text-sm text-gray-400">Gender</p>
                  <p className="text-white font-medium">
                    {affiliateData.gender}
                  </p>
                </div>
              )}
              {affiliateData.country && (
                <div>
                  <p className="text-sm text-gray-400">Country</p>
                  <p className="text-white font-medium">
                    {affiliateData.country}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <StatusBadge status={affiliateData.status} />
              </div>
            </div>
          </div>

          {/* Verification Document */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📄</span> Verification Document
            </h3>
            <div className="relative group rounded-xl overflow-hidden border border-white/10">
              <img
                src={getGrowAssetUrl(affiliateData.verificationImageUrl)}
                alt="Verification Proof"
                className="w-full h-64 object-cover opacity-60 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href={getGrowAssetUrl(affiliateData.verificationImageUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-white rounded-full text-black hover:text-white hover:bg-[#b68938] transition-all opacity-0 group-hover:opacity-100"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>🕒</span> Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Submitted At</p>
                <p className="text-white font-medium">
                  {moment(affiliateData.createdAt).format('lll')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Application ID</p>
                <p className="text-white font-medium font-mono text-xs">
                  {affiliateData._id}
                </p>
              </div>
            </div>
          </div>

          {/* Rejection Reason (if any) */}
          {affiliateData.rejectionReason && (
            <div className="bg-rose-500/10 rounded-xl p-6 border border-rose-500/20">
              <h3 className="text-lg font-bold text-rose-400 mb-2 flex items-center gap-2">
                <span>⚠️</span> Rejection Reason
              </h3>
              <p className="text-white">{affiliateData.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border-t border-white/10 p-6">
          {affiliateData.status === 'pending' && onApprove && onReject ? (
            <div className="flex gap-3">
              <button
                onClick={() => onApprove(affiliateData._id)}
                disabled={isApproving && selectedItemId === affiliateData._id}
                className="flex-1 px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-xl transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving && selectedItemId === affiliateData._id
                  ? 'Approving...'
                  : '✓ Approve'}
              </button>
              <button
                onClick={() => onReject(affiliateData._id)}
                className="flex-1 px-4 py-3 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-xl transition-colors font-semibold"
              >
                ✕ Reject
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-semibold"
            >
              Close
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
