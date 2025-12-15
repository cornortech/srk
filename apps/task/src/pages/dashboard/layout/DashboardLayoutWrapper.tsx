import React, { useState, createContext, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
    DashboardView,
    RejectedTaskEntry,
    Task,
    TaskType,
    SocialPlatform,
    UserProfile,
    TaskStatus,
} from '../../../features/dashboard/types';
import {
    followTasks,
    postTasks,
    userProfile,
    watchTasks,
} from '../../../data/dummyDashboardMockData';
import AnimatedBackground from '../../../components/ui/AnimatedBackground';
import FloatingNotification from '../../../features/dashboard/components/ui/DashboardFloatingNotification';
import { VerificationModal } from '../../../features/dashboard/components/verification/VerificationModal';
import {
    PlatformSelectorModal,
    PlatformSpecificTaskModal,
} from '../../../features/dashboard/components/tasks/TaskModals';
import { VerificationUploadModal } from '../../../features/dashboard/components/tasks/VerificationUploadModal';
import { VideoPlayerModal } from '../../../features/dashboard/components/tasks/VideoPlayerModal';
import { RejectedTaskReviewModal } from '../../../features/dashboard/components/tasks/RejectedTaskReviewModal';
import { RequestTaskModal } from '../../../features/dashboard/components/tasks/RequestTaskModal';
import { DashboardLayout as DashboardLayoutComponent } from '../../../features/dashboard/layout/DashboardLayout';

// Dashboard Context for shared state
interface DashboardContextType {
    // State
    isApproved: boolean;
    setIsApproved: (approved: boolean) => void;
    hasPurchased: boolean;
    setHasPurchased: (purchased: boolean) => void;
    balance: number;
    setBalance: React.Dispatch<React.SetStateAction<number>>;
    eligible: number;
    setEligible: React.Dispatch<React.SetStateAction<number>>;
    payoutRequested: boolean;
    setPayoutRequested: (requested: boolean) => void;
    completed: string[];
    profile: UserProfile;
    activeTasks: Task[];
    rejectedTasks: RejectedTaskEntry[];
    setRejectedTasks: React.Dispatch<React.SetStateAction<RejectedTaskEntry[]>>;

    // Modal controls
    setShowVerification: (show: boolean) => void;
    setTaskCategory: (type: TaskType | null) => void;
    setSelectedPlatform: (platform: SocialPlatform | null) => void;
    setPlayingVideo: (task: Task | null) => void;
    setVerifyingTask: (task: Task | null) => void;
    setReviewingRejectedTask: (task: RejectedTaskEntry | null) => void;
    setShowRequestModal: (show: boolean) => void;

    // Utilities
    addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
    completeTask: (taskId: string) => void;
    handleVerificationSuccess: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboardContext must be used within DashboardLayoutWrapper');
    }
    return context;
};

// Map route paths to view types and metadata
const viewsConfig: Record<string, { view: DashboardView; title: string; desc: string }> = {
    '/task/dashboard': { view: 'verification', title: 'Verification', desc: 'Verify your account' },
    '/task/dashboard/verification': { view: 'verification', title: 'Verification', desc: 'Verify your account' },
    '/task/dashboard/analytics': { view: 'analytics', title: 'Analytics', desc: 'View your earnings' },
    '/task/dashboard/tasks': { view: 'tasks', title: 'Tasks', desc: 'Complete earning tasks' },
    '/task/dashboard/leaderboard': { view: 'leaderboard', title: 'Leaderboard', desc: 'Top performers' },
    '/task/dashboard/coin-exchange': { view: 'coinExchange', title: 'Coin Exchange', desc: 'Convert coins to cash' },
    '/task/dashboard/profile': { view: 'profile', title: 'Profile', desc: 'Manage your account' },
    '/task/dashboard/payout': { view: 'payout', title: 'Legacy Payout', desc: 'Deprecated system' },
};

export const DashboardLayoutWrapper: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get current view config based on route
    const currentConfig = viewsConfig[location.pathname] || viewsConfig['/task/dashboard'];
    const dashView = currentConfig.view;

    // State
    const [showVerification, setShowVerification] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [payoutRequested, setPayoutRequested] = useState(false);
    const [taskCategory, setTaskCategory] = useState<TaskType | null>(null);
    const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
    const [playingVideo, setPlayingVideo] = useState<Task | null>(null);
    const [completed, setCompleted] = useState<string[]>([]);
    const [balance, setBalance] = useState<number>(1250);
    const [eligible, setEligible] = useState<number>(1000);
    const [verifyingTask, setVerifyingTask] = useState<Task | null>(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profile] = useState<UserProfile>(userProfile);

    const [activeTasks, setActiveTasks] = useState<Task[]>([
        ...followTasks,
        ...watchTasks,
        ...postTasks,
    ]);

    const [rejectedTasks, setRejectedTasks] = useState<RejectedTaskEntry[]>([
        {
            ...followTasks[0],
            rejectionReason: 'Screenshot blurry, username not visible.',
            uploadedProofUrl: 'https://placehold.co/400x300/27272a/FFF?text=Subscription+Proof',
            taskId: 'f-yt-1',
            id: 'f-yt-1-rejected',
            date: '2024-01-15',
            adminComment: 'Please ensure your username is clearly visible in the screenshot',
            canRetry: true,
        },
        {
            ...watchTasks[1],
            rejectionReason: 'Incomplete watch time, video paused at 80%.',
            uploadedProofUrl: 'https://placehold.co/400x300/27272a/FFF?text=Watch+Proof',
            taskId: 'w-ig-1',
            id: 'w-ig-1-rejected',
            date: '2024-01-14',
            adminComment: 'Video must be watched completely. Please try again.',
            canRetry: true,
        },
        {
            ...postTasks[0],
            rejectionReason: 'Shared post is private. Make it public.',
            uploadedProofUrl: 'https://placehold.co/400x300/27272a/FFF?text=Share+Proof',
            taskId: 'p-fb-1',
            id: 'p-fb-1-rejected',
            date: '2024-01-13',
            adminComment: 'Please set post visibility to public',
            canRetry: true,
        },
    ]);

    const [reviewingRejectedTask, setReviewingRejectedTask] = useState<RejectedTaskEntry | null>(null);
    const [notifications, setNotifications] = useState<
        Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>
    >([]);

    // Notification helper
    const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
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
                task.id === taskId ? { ...task, status: 'completed' as TaskStatus } : task
            )
        );
        setCompleted((prev) => [...prev, taskId]);

        const task = activeTasks.find((t) => t.id === taskId);
        if (task) {
            setBalance((prev) => prev + task.coins);
            setEligible((prev) => prev + task.coins);
            addNotification(`Task completed! +${task.coins} Coins earned!`, 'success');
        }
    };

    // Handle verification success
    const handleVerificationSuccess = () => {
        setIsApproved(true);
        navigate('/task/dashboard/tasks');
        addNotification('Verification submitted successfully! You can now access all features.', 'success');
    };

    // Navigation helper for setDashView
    const setDashView = (view: DashboardView) => {
        const routeMap: Record<DashboardView, string> = {
            verification: '/task/dashboard/verification',
            analytics: '/task/dashboard/analytics',
            tasks: '/task/dashboard/tasks',
            leaderboard: '/task/dashboard/leaderboard',
            coinExchange: '/task/dashboard/coin-exchange',
            profile: '/task/dashboard/profile',
            payout: '/task/dashboard/payout',
            logout: '/task/onboarding',
        };
        navigate(routeMap[view]);
    };

    const setView = (view: 'landing' | 'dashboard') => {
        if (view === 'landing') {
            navigate('/task/onboarding');
        }
    };

    // Context value
    const contextValue: DashboardContextType = {
        isApproved,
        setIsApproved,
        hasPurchased,
        setHasPurchased,
        balance,
        setBalance,
        eligible,
        setEligible,
        payoutRequested,
        setPayoutRequested,
        completed,
        profile,
        activeTasks,
        rejectedTasks,
        setRejectedTasks,
        setShowVerification,
        setTaskCategory,
        setSelectedPlatform,
        setPlayingVideo,
        setVerifyingTask,
        setReviewingRejectedTask,
        setShowRequestModal,
        addNotification,
        completeTask,
        handleVerificationSuccess,
    };

    return (
        <DashboardContext.Provider value={contextValue}>
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
          
          ::selection {
            background: rgba(182, 137, 56, 0.3);
            color: white;
          }
          
          * {
            transition: background-color 0.3s ease, border-color 0.3s ease;
          }
          
          :focus-visible {
            outline: 2px solid rgba(182, 137, 56, 0.5);
            outline-offset: 2px;
          }
          
          @media (max-width: 640px) {
            .text-7xl, .text-8xl {
              font-size: 3.5rem;
            }
          }
        `,
                    }}
                />

                <DashboardLayoutComponent
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
                    title={currentConfig.title}
                    desc={currentConfig.desc}
                >
                    <AnimatedBackground />
                    <Outlet />
                </DashboardLayoutComponent>

                {/* Modals */}
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
                                setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
                            }
                        />
                    ))}
                </AnimatePresence>
            </div>
        </DashboardContext.Provider>
    );
};

export default DashboardLayoutWrapper;
