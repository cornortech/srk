import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, UserCircle, Upload, LogOut } from 'lucide-react';

interface SocialSidebarProps {
  activeTab: 'analytics' | 'profile' | 'taskuploading';
  setActiveTab: (tab: 'analytics' | 'profile' | 'taskuploading') => void;
  onLogout?: () => void;
}

export const SocialSidebar: React.FC<SocialSidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-20 md:w-64 border-r border-white/10 flex flex-col bg-black/50 backdrop-blur-xl h-full fixed md:static left-0  z-50"
    >
      <nav className="flex-1 px-4 py-8 space-y-4">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'bg-[#b68938]/20 text-[#e1ba73] border border-[#b68938]/30 shadow-lg'
              : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <BarChart3 size={24} />
          <span className="font-medium hidden md:block">Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'bg-[#b68938]/20 text-[#e1ba73] border border-[#b68938]/30 shadow-lg'
              : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <UserCircle size={24} />
          <span className="font-medium hidden md:block">Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('taskuploading')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'taskuploading'
              ? 'bg-[#b68938]/20 text-[#e1ba73] border border-[#b68938]/30 shadow-lg'
              : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Upload size={24} />
          <span className="font-medium hidden md:block">Task Upload</span>
        </button>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => onLogout?.()}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <LogOut
            size={24}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="font-medium hidden md:block">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};
