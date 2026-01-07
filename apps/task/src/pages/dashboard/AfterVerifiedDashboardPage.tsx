import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DashboardView,
  RejectedTaskEntry,
  SocialPlatform,
  Task,
  TaskStatus,
  TaskType,
  UserProfile,
} from 'apps/task/src/features/dashboard/types';
import { followTasks, likeTasks } from '../../data/dummyDashboardMockData';
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
import { api } from '../../lib/api';
import { useTaskAuthStore } from '../../store/useTaskAuthStore';
import { FinanceHistoryView } from '../../features/dashboard/views/FinanceHistoryView';
import { TaskHistoryView } from '../../features/dashboard/views/TaskHistoryView';
import { useAuthAffiliateVerification } from '../../../../../libs/shared/hooks/src/lib/useAuthAffiliate';

export const AfterVerifiedDashboardPage: React.FC = () => {
  const {
    user: ssoUser,
    isAuthenticated: ssoAuthenticated,
    isLoading: ssoLoading,
  } = useAuthAffiliateVerification();
  const {
    user: storeUser,
    isAuthenticated: storeAuthenticated,
    isLoading: storeLoading,
  } = useTaskAuthStore();

  const user = ssoUser || storeUser;
  const isAuthenticated = ssoAuthenticated || storeAuthenticated;
  const isLoading = ssoLoading || storeLoading;

  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [dashView, setDashView] = useState<DashboardView>('verification');
  const [showVerification, setShowVerification] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [taskCategory, setTaskCategory] = useState<TaskType | null>(null);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Task | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [verifyingTask, setVerifyingTask] = useState<Task | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { taskUserID, setTaskUserID } = useTaskAuthStore();

  const { data: verificationRequest, isLoading: isVerifyingOnboarding } =
    api.srkTask.getAllSrkTaskAffiliateVerificationRequest.useQuery(
      ['getAllSrkTaskAffiliateVerificationRequest', user?._id],
      { query: { srkUniversityUserId: user?._id || '' } },
      {
        enabled: !!user?._id && !taskUserID,
        queryKey: [
          'getAllSrkTaskAffiliateVerificationRequest',
          user?._id || '',
        ],
      }
    );

  React.useEffect(() => {
    if (
      verificationRequest?.status === 200 &&
      verificationRequest.body.success &&
      verificationRequest.body.data
    ) {
      if (verificationRequest.body.data._id) {
        setTaskUserID(verificationRequest.body.data._id.toString());
      }
    }
  }, [verificationRequest, setTaskUserID]);

  const { data: userProfileData } = api.srkTask.getSrkTaskUserProfile.useQuery(
    ['getSrkTaskUserProfile', taskUserID],
    { params: { userId: taskUserID || '' } },
    {
      enabled: !!taskUserID,
      queryKey: ['getSrkTaskUserProfile', taskUserID || ''],
    }
  );

  const { data: analyticsData, refetch: refetchAnalytics } =
    api.srkTask.getSrkTaskUserAnalytics.useQuery(
      ['getSrkTaskUserAnalytics', taskUserID],
      { params: { userId: taskUserID || '' } },
      {
        enabled: !!taskUserID,
        queryKey: ['getSrkTaskUserAnalytics', taskUserID || ''],
      }
    );

  const balance = analyticsData?.body.coinsData.walletCoins ?? 0;

  const eligible = Math.max(0, balance - 100);

  if (userProfileData?.body.userData.kycStatus === 'approved') {
    if (!isApproved) setIsApproved(true);
  }

  let currentProfile: Omit<
    UserProfile,
    'avatar' | 'level' | 'xp' | 'nextLevelXP' | 'socialLinks'
  > | null = null;
  if (userProfileData?.status === 200)
    currentProfile = {
      name: userProfileData.body.userData.fullName,
      email: userProfileData.body.userData.email,
      phone: userProfileData.body.userData.phone,
      joinDate: new Date(
        userProfileData.body.userData.createdAt
      ).toLocaleDateString(),
      documentStatus:
        userProfileData.body.userData.kycStatus === 'approved'
          ? 'verified'
          : userProfileData.body.userData.kycStatus === 'rejected'
          ? 'rejected'
          : 'pending',
    };

  const [activeTasks, setActiveTasks] = useState<Task[]>([
    ...followTasks,
    ...likeTasks,
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
      refetchAnalytics();
      addNotification(
        `Task completed! +${task.coins} Coins earned!`,
        'success'
      );
    }
  };

  // Handle verification success
  const handleVerificationSuccess = () => {
    setShowVerification(false);
    addNotification(
      'Verification submitted successfully! Our team will review your documents.',
      'success'
    );
  };

  // const viewsConfig: Record<DashboardView, { title: string; desc: string }> = {
  //   verification: { title: 'Verification', desc: 'Verify your account' },
  //   analytics: { title: 'Analytics', desc: 'View your earnings' },
  //   tasks: { title: 'Tasks', desc: 'Complete earning tasks' },
  //   leaderboard: { title: 'Leaderboard', desc: 'Top performers' },
  //   coinExchange: { title: 'Coin Exchange', desc: 'Convert coins to cash' },
  //   profile: { title: 'Profile', desc: 'Manage your account' },
  //   payout: { title: 'Legacy Payout', desc: 'Deprecated system' },
  //   logout: { title: '', desc: '' },
  //   finance: { title: 'Financial History', desc: 'View all your transactions' },
  //   taskHistory: { title: 'Task History', desc: 'View your submitted tasks' },
  // };

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
            kycStatus={userProfileData?.body.userData.kycStatus}
            rejectionReason={undefined}
          />
        );
      case 'analytics':
        return <AnalyticsView />;
      case 'tasks':
        return (
          <TasksView
            isApproved={isApproved}
            setDashView={setDashView}
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
            addNotification={addNotification}
            onPayoutSuccess={refetchAnalytics}
          />
        );
      case 'profile':
        return (
          <ProfileView
            isApproved={isApproved}
            setDashView={setDashView}
            profile={currentProfile}
            hasPurchased={hasPurchased}
            completed={completed}
          />
        );
      case 'payout':
        return <LegacyPayoutView setDashView={setDashView} />;
      case 'finance':
        return <FinanceHistoryView />;
      case 'taskHistory':
        return <TaskHistoryView />;
      default:
        return null;
    }
  };

  if (isLoading || (isAuthenticated && !taskUserID && isVerifyingOnboarding)) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full mb-4"
        />
        <p className="text-zinc-400 font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-4">Not Authenticated</h2>
          <p className="text-zinc-400 mb-6">
            Please get affiliated through srk university to access your
            dashboard.
          </p>
        </div>
      </div>
    );
  }

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
            font-size: 3rem;
          }
          .text-4xl, .text-5xl {
            font-size: 2.25rem;
            line-height: 2.5rem;
          }
          .text-3xl {
            font-size: 1.875rem;
            line-height: 2.25rem;
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
          eligible={eligible}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          addNotification={addNotification}
          isActivated={userProfileData?.body.userData.isActivated ?? false}
          // title={viewsConfig[dashView].title}
          // desc={viewsConfig[dashView].desc}
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
            // setRejectedTasks={setRejectedTasks}
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
