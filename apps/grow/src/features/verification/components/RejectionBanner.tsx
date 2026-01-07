import { AlertCircle } from 'lucide-react';

interface RejectionBannerProps {
  rejectionReason?: string;
}

export const RejectionBanner = ({ rejectionReason }: RejectionBannerProps) => {
  return (
    <div className="mb-8 max-w-4xl mx-auto">
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-300 mb-2">
              Previous Verification Rejected
            </h3>
            <p className="text-gray-300 mb-3">
              Your previous affiliate verification request was not approved. Please review the reason below and submit a new request with the correct information.
            </p>
            {rejectionReason && (
              <div className="bg-red-500/10 border border-red-500/10 rounded-lg p-3">
                <p className="text-red-200 text-sm">
                  <strong>Rejection Reason:</strong> {rejectionReason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
