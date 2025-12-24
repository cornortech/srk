import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGrowAuthStore from '../../store/useGrowAuthStore';

interface NavbarProps {
  onUserUpdate?: (user: any) => void;
  onDashboardClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useGrowAuthStore();

  const buttonAction = () => {
    navigate('/login');
  };

  const handleDashboardClick = () => {
    if (!user) return;
    if (user.status === 'portalActivated') {
      navigate('/dashboard');
    } else {
      navigate('/grow/verification');
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 w-full flex justify-center z-[100] pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-auto relative flex items-center justify-between px-6 py-4 md:px-10"
          style={{
            width: '900px',
            borderRadius: '50px',
            backgroundColor: 'rgba(26, 20, 16, 0.8)',
            backdropFilter: 'blur(20px)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgba(182,137,56,0.3)',
            maxWidth: '95vw',
            marginTop: '24px',
          }}
        >
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center shadow-[0_0_15px_rgba(182,137,56,0.3)]">
              <Zap size={20} className="text-black" />
            </div>
            <h1
              className="ml-3 text-xl font-bold text-white cursor-pointer"
              onClick={() => navigate('/')}
            >
              SRK<span className="text-[#b68938]">Grow</span>
            </h1>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDashboardClick}
                className="px-6 py-2.5 rounded-full bg-white/5 border border-[#b68938]/30 text-[#b68938] hover:bg-[#b68938]/10 font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={buttonAction}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(182,137,56,0.6)]"
              >
                Login
              </motion.button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-4">
            {user ? (
              <button
                onClick={handleDashboardClick}
                className="w-10 h-10 rounded-full bg-[#b68938]/20 border border-[#b68938]/40 flex items-center justify-center text-[#b68938]"
              >
                <LayoutDashboard size={20} />
              </button>
            ) : (
              <button
                onClick={buttonAction}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold text-sm"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <X size={20} className="text-white" />
              ) : (
                <Menu size={20} className="text-white" />
              )}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#0a0705]/98 backdrop-blur-lg z-[90] pt-32 px-8 md:hidden flex flex-col gap-4"
          >
            {user ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDashboardClick}
                className="w-full py-5 rounded-2xl bg-[#b68938]/10 border border-[#b68938]/30 text-[#b68938] font-bold text-lg flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={22} />
                Go to Dashboard
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  buttonAction();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold text-lg"
              >
                Login
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
