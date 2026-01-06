import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardData } from '../lib/types/admin';
import {
  ALL_USERS_DATA,
  mockAdminData,
  mockQueueData,
  PRIVATE_TASK_PERFORMANCE_DATA,
  TASK_MONITORING_DATA,
} from '../data/adminMock';
import { GlobalOverviewView } from '../features/admin/views/GlobalOverviewView';
import { AffiliateVerificationView } from '../features/admin/views/AffiliateVerificationView';
import { UserVerificationView } from '../features/admin/views/UserVerificationView';
import { TaskMonitoringView } from '../features/admin/views/TaskMonitoringViewNew';
import { AffiliateUsersView } from '../features/admin/views/AffiliateUsersView';
import { PackageUsersView } from '../features/admin/views/PackageUsersView';
import { CreateUserView } from '../features/admin/views/CreateUserView';
import { PackageManagementView } from '../features/admin/views/PackageManagementView';
import { PayoutQueueView } from '../features/admin/views/PayoutQueueView';
import { PerformanceTrendView } from '../features/admin/views/PerformanceTrendView';
import { FloatingParticles } from '../features/admin/components/ui/FloatingParticles';
import { Sidebar } from '../features/admin/components/AdminSidebar';
import { MagneticButton } from '../lib/ui/MagneticButton';

export const GrowOnlyAdminDashboard = () => {
  const [activeView, setActiveView] = useState('global');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  const data: DashboardData = useMemo(
    () => ({
      allUsers: ALL_USERS_DATA,
      privateTaskPerformance: PRIVATE_TASK_PERFORMANCE_DATA,
      taskMonitoringData: TASK_MONITORING_DATA,
      trends: mockQueueData.trends,
      ...mockAdminData,
    }),
    []
  );

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY < 50) {
      setIsNavVisible(true);
    } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsNavVisible(false);
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const renderView = useCallback(() => {
    switch (activeView) {
      case 'global':
        return <GlobalOverviewView />;
      case 'affiliateverification':
        // srk grow affiliate verification request view
        return <AffiliateVerificationView />;
      case 'userverification':
        // srk grow package enrollment request view
        return <UserVerificationView />;
      case 'taskmonitoring':
        return <TaskMonitoringView />;
      case 'affiliatelist':
        return <AffiliateUsersView />;
      case 'packagelist':
        return <PackageUsersView />;
      case 'createuser':
        return <CreateUserView />;
      case 'packagemanagement':
        return <PackageManagementView />;
      case 'payoutqueue':
        return <PayoutQueueView />;
      case 'trend':
        return <PerformanceTrendView data={data} />;
      default:
        return <GlobalOverviewView />;
    }
  }, [activeView, data]);

  const handleViewChange = useCallback((view: string) => {
    setActiveView(view);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const getViewTitle = useCallback(() => {
    switch (activeView) {
      case 'global':
        return 'Global Overview';
      case 'affiliateverification':
        return 'Affiliate Verification';
      case 'userverification':
        return 'User Verification';
      case 'paymentverification':
        return 'Payment Verification';
      case 'taskmonitoring':
        return 'Task Monitoring';
      case 'privatetasks':
        return 'Private Tasks';
      case 'affiliatelist':
        return 'Affiliate Users';
      case 'packagelist':
        return 'Package Users';
      case 'createuser':
        return 'Create User';
      case 'payoutqueue':
        return 'Payout Queue';
      case 'trend':
        return 'Performance Trends';
      default:
        return 'Dashboard';
    }
  }, [activeView]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0a05] to-black" />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[128px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
            delay: 5,
          }}
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[128px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(182,137,56,0.1)_0%,transparent_50%)]" />
      </div>

      <FloatingParticles />

      <div className="hidden lg:block">
        <Sidebar activeView={activeView} setActiveView={handleViewChange} />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar
            activeView={activeView}
            setActiveView={handleViewChange}
            isMobile={true}
            onClose={handleSidebarClose}
          />
        )}
      </AnimatePresence>

      {/* <FloatingNavBar
        activeView={activeView}
        setActiveView={handleViewChange}
      /> */}

      <main ref={mainRef} className="lg:ml-64 min-h-screen">
        <motion.header
          initial={{ y: 0 }}
          animate={{ y: isNavVisible ? 0 : -100 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-30 p-4 sm:p-6 border-b border-white/10 bg-black/80 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSidebarToggle}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-white text-lg">☰</span>
              </motion.button>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {getViewTitle()}
                </h2>
                <p className="text-sm text-gray-400">
                  Last updated: Today, 2:45 PM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="hidden sm:flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-emerald-500"
                />
                <span>Live</span>
              </motion.div>
              <MagneticButton
                className="px-4 py-2 text-sm"
                onClick={handleRefresh}
              >
                <span>🔄</span>
                Refresh Data
              </MagneticButton>
            </div>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6"
        >
          {renderView()}
        </motion.div>

        <footer className="mt-8 p-6 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>© 2024 SRK Admin Dashboard. All rights reserved.</p>
          <p className="mt-1">Version 2.0.1 • Premium Theme</p>
        </footer>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { 
          font-family: 'Inter', sans-serif; 
          transition: background-color 0.2s ease, border-color 0.2s ease; 
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(182, 137, 56, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(182, 137, 56, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(182, 137, 56, 0.5);
        }
        
        ::selection {
          background: rgba(182, 137, 56, 0.3);
          color: white;
        }
        
        :focus-visible {
          outline: 2px solid #b68938;
          outline-offset: 2px;
        }
        
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.5s;
        }
        
        .glass-card:hover::before {
          left: 100%;
        }

        @media (max-width: 768px) {
          .glass-card {
            background: rgba(26, 20, 16, 0.8) !important;
            backdrop-filter: blur(20px) !important;
          }
          
          table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
          
          td, th {
            min-width: 120px;
          }
        }
      `,
        }}
      />
    </div>
  );
};
