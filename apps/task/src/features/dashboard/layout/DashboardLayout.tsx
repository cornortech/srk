import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Coins, Wallet } from 'lucide-react';
import { DashboardView as DashboardViewType } from '../types';
import DashboardGradientText from '../components/ui/DashboardGradientText';
import MagneticButton from '../components/ui/DashboardMagneticButton';
import MobileMenu from './MobileMenu';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  dashView: DashboardViewType;
  setView: (view: 'landing' | 'dashboard') => void;
  balance: number;
  setDashView: (view: DashboardViewType) => void;
  // Props for sidebar/mobile menu
  isApproved: boolean;
  eligible: number;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void;
  isActivated: boolean;
  // title: string;
  // desc: string;
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
  // title,
  // desc,
}) => {
  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-10 h-10 rounded-full bg-div-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center cursor-pointer"
                  onClick={() => setView('landing')}
                >
                  <span className="font-bold text-black">S</span>
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    <DashboardGradientText>SRK Portal</DashboardGradientText>
                  </h1>
                  <p className="text-xs text-zinc-400">Earn Through Tasks</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Balance Display */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full group">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Coins size={16} className="text-amber-400" />
                  </motion.div>
                  <span className="text-white font-bold">
                    {balance.toLocaleString()}
                  </span>
                  <span className="text-zinc-400 text-sm">Coins</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={16} className="text-zinc-500" />
                  </div>
                </div>

                {/* Withdraw Button - Only show if portal is activated */}
                {isActivated && (
                  <MagneticButton
                    small
                    onClick={() => setDashView('coinExchange')}
                  >
                    <Wallet size={16} /> Withdraw
                  </MagneticButton>
                )}
              </div>
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

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
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

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* <div className="mb-8">
                <motion.div
                  key={dashView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h1 className="text-4xl font-bold text-white mb-2">
                    <DashboardGradientText>{title}</DashboardGradientText>
                  </h1>
                  <p className="text-zinc-400">{desc}</p>
                </motion.div>
              </div> */}
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
