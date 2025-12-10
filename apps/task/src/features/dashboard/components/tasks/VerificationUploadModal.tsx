import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, RefreshCw, Send, Upload, X } from 'lucide-react';
import { allPlatforms } from '../../../../data/dummyDashboardMockData';
import { Task } from '../../types';
import { DashboardGlassCard } from '../ui/DashboardGlassCard';
import MagneticButton from '../ui/DashboardMagneticButton';

interface VerificationUploadModalProps {
  task: Task;
  onClose: () => void;
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void;
  completeTask: (taskId: string) => void;
}

export const VerificationUploadModal: React.FC<
  VerificationUploadModalProps
> = ({ task, onClose, addNotification, completeTask }) => {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!screenshot) {
      addNotification('Please upload a screenshot first', 'error');
      return;
    }

    setIsUploading(true);
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          completeTask(task.id);
          addNotification(`Proof submitted for ${task.title}`, 'success');
          setTimeout(() => onClose(), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const platformInfo = allPlatforms.find((p) => p.platform === task.platform);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
      <DashboardGlassCard className="w-full max-w-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-div-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center mx-auto mb-4">
            <Upload size={28} className="text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Submit Proof</h2>
          <p className="text-zinc-400">Upload screenshot for verification</p>
        </div>

        <div className="space-y-6">
          {/* Task Info */}
          <DashboardGlassCard className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-div-to-br ${platformInfo?.gradient} flex items-center justify-center`}
              >
                {platformInfo?.icon &&
                  React.createElement(platformInfo.icon, {
                    size: 20,
                    className: platformInfo.color,
                  })}
              </div>
              <div>
                <h4 className="font-bold text-white">{task.title}</h4>
                <p className="text-sm text-zinc-400">{task.desc}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Coins size={20} className="text-amber-400" />
                <span className="text-lg font-bold text-amber-400">
                  +{task.coins}
                </span>
              </div>
            </div>
            <p className="text-sm text-amber-400 bg-amber-500/10 p-3 rounded-lg">
              📸 {task.required}
            </p>
          </DashboardGlassCard>

          {/* Upload Area */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Upload Screenshot Proof
            </label>
            <div
              className={`border-2 border-dashed ${
                preview ? 'border-amber-500/50' : 'border-white/10'
              } rounded-xl p-8 text-center hover:border-amber-500/30 transition-colors cursor-pointer`}
              onClick={() =>
                document.getElementById('screenshot-upload')?.click()
              }
            >
              <input
                type="file"
                id="screenshot-upload"
                onChange={handleFileUpload}
                className="hidden"
                accept=".jpg,.jpeg,.png"
                disabled={isUploading}
              />

              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Screenshot preview"
                    className="max-h-48 mx-auto rounded-lg object-contain"
                  />
                  <p className="text-sm text-amber-400">
                    Screenshot ready for submission
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setScreenshot(null);
                      setPreview(null);
                    }}
                    className="text-sm text-red-400 hover:text-red-300"
                    disabled={isUploading}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={40} className="mx-auto mb-4 text-zinc-400" />
                  <p className="text-zinc-400 mb-2">
                    Click to upload screenshot
                  </p>
                  <p className="text-xs text-zinc-500">JPG, PNG • Max 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-div-to-r from-amber-500 to-yellow-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <MagneticButton
            onClick={handleSubmit}
            disabled={!screenshot || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Send size={16} />
                Submit Proof
              </span>
            )}
          </MagneticButton>
        </div>
      </DashboardGlassCard>
    </div>
  );
};
