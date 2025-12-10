import { UserIcon, WalletIcon, XIcon } from 'lucide-react';
import { GOLD_ACCENT, GOLD_PRIMARY } from '../constants';
import { NavItem, ViewId } from 'apps/grow/src/lib/types/dashboard';
import {
  BanknoteIcon,
  HomeIcon,
  ShareIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
} from './ui/DashboardIcons';
import React from 'react';
import { MOCK_USER_PROFILE } from '../../../data/dashboardMock';

interface DashboardSidebarProps {
  isMobile: boolean;
  currentView: ViewId;
  isOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onNavigate: (item: NavItem) => void;
}
export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isMobile,
  currentView,
  isOpen,
  setIsSidebarOpen,
  onNavigate,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: HomeIcon,
      color: `text-[${GOLD_PRIMARY}]`,
    },
    {
      id: 'referral',
      label: 'Referral',
      icon: ShareIcon,
      color: 'text-blue-400',
    },
    {
      id: 'mysales',
      label: 'My Sales',
      icon: ShoppingBagIcon,
      color: 'text-violet-400',
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: TrendingUpIcon,
      color: 'text-emerald-400',
    },
    { id: 'payout', label: 'Payout', icon: WalletIcon, color: 'text-cyan-400' },
    { id: 'profile', label: 'Profile', icon: UserIcon, color: 'text-gray-300' },
    {
      id: 'srkbank',
      label: 'SRK Bank',
      icon: BanknoteIcon,
      external: true,
      color: 'text-gray-400',
    },
  ];

  return (
    <div
      className={`
      ${
        isMobile
          ? 'fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300'
          : 'hidden md:flex md:fixed md:top-0 md:left-0 md:h-full md:w-64'
      }
      ${
        isMobile && isOpen
          ? 'translate-x-0'
          : isMobile
          ? '-translate-x-full'
          : ''
      }
      flex-col
      shadow-2xl
      backdrop-blur-xl
    `}
      style={{
        background: 'rgba(20, 17, 14, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(225, 186, 115, 0.15)',
        boxShadow: '0 0 60px rgba(225, 186, 115, 0.1)',
      }}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E1BA73] to-[#B68938] rounded-full blur-md opacity-70"></div>
            <div className="relative w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#E1BA73] to-[#B68938]">
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">SRK GROW</h1>
            <p className="text-xs" style={{ color: GOLD_PRIMARY }}>
              Gold Edition
            </p>
          </div>
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <XIcon className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-1 p-4 flex-grow">
        {navItems.map((item: NavItem) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item)}
            className={`
              relative overflow-hidden group
              flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 text-left
              ${
                currentView === item.id && !item.external
                  ? `bg-gradient-to-r from-[${GOLD_PRIMARY}]/10 to-[${GOLD_PRIMARY}]/5 text-[${GOLD_PRIMARY}] font-medium border border-[${GOLD_PRIMARY}]/20`
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
              ${
                item.external
                  ? 'border border-gray-700/50 hover:border-gray-600/50'
                  : ''
              }
            `}
          >
            {React.createElement(item.icon, {
              className: `w-5 h-5 ${item.color}`,
            })}
            <span>{item.label}</span>
            {currentView === item.id && !item.external && (
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-1.5 h-6 rounded-l"
                style={{
                  background: `linear-gradient(180deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
                  boxShadow: `0 0 10px ${GOLD_PRIMARY}`,
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        ))}
      </nav>

      {/* Profile Footer */}
      <div className="p-4 border-t border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E1BA73] to-[#B68938] rounded-full blur-md opacity-50"></div>
            <div className="relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-[#E1BA73] to-[#B68938]">
              {MOCK_USER_PROFILE.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="text-sm flex-1 min-w-0">
            <p className="font-medium text-white truncate">
              {MOCK_USER_PROFILE.name}
            </p>
            <p
              className="text-gray-500 truncate"
              title={MOCK_USER_PROFILE.userId}
            >
              {MOCK_USER_PROFILE.userId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
