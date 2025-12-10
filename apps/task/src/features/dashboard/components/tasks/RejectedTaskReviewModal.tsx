import React from 'react';
import { RejectedTaskEntry, Task } from '../../types';
import { allPlatforms } from '../../data/dummyDashboardData';
import { DashboardGlassCard } from '../ui/DashboardGlassCard';
import { AlertTriangle, Coins, RefreshCw, X } from 'lucide-react';
import MagneticButton from '../ui/DashboardMagneticButton';

interface RejectedTaskReviewModalProps {
  task: RejectedTaskEntry;
  onClose: () => void;
  activeTasks: Task[];
  setVerifyingTask: (task: Task) => void;
  setRejectedTasks: React.Dispatch<React.SetStateAction<RejectedTaskEntry[]>>;
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void;
}

export const RejectedTaskReviewModal: React.FC<
  RejectedTaskReviewModalProps
> = ({
  task,
  onClose,
  activeTasks,
  setVerifyingTask,
  setRejectedTasks,
  addNotification,
}: RejectedTaskReviewModalProps) => {
  const originalTask = activeTasks.find((t) => t.id === task.taskId);
  const platformInfo = allPlatforms.find((p) => p.platform === task.platform);

  const handleRetry = () => {
    if (originalTask) {
      setVerifyingTask(originalTask);
      setRejectedTasks((prev) => prev.filter((t) => t.id !== task.id));
      addNotification('Task ready for resubmission', 'info');
      onClose();
    }
  };

  const handleCancel = () => {
    setRejectedTasks((prev) => prev.filter((t) => t.id !== task.id));
    addNotification('Task removed from rejected list', 'info');
    onClose();
  };
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
          <div className="w-16 h-16 rounded-full bg-divt-to-r from-red-500/20 to-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Task Rejected</h2>
          <p className="text-zinc-400">Review why your task was rejected</p>
        </div>

        <div className="space-y-6">
          {/* Task Details */}
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
              <div className="ml-auto">
                <Coins size={20} className="text-amber-400" />
                <span className="text-lg font-bold text-amber-400">
                  +{task.coins}
                </span>
              </div>
            </div>
          </DashboardGlassCard>

          {/* Rejection Details */}
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <h4 className="font-bold text-red-400 mb-2">Rejection Reason</h4>
              <p className="text-white">{task.rejectionReason}</p>
            </div>

            {task.adminComment && (
              <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <h4 className="font-bold text-amber-400 mb-2">Admin Comment</h4>
                <p className="text-white">{task.adminComment}</p>
              </div>
            )}

            {/* Uploaded Proof */}
            <div>
              <h4 className="font-bold text-zinc-400 mb-2">Your Submission</h4>
              <div className="aspect-video w-full bg-zinc-800 rounded-xl overflow-hidden border border-white/10">
                <img
                  src={task.uploadedProofUrl}
                  alt="Uploaded proof"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2 text-center">
                Submitted on {task.date}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {task.canRetry ? (
              <MagneticButton onClick={handleRetry} className="flex-1">
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={16} />
                  Retry Task
                </span>
              </MagneticButton>
            ) : (
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
              >
                Remove from List
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </DashboardGlassCard>
    </div>
  );
};
