import {
  BarChart3, Coins, CreditCard, DollarSign, FileClock,
  History, ListChecks, Lock, LogOut, Shield, Trophy, UserCircle, Wallet,
} from 'lucide-react';
import React from 'react';
import { DashboardView } from '../types';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';

interface SidebarProps {
  dashView: DashboardView;
  setDashView: (view: DashboardView) => void;
  isApproved: boolean;
  setView: (view: 'landing' | 'dashboard') => void;
  balance: number;
  eligible: number;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  isActivated: boolean;
}

const navItems: {
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
  { view: 'logout', icon: LogOut, label: 'Logout' },
];

const Sidebar: React.FC<SidebarProps> = ({
  dashView, setDashView, isApproved, setView, balance, eligible, addNotification, isActivated,
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

  return (
    <aside className="flex flex-col gap-1">
      <nav className="flex flex-col gap-0.5">
        {navItems
          .filter(item => !(item.requiresActivation && !isActivated))
          .map(item => {
            const Icon = item.icon;
            const isDisabled = !!item.requiresApproval && !isApproved;
            const isActive = dashView === item.view;
            const isLogout = item.view === 'logout';
            const badge = getBadge(item.view);

            return (
              <button
                key={item.view}
                onClick={() => {
                  if (isDisabled) return;
                  if (isLogout) { setView('landing'); addNotification('Logged out', 'info'); return; }
                  setDashView(item.view);
                }}
                disabled={isDisabled}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-all duration-150',
                  isActive
                    ? 'bg-[#b68938]/12 text-white font-semibold shadow-[inset_0_0_0_1px_rgba(182,137,56,0.2)]'
                    : isLogout
                    ? 'text-white/35 hover:text-red-400 hover:bg-red-500/[0.07] mt-2'
                    : 'text-white/50 hover:text-white/85 hover:bg-white/[0.05]',
                  isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                ].join(' ')}
                style={isActive ? { backgroundColor: 'rgba(182,137,56,0.12)' } : undefined}
              >
                <Icon
                  size={15}
                  className={`flex-shrink-0 ${isActive ? 'text-[#e1ba73]' : isLogout ? 'inherit' : ''}`}
                />
                <span>{item.label}</span>

                {badge ? (
                  <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                    {badge}
                  </span>
                ) : isDisabled ? (
                  <Lock size={11} className="ml-auto text-white/20 flex-shrink-0" />
                ) : null}
              </button>
            );
          })}
      </nav>

      {/* Balance block */}
      <div className="mt-6 rounded-xl bg-gradient-to-br from-[#1a1408] to-[#111007] border border-[#b68938]/15 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#b68938]/60 mb-3">Balance</p>
        <div className="flex items-center gap-2 mb-1">
          <Coins size={14} className="text-[#e1ba73]" />
          <span className="text-xl font-bold text-white tabular-nums">{balance.toLocaleString()}</span>
          <span className="text-xs text-white/35">coins</span>
        </div>
        {eligible > 0 && (
          <p className="text-xs text-white/35">Eligible: {eligible.toLocaleString()} coins</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
