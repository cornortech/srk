import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { UserData } from '../../lib/types/types';
import LoginModel from '../user-components/auth/LoginModel';

interface NavbarProps {
  user: UserData | null;
  onUserUpdate: (user: UserData | null) => void;
  onDashboardClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  onUserUpdate,
  onDashboardClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("srkgrow_users") || "[]");
    setHasRegistered(users.length > 0);
  }, []);

  const handleLoginSuccess = (userData: UserData) => {
    onUserUpdate(userData);
    setShowAuthModal(false);
  };

  const buttonText = user
    ? "Dashboard"
    : hasRegistered
      ? "Login Now"
      : "Get Started";

  const buttonAction = user
    ? onDashboardClick
    : () => setShowAuthModal(true);

  return (
    <>
      <div className="fixed top-0 w-full flex justify-center z-[100] pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-auto relative flex items-center justify-between px-6 py-4 md:px-10"
          style={{
            width: "900px",
            borderRadius: "50px",
            backgroundColor: "rgba(26, 20, 16, 0.8)",
            backdropFilter: "blur(20px)",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "rgba(182,137,56,0.3)",
            maxWidth: "95vw",
            marginTop: "24px"
          }}
        >
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center shadow-[0_0_15px_rgba(182,137,56,0.3)]">
              <Zap size={20} className="text-black" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-white">
              SRK<span className="text-[#b68938]">Grow</span>
            </h1>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={buttonAction}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(182,137,56,0.6)]"
            >
              {buttonText}
            </motion.button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={buttonAction}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold text-sm"
            >
              {buttonText}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
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
            className="fixed inset-0 bg-[#0a0705]/98 backdrop-blur-lg z-[90] pt-32 px-8 md:hidden"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                buttonAction();
                setMobileMenuOpen(false);
              }}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold text-lg"
            >
              {buttonText}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <LoginModel
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={handleLoginSuccess}
            hasRegistered={hasRegistered}
            initialMode={hasRegistered ? "login" : "register"}
            onRegistrationComplete={() => setHasRegistered(true)}   // ✅ ADDED FIX
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
