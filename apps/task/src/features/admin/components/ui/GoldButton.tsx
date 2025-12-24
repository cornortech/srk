import React from 'react';
import { motion } from 'framer-motion';
import { GOLD_ACCENT, GOLD_PRIMARY } from '../../constants/theme';

interface GoldButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const GoldButton: React.FC<GoldButtonProps> = React.memo(
  ({ children, onClick, disabled = false, className = '' }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`w-full md:w-auto px-6 py-2.5 rounded-xl text-black font-extrabold text-sm uppercase tracking-[0.1em] transition-all duration-300 active:scale-95 ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
      }`}
      style={{
        background: `linear-gradient(45deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
        boxShadow: '0_0_15px_rgba(225,186,115,0.2), 0_3px_10px_rgba(0,0,0,0.5)',
      }}
      whileHover={{
        scale: disabled ? 1 : 1.02,
        boxShadow: '0_0_25px_rgba(225,186,115,0.4), 0_3px_10px_rgba(0,0,0,0.5)',
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.button>
  )
);
