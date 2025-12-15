import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  Loader2,
  Send,
} from 'lucide-react';
import { ReviewStepProps } from './types';

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onPrev,
  isSubmitting,
  submissionStatus,
  onSubmit,
  onRetry,
}) => {
  const isFormComplete =
    formData.documentFile &&
    formData.selfieImage &&
    formData.signature &&
    formData.fullName &&
    formData.dob;

  // Success state
  if (submissionStatus === 'success') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">
          5. Review and Submit
        </h2>
        <div className="text-center p-6 bg-linear-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl">
          <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Verification Submitted
          </h3>
          <p className="text-gray-400">
            Your identity verification is under review. This may take 1-2
            business days.
          </p>
          <div className="mt-4 text-sm text-emerald-400">
            Redirecting to Tasks tab...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (submissionStatus === 'error') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">
          5. Review and Submit
        </h2>
        <div className="text-center p-6 bg-linear-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Submission Failed
          </h3>
          <p className="text-gray-400">
            An error occurred. Please check your connection and try again.
          </p>
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-2 bg-linear-to-r from-amber-500 to-yellow-500 text-black font-medium rounded-lg hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Default review state
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">5. Review and Submit</h2>

      {/* Review Summary */}
      <div className="space-y-3 p-4 bg-white/5 rounded-lg">
        <ReviewItem
          label="Document"
          value={formData.documentFile?.name || 'Missing'}
          isMissing={!formData.documentFile}
        />

        <div className="text-sm">
          <span className="font-semibold text-gray-400">Selfie:</span>
          <span className="text-white ml-2">
            {formData.selfieImage ? 'Captured' : 'Missing'}
          </span>
          {formData.selfieImage && (
            <img
              src={formData.selfieImage}
              alt="Selfie"
              className="w-16 h-auto mt-2 rounded-md border border-amber-500"
            />
          )}
        </div>

        <div className="text-sm">
          <span className="font-semibold text-gray-400">Signature:</span>
          <span className="text-white ml-2">
            {formData.signature ? 'Provided' : 'Missing'}
          </span>
          {formData.signature && (
            <img
              src={formData.signature}
              alt="Signature"
              className="w-32 h-auto mt-2 rounded-md border border-amber-500"
            />
          )}
        </div>

        <ReviewItem
          label="Name"
          value={formData.fullName || 'Missing'}
          isMissing={!formData.fullName}
        />

        <ReviewItem
          label="DOB"
          value={formData.dob || 'Missing'}
          isMissing={!formData.dob}
        />

        <div className="text-sm text-amber-400 pt-3 italic">
          I confirm that all information provided is accurate and true.
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="text-gray-400 hover:text-white transition px-4 py-2 flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !isFormComplete}
          className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" /> Submit Verification
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Helper component for review items
interface ReviewItemProps {
  label: string;
  value: string;
  isMissing?: boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  label,
  value,
  isMissing = false,
}) => (
  <div className="text-sm">
    <span className="font-semibold text-gray-400">{label}:</span>{' '}
    <span className={isMissing ? 'text-red-400' : 'text-white'}>{value}</span>
  </div>
);

export default ReviewStep;
