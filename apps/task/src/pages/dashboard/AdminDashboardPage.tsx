import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ListChecks,
  Users,
  Trophy,
  Menu,
  Wallet,
  Repeat2,
  CheckCircle,
} from 'lucide-react';
import { useIsDesktop } from '../../features/admin/hooks/useIsDesktop';
import { NavLink, Payout } from '../../features/admin/types';
import { VerificationContent } from '../../features/admin/views/VerificationContent';
import { PayoutRequestsContent } from '../../features/admin/views/PayoutRequestsContent';
import { TransactionsContent } from '../../features/admin/views/TransactionsContent';
import { TaskDoneContent } from '../../features/admin/views/TaskDoneContent';
import { TaskVerificationContent } from '../../features/admin/views/TaskVerificationContent';
import { AllUsersContent } from '../../features/admin/views/AllUsersContent';
import { LeaderboardContent } from '../../features/admin/views/LeaderboardContent';
import {
  DARK_BG,
  GOLD_PRIMARY,
  TEXT_LIGHT,
} from '../../features/admin/constants/theme';
import { Sidebar } from '../../features/admin/layout/Sidebar';

export const AdminDashboard: React.FC = () => {
  const isDesktop = useIsDesktop();
  const [selectedSection, setSelectedSection] =
    useState<string>('Payout Requests');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(isDesktop);

  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  const handleSrkBankClick = useCallback(() => {
    console.log('Redirecting to SRK Bank...');
    window.open('https://srk-bank-external-link.com', '_blank');
  }, []);

  const navLinks: NavLink[] = useMemo(
    () => [
      {
        name: 'Verification',
        icon: ShieldCheck,
        content: <VerificationContent />,
      },
      {
        name: 'Payout Requests',
        icon: Wallet,
        content: <PayoutRequestsContent />,
      },
      {
        name: 'Transactions',
        icon: Repeat2,
        content: <TransactionsContent />,
      },
      {
        name: 'Task Done',
        icon: ListChecks,
        content: <TaskDoneContent />,
      },
      {
        name: 'Task Verification',
        icon: CheckCircle,
        content: <TaskVerificationContent />,
      },
      {
        name: 'All Users',
        icon: Users,
        content: <AllUsersContent />,
      },
      {
        name: 'Leaderboard',
        icon: Trophy,
        content: <LeaderboardContent />,
      },
    ],
    []
  );

  const currentContent = useMemo(
    () => navLinks.find((link) => link.name === selectedSection)?.content,
    [navLinks, selectedSection]
  );

  return (
    <div
      className="min-h-screen flex antialiased"
      style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: DARK_BG,
        color: TEXT_LIGHT,
      }}
    >
      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar
            key="sidebar"
            isDesktop={isDesktop}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            navLinks={navLinks}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            onSrkBankClick={handleSrkBankClick}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 p-4 md:px-8 flex items-center bg-[#0A0705] z-30 border-b border-gray-700/50"
          style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.7)' }}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-white hover:text-[#E1BA73] p-2 mr-4"
          >
            <Menu size={28} />
          </button>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wider truncate">
            {selectedSection} <span style={{ color: GOLD_PRIMARY }}>ADMIN</span>
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentContent}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
