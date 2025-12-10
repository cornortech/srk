import React from 'react';
import { motion } from 'framer-motion';

export const DashboardGlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
  gradient?: 'gold' | 'purple' | 'blue' | 'green';
  small?: boolean;
}> = ({
  children,
  className = '',
  hover = true,
  onClick,
  delay = 0,
  gradient = 'gold',
  small = false,
}) => {
  const gradientMap = {
    gold: 'from-[#b68938]/20 via-[#b68938]/10 to-transparent',
    purple: 'from-[#8B5CF6]/20 via-[#8B5CF6]/10 to-transparent',
    blue: 'from-[#3B82F6]/20 via-[#3B82F6]/10 to-transparent',
    green: 'from-[#10B981]/20 via-[#10B981]/10 to-transparent',
  };

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      whileHover={
        hover
          ? { scale: small ? 1.02 : 1.02, y: -4, transition: { duration: 0.2 } }
          : {}
      }
      className={`relative ${
        small ? 'rounded-xl' : 'rounded-2xl'
      } border border-white/5 bg-gradient-to-br from-white/5 to-white/2 hover:border-white/10 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 ${
          small ? 'rounded-xl' : 'rounded-2xl'
        } bg-gradient-to-br ${
          gradientMap[gradient]
        } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Animated border */}
      <div
        className={`absolute inset-0 ${small ? 'rounded-xl' : 'rounded-2xl'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b68938]/0 to-transparent animate-[shimmer_2s_infinite]" />
      </div>

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default DashboardGlassCard;
