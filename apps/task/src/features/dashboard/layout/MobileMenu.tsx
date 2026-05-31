import React from 'react';
import {
  X, Shield, BarChart3, ListChecks, Trophy, DollarSign,
  UserCircle, Wallet, Lock, LogOut, Coins, FileClock, History, CreditCard,
} from 'lucide-react';
import { DashboardView } from '../types';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  balance: number;
  eligible: number;
  isApproved: boolean;
  dashView: DashboardView;
  setView: (view: 'landing' | 'dashboard') => void;
  setDashView: (view: DashboardView) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  isActivated: boolean;
}

const mobileNavItems: {
  view: DashboardView;
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
  requiresApproval?: boolean;
  requiresActivation?: boolean;
}[] = [
  { view: 'verification', icon: Shield, label: 'Verification' },
  { view: 'analytics', icon: BarChart3, label: 'Analytics', requiresApproval: true },
  { view: 'tasks', icon: ListChecks, label: 'Tasks', requiresApproval: true },
  { view: 'taskHistory', icon: FileClock, label: 'Task History', requiresApproval: true },
  { view: 'leaderboard', icon: Trophy, label: 'Leaderboard', requiresApproval: true },
  { view: 'coinExchange', icon: DollarSign, label: 'Coin Exchange', requiresApproval: true, requiresActivation: true },
  { view: 'finance', icon: History, label: 'Finance History', requiresApproval: true },
  { view: 'paymentDetails', icon: CreditCard, label: 'Payment Details', requiresApproval: true },
  { view: 'profile', icon: UserCircle, label: 'Profile', requiresApproval: true },
  { view: 'payout', icon: Wallet, label: 'Legacy Payout', requiresApproval: true },
];

const MobileMenu: React.FC<MobileMenuProps> = ({
  isMenuOpen, setIsMenuOpen, balance, eligible, isApproved,
  dashView, setView, setDashView, addNotification, isActivated,
}) => {
  const { taskUserID } = useTaskAuthStore();

  const { data: rejectedTasksData } = api.srkTask.getRejectedSrkTaskActionSubmissionsByUser.useQuery(
    ['getRejectedSrkTaskActionSubmissionsByUser', taskUserID],
    { params: { userId: taskUserID || '' }, query: { page: '1', limit: '1' } },
    { enabled: !!taskUserID && isApproved, queryKey: ['getRejectedSrkTaskActionSubmissionsByUser', taskUserID || ''] }
  );

  const rejectedCount = rejectedTasksData?.body?.totalRecords || 0;
  const getBadge = (view: DashboardView) => {
    if (view === 'verification' && !isApproved) return 1;
    if (view === 'tasks' && rejectedCount > 0) return rejectedCount;
    return undefined;
  };

  if (!isMenuOpen) return null;

  return (
    <>
      <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />

      <div className="lg:hidden fixed right-0 top-0 h-full w-72 z-50 bg-[#0f0e0c] border-l border-white/[0.07] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.07]">
            <Coins size={13} className="text-[#e1ba73]" />
            <span className="text-sm font-bold text-white tabular-nums">{balance.toLocaleString()}</span>
            <span className="text-xs text-white/35">coins</span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
          {mobileNavItems
            .filter(item => !(item.requiresActivation && !isActivated))
            .map(item => {
              const Icon = item.icon;
              const isDisabled = !!item.requiresApproval && !isApproved;
              const isActive = dashView === item.view;
              const badge = getBadge(item.view);

              return (
                <button
                  key={item.view}
                  onClick={() => { if (isDisabled) return; setDashView(item.view); setIsMenuOpen(false); }}
                  disabled={isDisabled}
                  className={[
                    'flex items-center gap-3 px-3 py-3 rounded-lg text-sm w-full text-left transition-all duration-150',
                    isActive
                      ? 'text-white font-semibold shadow-[inset_0_0_0_1px_rgba(182,137,56,0.2)]'
                      : 'text-white/50 hover:text-white/85 hover:bg-white/[0.05]',
                    isDisabled ? 'opacity-40 cursor-not-allowed' : '',
                  ].join(' ')}
                  style={isActive ? { backgroundColor: 'rgba(182,137,56,0.12)' } : undefined}
                >
                  <Icon size={16} className={`flex-shrink-0 ${isActive ? 'text-[#e1ba73]' : ''}`} />
                  <span>{item.label}</span>
                  {badge ? (
                    <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">{badge}</span>
                  ) : isDisabled ? (
                    <Lock size={12} className="ml-auto text-white/20" />
                  ) : null}
                </button>
              );
            })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/[0.06] p-3">
          {eligible > 0 && (
            <p className="text-xs text-white/25 px-3 mb-2">Eligible: {eligible.toLocaleString()} coins</p>
          )}
          <button
            onClick={() => { setView('landing'); setIsMenuOpen(false); addNotification('Logged out', 'info'); }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm w-full text-left text-white/40 hover:text-red-400 hover:bg-red-500/[0.07] transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </>
  );
};

export default MobileMenu;
