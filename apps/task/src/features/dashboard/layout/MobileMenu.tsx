import React from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  Shield,
  BarChart3,
  ListChecks,
  Trophy,
  DollarSign,
  UserCircle,
  Wallet,
  Lock,
  LogOut,
  Coins,
} from 'lucide-react';
import { DashboardView, RejectedTaskEntry } from '../../../types/dashboard';
import DashboardGlassCard from '../../../components/ui/dashboard/DashboardGlassCard';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  balance: number;
  eligible: number;
  isApproved: boolean;
  dashView: DashboardView;
  rejectedTasks: RejectedTaskEntry[];
  setView: (view: 'landing' | 'dashboard') => void;
  setDashView: (view: DashboardView) => void;
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  balance,
  eligible,
  isApproved,
  dashView,
  rejectedTasks,
  setView,
  setDashView,
  addNotification,
}) => {
  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-6 right-6 z-50 p-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10"
      >
        <Menu size={24} className="text-white" />
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute right-0 top-0 h-full w-80 bg-linear-to-b from-[#1a1410] to-[#0a0a0a] border-l border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Mobile Sidebar Content */}
              <div className="space-y-4">
                {/* Balance Display */}
                <DashboardGlassCard small>
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <Coins
                        size={20}
                        className="from-[#ac9976] to-[#e1ba73]"
                      />
                      <div>
                        <p className="text-sm text-zinc-400">Your Balance</p>
                        <p className="text-xl font-bold text-white">
                          {balance.toLocaleString()} Coins
                        </p>
                        <p className="text-xs text-zinc-500">
                          Eligible: {eligible} Coins
                        </p>
                      </div>
                    </div>
                  </div>
                </DashboardGlassCard>

                {/* Navigation */}
                <div className="space-y-2">
                  {[
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
                      badge: rejectedTasks.length,
                    },
                    { view: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
                    {
                      view: 'coinExchange',
                      icon: DollarSign,
                      label: 'Coin Exchange',
                    },
                    { view: 'profile', icon: UserCircle, label: 'Profile' },
                    { view: 'payout', icon: Wallet, label: 'Legacy Payout' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isDisabled = item.requiresApproval && !isApproved;
                    const isActive = dashView === item.view;

                    return (
                      <button
                        key={item.view}
                        onClick={() => {
                          if (!isDisabled) {
                            setIsMenuOpen(false);
                          }
                        }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                          ${
                            isActive
                              ? 'bg-linear-to-r from-[#b68938]/20 to-[#b68938]/10 text-white border border-white/10'
                              : 'text-zinc-400 hover:text-white hover:bg-white/5'
                          }
                          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        disabled={isDisabled}
                      >
                        <Icon
                          size={20}
                          className={
                            isActive ? 'from-[#ac9976] to-[#e1ba73]' : ''
                          }
                        />
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {isDisabled && (
                          <Lock size={16} className="ml-auto text-zinc-500" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setView('landing');
                    setIsMenuOpen(false);
                    addNotification('Logged out successfully', 'info');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-8"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default MobileMenu;
