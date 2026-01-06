import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import moment from 'moment';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    _id: string;
    userData: {
      fullName: string;
      email: string;
      phoneNumber: string;
      gender: string;
      country: string;
      status: string;
      kycURL?: string[];
      usedPromoCode?: string;
    };
    enrollmentData: {
      packageName?: string;
      packageTypeName?: string;
      packageSubTypeName?: string;
      socialMediaPlatform?: string;
      profileLinkURL?: string[];
      noOfFollowers?: number;
      noOfLikes?: number;
      noOfVideos?: number;
    };
    paymentData: {
      transactionId: string;
      paymentMethod: string;
      paymentURL: string;
      rejectionReason?: string;
    };
    postLinks?: string[];
    referredBy?: {
      fullName: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
  } | null;
}

export const UserDetailsModal = ({
  isOpen,
  onClose,
  userData,
}: UserDetailsModalProps) => {
  if (!isOpen || !userData) return null;

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
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <p className="text-gray-400 text-sm mt-1">
                Complete enrollment information
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
              <div>
                <p className="text-sm text-gray-400">Full Name</p>
                <p className="text-white font-medium">
                  {userData.userData.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-medium">
                  {userData.userData.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone Number</p>
                <p className="text-white font-medium">
                  {userData.userData.phoneNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Gender</p>
                <p className="text-white font-medium">
                  {userData.userData.gender}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Country</p>
                <p className="text-white font-medium">
                  {userData.userData.country}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <StatusBadge status={userData.userData.status} />
              </div>
            </div>
          </div>

          {/* Referral Information */}
          {userData.referredBy && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🔗</span> Referral Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Referred By</p>
                  <p className="text-white font-medium">
                    {userData.referredBy.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Referrer Email</p>
                  <p className="text-white font-medium">
                    {userData.referredBy.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Promo Code Used</p>
                  <p className="text-white font-medium">
                    {userData.userData.usedPromoCode || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Package Information */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📦</span> Package Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Package Name</p>
                <p className="text-white font-medium">
                  {userData.enrollmentData.packageName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Package Type</p>
                <p className="text-white font-medium">
                  {userData.enrollmentData.packageTypeName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Sub Type</p>
                <p className="text-white font-medium">
                  {userData.enrollmentData.packageSubTypeName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Platform</p>
                <p className="text-white font-medium">
                  {userData.enrollmentData.socialMediaPlatform}
                </p>
              </div>
              {userData.enrollmentData.noOfFollowers && userData.enrollmentData.noOfFollowers > 0 && (
                <div>
                  <p className="text-sm text-gray-400">Required Followers</p>
                  <p className="text-white font-medium">
                    {userData.enrollmentData.noOfFollowers.toLocaleString()}
                  </p>
                </div>
              )}
              {userData.enrollmentData.noOfLikes && userData.enrollmentData.noOfLikes > 0 && (
                <>
                  <div>
                    <p className="text-sm text-gray-400">Required Likes</p>
                    <p className="text-white font-medium">
                      {userData.enrollmentData.noOfLikes.toLocaleString()}
                    </p>
                  </div>
                  {userData.enrollmentData.noOfVideos && userData.enrollmentData.noOfVideos > 0 && (
                    <div>
                      <p className="text-sm text-gray-400">Number of Videos</p>
                      <p className="text-white font-medium">
                        {userData.enrollmentData.noOfVideos}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>💳</span> Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Transaction ID</p>
                <p className="text-white font-medium font-mono">
                  {userData.paymentData.transactionId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Payment Method</p>
                <p className="text-white font-medium uppercase">
                  {userData.paymentData.paymentMethod}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-400 mb-2">Payment Proof</p>
                <div className="relative group rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={userData.paymentData.paymentURL}
                    alt="Payment Proof"
                    className="w-full h-48 object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a
                      href={userData.paymentData.paymentURL}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white rounded-full text-black hover:text-white hover:bg-[#b68938] transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KYC Documents */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📄</span> KYC Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userData.userData.kycURL?.map((url: string, index: number) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border border-white/10"
                >
                  <img
                    src={url}
                    alt={`KYC Document ${index + 1}`}
                    className="w-full h-32 object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-white rounded-full text-black hover:text-white hover:bg-[#b68938] transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile & Post Links */}
          {(userData.enrollmentData.profileLinkURL?.length > 0 ||
            userData.postLinks?.length > 0) && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🔗</span> Social Media Links
              </h3>
              <div className="space-y-4">
                {userData.enrollmentData.profileLinkURL?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Profile Links</p>
                    <div className="space-y-2">
                      {userData.enrollmentData.profileLinkURL.map(
                        (url: string, index: number) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                          >
                            <ExternalLink size={14} />
                            {url}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}
                {userData.postLinks?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Post Links</p>
                    <div className="space-y-2">
                      {userData.postLinks.map((url: string, index: number) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
                        >
                          <ExternalLink size={14} />
                          {url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>🕒</span> Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Submitted At</p>
                <p className="text-white font-medium">
                  {moment(userData.createdAt).format('lll')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="text-white font-medium">
                  {moment(userData.updatedAt).format('lll')}
                </p>
              </div>
            </div>
          </div>

          {/* Rejection Reason (if any) */}
          {userData.paymentData.rejectionReason && (
            <div className="bg-rose-500/10 rounded-xl p-6 border border-rose-500/20">
              <h3 className="text-lg font-bold text-rose-400 mb-2 flex items-center gap-2">
                <span>⚠️</span> Rejection Reason
              </h3>
              <p className="text-white">{userData.paymentData.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border-t border-white/10 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
