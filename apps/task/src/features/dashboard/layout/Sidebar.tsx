import {
  BarChart3,
  Coins,
  DollarSign,
  ListChecks,
  Lock,
  LogOut,
  Shield,
  Trophy,
  UserCircle,
  Wallet,
} from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';
import { DashboardView, RejectedTaskEntry } from '../../../types/dashboard';
import { DashboardGlassCard } from './../../../components/ui/dashboard/DashboardGlassCard';

interface SidebarProps {
  dashView: DashboardView;
  setDashView: (view: DashboardView) => void;
  isApproved: boolean;
  rejectedTasks: RejectedTaskEntry[];
  setView: (view: 'landing' | 'dashboard') => void;
  balance: number;
  eligible: number;
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  dashView,
  setDashView,
  isApproved,
  rejectedTasks,
  setView,
  balance,
  eligible,
  addNotification,
}) => {
  const navItems: {
    view: DashboardView;
    icon: React.FC<any>;
    label: string;
    requiresApproval?: boolean;
    badge?: number;
  }[] = [
    {
      view: 'verification',
      icon: Shield,
      label: 'Verification',
      badge: !isApproved ? 1 : undefined,
    },
    {
      view: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
      requiresApproval: true,
    },
    {
      view: 'tasks',
      icon: ListChecks,
      label: 'Tasks',
      requiresApproval: true,
      badge: rejectedTasks.length,
    },
    {
      view: 'leaderboard',
      icon: Trophy,
      label: 'Leaderboard',
      requiresApproval: true,
    },
    {
      view: 'coinExchange',
      icon: DollarSign,
      label: 'Coin Exchange',
      requiresApproval: true,
    },
    {
      view: 'profile',
      icon: UserCircle,
      label: 'Profile',
      requiresApproval: true,
    },
    {
      view: 'payout',
      icon: Wallet,
      label: 'Legacy Payout',
      requiresApproval: true,
    },
    { view: 'logout', icon: LogOut, label: 'Logout' },
  ];

  return (
    <aside className="w-full lg:w-64 shrink">
      <DashboardGlassCard className="h-full p-6">
        <div className="flex items-center gap-3 mb-8">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 rounded-full bg-div-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center"
          >
            <span className="font-bold text-black text-xl">S</span>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">SRK Portal</h1>
            <p className="text-xs text-zinc-400">Earn Through Tasks</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = item.requiresApproval && !isApproved;
            const isActive = dashView === item.view;

            return (
              <motion.button
                key={item.view}
                onClick={() => {
                  if (!isDisabled && item.view !== 'logout') {
                    setDashView(item.view);
                  }
                  if (item.view === 'logout') {
                    setView('landing');
                    addNotification('Logged out successfully', 'info');
                  }
                }}
                whileHover={!isDisabled ? { x: 5 } : {}}
                className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative
                    ${
                      isActive
                        ? 'bg-linear-to-r from-[#b68938]/20 to-[#b68938]/10 text-white border border-white/10'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${
                      item.view === 'logout'
                        ? 'mt-8 border-t border-white/10 pt-8'
                        : ''
                    }
                  `}
                disabled={isDisabled}
              >
                <Icon
                  size={18}
                  className={isActive ? 'from-[#ac9976] to-[#e1ba73]' : ''}
                />
                <span className="text-sm font-medium">{item.label}</span>

                {item.badge && (
                  <span className="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}

                {isDisabled && (
                  <Lock size={14} className="ml-auto text-zinc-500" />
                )}

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-400 rounded-r-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Balance display */}
        <div className="mt-8 p-4 bg-linear-to-r from-[#b68938]/10 to-[#e1ba73]/10 rounded-xl border border-white/10">
          <p className="text-xs text-zinc-400 mb-1">Your Balance</p>
          <div className="flex items-center gap-2">
            <Coins size={16} className="text-amber-400" />
            <p className="text-lg font-bold text-white">
              {balance.toLocaleString()} Coins
            </p>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Eligible: {eligible} Coins
          </p>
        </div>
      </DashboardGlassCard>
    </aside>
  );
};

export default Sidebar;
