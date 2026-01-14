import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { DashboardProps } from '../lib/types/types';
import { UserSidebar } from '../features/user-dashboard/components/UserSidebar';
import { AnalyticsView } from '../features/user-dashboard/views/AnalyticsView';
import { UserProfileView } from '../features/user-dashboard/views/UserProfileViews';

export const UserDashboard: React.FC<DashboardProps> = ({ user, enrollmentData, onLogout }) => {
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'profile' | 'taskuploading'
  >('analytics');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a0705] text-white overflow-hidden font-sans ">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Sidebar */}
      <UserSidebar
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        onLogout={onLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        {/* Background Gradients */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#b68938]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#e1ba73]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {activeTab === 'analytics'
                  ? 'Overview'
                  : activeTab === 'profile'
                  ? 'My Profile'
                  : 'Task Upload'}
              </h1>
              <p className="text-gray-400 text-sm md:text-lg">
                Welcome back, {user.fullName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hidden md:block">
              ID: {user._id?.slice(0, 8)}...
            </div>

            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center text-black font-bold text-lg md:text-xl">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Analytics Tab Content */}
        {activeTab === 'analytics' && <AnalyticsView />}
        {/* Profile Tab Content */}
        {activeTab === 'profile' && <UserProfileView user={user} />}
        {/* Task Upload Tab Content */}
        {/* {activeTab === 'taskuploading' && <TaskUploadView />} */}
      </main>
    </div>
  );
};
