import { Camera, Loader2, AlertCircle } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface MediaPreviewSectionProps {
  previewUrl: string;
  capturedMedia: File | null;
  mediaType: 'photo' | 'video';
  submissionStatus: 'idle' | 'submitting' | 'success' | 'error';
  isUploading: boolean;
  uploadedImageUrl: string;
  isPending: boolean;
  onSubmit: () => void;
  onOpenCamera: () => void;
}

export const MediaPreviewSection = ({
  previewUrl,
  capturedMedia,
  mediaType,
  submissionStatus,
  isUploading,
  uploadedImageUrl,
  isPending,
  onSubmit,
  onOpenCamera,
}: MediaPreviewSectionProps) => {
  return (
    <GlassCard>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          {capturedMedia ? 'Captured Media' : 'Live Preview'}
        </h3>
        <p className="text-gray-400">
          {capturedMedia
            ? 'Your submission is ready'
            : 'Capture will appear here'}
        </p>
      </div>

      <div className="aspect-video bg-black/30 rounded-xl overflow-hidden mb-6 border-2 border-white/10 flex items-center justify-center">
        {previewUrl && mediaType === 'photo' ? (
          <img
            src={previewUrl}
            alt="Captured"
            className="w-full h-full object-contain"
          />
        ) : null}
      </div>

      {submissionStatus !== 'idle' && submissionStatus !== 'success' && (
        <div
          className={`p-4 rounded-xl mb-4 ${
            submissionStatus === 'error'
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-blue-500/10 border border-blue-500/20'
          }`}
        >
          <div className="flex items-center gap-3">
            {submissionStatus === 'submitting' ? (
              <>
                <Loader2
                  size={20}
                  className="text-blue-400 animate-spin"
                />
                <span className="text-blue-400">
                  Submitting verification...
                </span>
              </>
            ) : (
              <>
                <AlertCircle size={20} className="text-red-400" />
                <span className="text-red-400">
                  Submission failed. Please try again.
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {capturedMedia ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              className="bg-orange-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
              onClick={onSubmit}
              disabled={isPending || isUploading || !uploadedImageUrl}
            >
              {isUploading
                ? 'Uploading...'
                : isPending
                  ? 'Submitting...'
                  : 'Submit Verification'}
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenCamera}
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold hover:shadow-[0_0_30px_rgba(182,137,56,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            Open Camera
          </button>
        )}
      </div>
    </GlassCard>
  );
};
