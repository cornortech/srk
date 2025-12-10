import { SocialPlatform, TaskType } from '../../../../types/dashboard';
import { useState } from 'react';
import MagneticButton from './../../../../components/ui/dashboard/DashboardMagneticButton';
import {
  ArrowRight,
  Play,
  RefreshCw,
  Share2,
  Ticket,
  Users,
  X,
} from 'lucide-react';
import { allPlatforms } from './../../../../data/dashboard';
import { DashboardGlassCard } from './../../../../components/ui/dashboard/DashboardGlassCard';
import { motion } from 'framer-motion';

interface RequestTaskModalProps {
  onClose: () => void;
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void;
}
export const RequestTaskModal: React.FC<RequestTaskModalProps> = ({
  onClose,
  addNotification,
}) => {
  const [step, setStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform | null>(null);
  const [taskType, setTaskType] = useState<TaskType | null>(null);
  const [taskUrl, setTaskUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!selectedPlatform || !taskType || !taskUrl.trim()) {
      addNotification('Please fill all required fields', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addNotification('Task request submitted successfully!', 'success');
      onClose();
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Select Platform</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {allPlatforms.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.platform}
                    onClick={() => {
                      setSelectedPlatform(p.platform);
                      setStep(2);
                    }}
                    className={`p-4 rounded-xl transition-all ${
                      selectedPlatform === p.platform
                        ? 'bg-div-to-br ' + p.gradient
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Icon
                      size={24}
                      className={`mx-auto mb-2 ${
                        selectedPlatform === p.platform ? 'text-white' : p.color
                      }`}
                    />
                    <p className="text-sm font-medium text-white">{p.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <ArrowRight size={14} className="rotate-180" /> Back
            </button>

            <h3 className="text-xl font-bold text-white">Select Task Type</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  type: 'follow' as TaskType,
                  icon: Users,
                  label: 'Follow/Subscribe',
                },
                {
                  type: 'watch' as TaskType,
                  icon: Play,
                  label: 'Watch Video',
                },
                {
                  type: 'post' as TaskType,
                  icon: Share2,
                  label: 'Post/Share',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => {
                      setTaskType(item.type);
                      setStep(3);
                    }}
                    className={`p-6 rounded-xl transition-all ${
                      taskType === item.type
                        ? 'bg-div-to-br from-amber-500/20 to-yellow-500/20'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={24} className="text-amber-400 mx-auto mb-3" />
                    <p className="font-medium text-white">{item.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <button
              onClick={() => setStep(2)}
              className="text-sm text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <ArrowRight size={14} className="rotate-180" /> Back
            </button>

            <h3 className="text-xl font-bold text-white">Task Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Task URL
                </label>
                <input
                  type="url"
                  value={taskUrl}
                  onChange={(e) => setTaskUrl(e.target.value)}
                  placeholder="Enter the URL for the task"
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you want to promote..."
                  rows={4}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <MagneticButton
              onClick={handleSubmit}
              disabled={!taskUrl.trim() || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Request'
              )}
            </MagneticButton>
          </div>
        );
    }
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
          <Ticket size={40} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Request Custom Task
          </h2>
          <p className="text-zinc-400">Step {step} of 3</p>

          {/* Progress bar */}
          <div className="w-full h-2 bg-zinc-800 rounded-full mt-4 overflow-hidden">
            <motion.div
              className="h-full bg-div-to-r from-amber-500 to-yellow-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {renderStep()}
      </DashboardGlassCard>
    </div>
  );
};
