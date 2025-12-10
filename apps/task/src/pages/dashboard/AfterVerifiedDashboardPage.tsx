import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  DashboardView,
  RejectedTaskEntry,
  SocialPlatform,
  Task,
  TaskStatus,
  TaskType,
  UserProfile,
} from 'apps/task/src/features/dashboard/types';
import {
  analyticsData,
  followTasks,
  postTasks,
  userProfile,
  watchTasks,
} from '../../data/dummyDashboardMockData';
import AnimatedBackground from '../../components/ui/AnimatedBackground';
import FloatingNotification from '../../features/dashboard/components/ui/DashboardFloatingNotification';
import { VerificationModal } from '../../features/dashboard/components/verification/VerificationModal';
import { VerificationView } from '../../features/dashboard/views/VerificationView';
import { AnalyticsView } from '../../features/dashboard/views/AnalyticsView';
import { TasksView } from '../../features/dashboard/views/TasksView';
import { LeaderboardView } from '../../features/dashboard/views/LeaderboardView';
import { CoinExchangeView } from '../../features/dashboard/views/CoinExchangeView';
import { ProfileView } from '../../features/dashboard/views/ProfileView';
import { LegacyPayoutView } from '../../features/dashboard/views/LegacyPayoutView';
import { LandingView } from '../../features/dashboard/views/LandingView';
import {
  PlatformSelectorModal,
  PlatformSpecificTaskModal,
} from '../../features/dashboard/components/tasks/TaskModals';
import { VerificationUploadModal } from '../../features/dashboard/components/tasks/VerificationUploadModal';
import { VideoPlayerModal } from '../../features/dashboard/components/tasks/VideoPlayerModal';
import { RejectedTaskReviewModal } from '../../features/dashboard/components/tasks/RejectedTaskReviewModal';
import { RequestTaskModal } from '../../features/dashboard/components/tasks/RequestTaskModal';
import { DashboardLayout } from '../../features/dashboard/layout/DashboardLayout';

export const AfterVerifiedDashboardPage: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [dashView, setDashView] = useState<DashboardView>('verification');
  const [showVerification, setShowVerification] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [taskCategory, setTaskCategory] = useState<TaskType | null>(null);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Task | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [balance, setBalance] = useState<number>(1250);
  const [eligible, setEligible] = useState<number>(1000);
  const [verifyingTask, setVerifyingTask] = useState<Task | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, _setProfile] = useState<UserProfile>(userProfile);

  const [activeTasks, setActiveTasks] = useState<Task[]>([
    ...followTasks,
    ...watchTasks,
    ...postTasks,
  ]);

  const [rejectedTasks, setRejectedTasks] = useState<RejectedTaskEntry[]>([
    {
      ...followTasks[0],
      rejectionReason: 'Screenshot blurry, username not visible.',
      uploadedProofUrl:
        'https://placehold.co/400x300/27272a/FFF?text=Subscription+Proof',
      taskId: 'f-yt-1',
      id: 'f-yt-1-rejected',
      date: '2024-01-15',
      adminComment:
        'Please ensure your username is clearly visible in the screenshot',
      canRetry: true,
    },
    {
      ...watchTasks[1],
      rejectionReason: 'Incomplete watch time, video paused at 80%.',
      uploadedProofUrl:
        'https://placehold.co/400x300/27272a/FFF?text=Watch+Proof',
      taskId: 'w-ig-1',
      id: 'w-ig-1-rejected',
      date: '2024-01-14',
      adminComment: 'Video must be watched completely. Please try again.',
      canRetry: true,
    },
    {
      ...postTasks[0],
      rejectionReason: 'Shared post is private. Make it public.',
      uploadedProofUrl:
        'https://placehold.co/400x300/27272a/FFF?text=Share+Proof',
      taskId: 'p-fb-1',
      id: 'p-fb-1-rejected',
      date: '2024-01-13',
      adminComment: 'Please set post visibility to public',
      canRetry: true,
    },
  ]);
  const [reviewingRejectedTask, setReviewingRejectedTask] =
    useState<RejectedTaskEntry | null>(null);
  const [notifications, setNotifications] = useState<
    Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>
  >([]);

  // Add notification
  const addNotification = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  // Complete a task
  const completeTask = (taskId: string) => {
    setActiveTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: 'completed' as TaskStatus }
          : task
      )
    );
    setCompleted((prev) => [...prev, taskId]);

    const task = activeTasks.find((t) => t.id === taskId);
    if (task) {
      setBalance((prev) => prev + task.coins);
      setEligible((prev) => prev + task.coins);
      addNotification(
        `Task completed! +${task.coins} Coins earned!`,
        'success'
      );
    }
  };

  // Handle verification success
  const handleVerificationSuccess = () => {
    setIsApproved(true);
    setDashView('tasks');
    addNotification(
      'Verification submitted successfully! You can now access all features.',
      'success'
    );
  };

  const viewsConfig: Record<DashboardView, { title: string; desc: string }> = {
    verification: { title: 'Verification', desc: 'Verify your account' },
    analytics: { title: 'Analytics', desc: 'View your earnings' },
    tasks: { title: 'Tasks', desc: 'Complete earning tasks' },
    leaderboard: { title: 'Leaderboard', desc: 'Top performers' },
    coinExchange: { title: 'Coin Exchange', desc: 'Convert coins to cash' },
    profile: { title: 'Profile', desc: 'Manage your account' },
    payout: { title: 'Legacy Payout', desc: 'Deprecated system' },
    logout: { title: '', desc: '' },
  };

  const renderView = () => {
    switch (dashView) {
      case 'verification':
        return (
          <VerificationView
            isApproved={isApproved}
            setShowVerification={setShowVerification}
            hasPurchased={hasPurchased}
            setHasPurchased={setHasPurchased}
            addNotification={addNotification}
          />
        );
      case 'analytics':
        return <AnalyticsView />;
      case 'tasks':
        return (
          <TasksView
            isApproved={isApproved}
            setDashView={setDashView}
            rejectedTasks={rejectedTasks}
            setTaskCategory={setTaskCategory}
            setReviewingRejectedTask={setReviewingRejectedTask}
          />
        );
      case 'leaderboard':
        return <LeaderboardView />;
      case 'coinExchange':
        return (
          <CoinExchangeView
            eligible={eligible}
            balance={balance}
            payoutRequested={payoutRequested}
            setPayoutRequested={setPayoutRequested}
            addNotification={addNotification}
          />
        );
      case 'profile':
        return (
          <ProfileView
            isApproved={isApproved}
            setDashView={setDashView}
            profile={profile}
            hasPurchased={hasPurchased}
            completed={completed}
            analyticsData={analyticsData}
          />
        );
      case 'payout':
        return <LegacyPayoutView setDashView={setDashView} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');



        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(182, 137, 56, 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(182, 137, 56, 0.5);
        }
        
        /* Selection */
        ::selection {
          background: rgba(182, 137, 56, 0.3);
          color: white;
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        
        /* Focus styles */
        :focus-visible {
          outline: 2px solid rgba(182, 137, 56, 0.5);
          outline-offset: 2px;
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .text-7xl, .text-8xl {
            font-size: 3.5rem;
          }
        }
     `,
        }}
      />

      {view === 'landing' ? (
        <LandingView setView={setView} addNotification={addNotification} />
      ) : (
        <DashboardLayout
          dashView={dashView}
          setView={setView}
          balance={balance}
          setDashView={setDashView}
          isApproved={isApproved}
          rejectedTasks={rejectedTasks}
          eligible={eligible}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          addNotification={addNotification}
          title={viewsConfig[dashView].title}
          desc={viewsConfig[dashView].desc}
        >
          <AnimatedBackground />
          {renderView()}
        </DashboardLayout>
      )}

      <AnimatePresence>
        {showVerification && (
          <VerificationModal
            onClose={() => setShowVerification(false)}
            onSuccess={handleVerificationSuccess}
          />
        )}
        {taskCategory && !selectedPlatform && (
          <PlatformSelectorModal
            type={taskCategory}
            onClose={() => setTaskCategory(null)}
            setSelectedPlatform={setSelectedPlatform}
          />
        )}
        {selectedPlatform && taskCategory && (
          <PlatformSpecificTaskModal
            platform={selectedPlatform}
            type={taskCategory}
            onClose={() => {
              setSelectedPlatform(null);
              setTaskCategory(null);
            }}
            onBack={() => setSelectedPlatform(null)}
            setPlayingVideo={setPlayingVideo}
            setVerifyingTask={setVerifyingTask}
          />
        )}
        {verifyingTask && (
          <VerificationUploadModal
            task={verifyingTask}
            onClose={() => setVerifyingTask(null)}
            addNotification={addNotification}
            completeTask={completeTask}
          />
        )}
        {playingVideo && (
          <VideoPlayerModal
            task={playingVideo}
            onClose={() => setPlayingVideo(null)}
            addNotification={addNotification}
            completeTask={completeTask}
          />
        )}
        {reviewingRejectedTask && (
          <RejectedTaskReviewModal
            task={reviewingRejectedTask}
            onClose={() => setReviewingRejectedTask(null)}
            activeTasks={activeTasks}
            setVerifyingTask={setVerifyingTask}
            setRejectedTasks={setRejectedTasks}
            addNotification={addNotification}
          />
        )}
        {showRequestModal && (
          <RequestTaskModal
            onClose={() => setShowRequestModal(false)}
            addNotification={addNotification}
          />
        )}
        {notifications.map((notification) => (
          <FloatingNotification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() =>
              setNotifications((prev) =>
                prev.filter((n) => n.id !== notification.id)
              )
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
