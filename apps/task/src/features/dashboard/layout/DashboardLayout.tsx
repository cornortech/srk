import React from 'react';
import { Coins, Menu, Wallet } from 'lucide-react';
import { DashboardView as DashboardViewType } from '../types';
import MobileMenu from './MobileMenu';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  dashView: DashboardViewType;
  setView: (view: 'landing' | 'dashboard') => void;
  balance: number;
  setDashView: (view: DashboardViewType) => void;
  isApproved: boolean;
  eligible: number;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  isActivated: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  dashView,
  setView,
  balance,
  setDashView,
  isApproved,
  eligible,
  isMenuOpen,
  setIsMenuOpen,
  addNotification,
  isActivated,
}) => (
  <div className="min-h-screen bg-[#0a0705]">

    {/* Header */}
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0705]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-5 h-15 flex items-center justify-between gap-4" style={{ height: '60px' }}>

        <button
          onClick={() => setView('landing')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e1ba73] to-[#b68938] flex items-center justify-center shadow-[0_2px_8px_rgba(182,137,56,0.4)] flex-shrink-0">
            <span className="font-black text-black text-sm select-none">S</span>
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-bold text-white leading-none">SRK Portal</span>
            <span className="text-[10px] text-white/35 leading-none mt-0.5">Earn Through Tasks</span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.07]">
            <Coins size={13} className="text-[#e1ba73]" />
            <span className="text-sm font-bold text-white tabular-nums">{balance.toLocaleString()}</span>
            <span className="text-xs text-white/35">coins</span>
          </div>

          {isActivated && (
            <button
              onClick={() => setDashView('coinExchange')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#b68938]/15 border border-[#b68938]/30 text-[#e1ba73] text-sm font-semibold hover:bg-[#b68938]/25 transition-colors duration-150"
            >
              <Wallet size={13} />
              <span className="hidden sm:inline">Withdraw</span>
            </button>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white/45 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>

    <MobileMenu
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      balance={balance}
      eligible={eligible}
      isApproved={isApproved}
      dashView={dashView}
      setView={setView}
      setDashView={setDashView}
      addNotification={addNotification}
      isActivated={isActivated}
    />

    <div className="max-w-7xl mx-auto px-5 py-8">
      <div className="flex flex-col lg:flex-row gap-6">

        <div className="hidden lg:block lg:w-56 flex-shrink-0">
          <Sidebar
            dashView={dashView}
            setDashView={setDashView}
            isApproved={isApproved}
            setView={setView}
            balance={balance}
            eligible={eligible}
            addNotification={addNotification}
            isActivated={isActivated}
          />
        </div>

        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  </div>
);
