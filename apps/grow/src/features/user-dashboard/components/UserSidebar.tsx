import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, UserCircle, LogOut, X } from 'lucide-react';

interface UserSidebarProps {
  activeTab: 'analytics' | 'profile' | 'taskuploading';
  setActiveTab: (tab: 'analytics' | 'profile' | 'taskuploading') => void;
  onLogout: () => void;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu?: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  isMobileMenuOpen,
  onCloseMobileMenu,
}) => {
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-black/95 backdrop-blur-xl border-r border-white/10
    transform transition-transform duration-300 ease-in-out flex flex-col h-full
    md:static md:translate-x-0 md:bg-black/20
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <motion.aside className={sidebarClasses}>
      <div className="flex md:hidden justify-between items-center p-4 border-b border-white/10">
        <span className="font-bold text-lg text-white">Menu</span>
        <button
          onClick={onCloseMobileMenu}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-4">
        <button
          onClick={() => {
            setActiveTab('analytics');
            onCloseMobileMenu?.();
          }}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'analytics'
            ? 'bg-[#b68938]/20 text-[#e1ba73] border border-[#b68938]/30 shadow-lg'
            : 'text-gray-400 hover:bg-white/5'
            }`}
        >
          <BarChart3 size={24} />
          <span className="font-medium">Analytics</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('profile');
            onCloseMobileMenu?.();
          }}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile'
            ? 'bg-[#b68938]/20 text-[#e1ba73] border border-[#b68938]/30 shadow-lg'
            : 'text-gray-400 hover:bg-white/5'
            }`}
        >
          <UserCircle size={24} />
          <span className="font-medium">Profile</span>
        </button>

        {/* <button
          onClick={() => {
            setActiveTab('taskuploading');
            onCloseMobileMenu?.();
          }}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'taskuploading'
              ? 'bg-[#b68938]/20 text-[#e1ba73] border border-[#b68938]/30 shadow-lg'
              : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Upload size={24} />
          <span className="font-medium">Task Upload</span>
        </button> */}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <LogOut
            size={24}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};
