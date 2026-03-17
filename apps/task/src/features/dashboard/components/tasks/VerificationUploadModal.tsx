import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Send, Upload, X } from 'lucide-react';
import { allPlatforms } from '../../../../data/dummyDashboardMockData';
import { DashboardGlassCard } from '../ui/DashboardGlassCard';
import MagneticButton from '../ui/DashboardMagneticButton';
import { api } from '../../../../lib/api';
import { useTaskAuthStore } from '../../../../store/useTaskAuthStore';
import { useSRKFileUpload } from '@srk/shared/hooks';
import { Task } from '../../types';

interface VerificationUploadModalProps {
  task: Task
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
  const { uploadFile, overallProgress } = useSRKFileUpload('task');
  const { taskUserID } = useTaskAuthStore();
  const submitAction = api.srkTask.srkTaskActionSubmission.useMutation();

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

  const handleSubmit = async () => {
    if (!screenshot) {
      addNotification('Please upload a screenshot first', 'error');
      return;
    }

    setIsUploading(true);

    try {
      const { url } = await uploadFile(screenshot, 'image');

      submitAction.mutate(
        {
          body: {
            actionTodoId: task.id,
            srkTaskUserId: taskUserID || '',
            actionVerificationImageUrl: url,
          },
        },
        {
          onSuccess: () => {
            setIsUploading(false);
            completeTask(task.id);
            addNotification(`Proof submitted for ${task.type} task`, 'success');
            setTimeout(() => onClose(), 1000);
          },
          onError: (error: any) => {
            setIsUploading(false);
            addNotification(
              `Submission failed: ${error.body?.message || 'Unknown error'}`,
              'error'
            );
          },
        }
      );
    } catch (error: any) {
      setIsUploading(false);
      addNotification(`Upload failed: ${error.message}`, 'error');
    }
  };

  const platformInfo = allPlatforms.find((p) => p.platform === task.platform);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto">
      <DashboardGlassCard className="w-full max-w-2xl my-auto relative max-h-[90vh] flex flex-col overflow-scroll">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 hover:bg-white/10 rounded-lg z-10"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto px-6 sm:px-8 py-6 sm:py-8">
          <div className="text-center mb-6 sm:mb-8">
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
                  <h4 className="font-bold text-white">{task.type?.toUpperCase() || ''} - {task.username || 'User'}</h4>
                  <p className="text-sm text-zinc-400">{task.platform || ''}</p>
                </div>
              </div>
              <p className="text-sm text-amber-400 bg-amber-500/10 p-3 rounded-lg">
                📸 {task.type === 'follow' ? 'Follow the profile' : 'Like the post'}
              </p>
              {/* visit link with good ui  */}
              {task.url && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    {task.type === 'like' ? 'Post Link' : 'Profile Link'}
                  </label>
                  <a
                    href={task.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-yellow-400 underline break-all"
                  >
                    {task.url || 'N/A'}
                  </a>
                </div>
              )}

            </DashboardGlassCard>

            {/* Upload Area */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Upload Screenshot Proof
              </label>
              <div
                className={`border-2 border-dashed ${preview ? 'border-amber-500/50' : 'border-white/10'
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
                  <span>{overallProgress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-div-to-r from-amber-500 to-yellow-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${overallProgress}%` }}
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
        </div>
      </DashboardGlassCard>
    </div>
  );
};
