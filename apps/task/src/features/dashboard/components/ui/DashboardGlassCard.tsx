import React from 'react';

// Plain element on purpose: the previous version used a framer-motion entrance
// animation, a 12px backdrop blur and an infinite shimmer on every card, which
// made pages stutter on phones. `delay` and `gradient` are kept so existing
// callers still type-check.
export const DashboardGlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
  gradient?: 'gold' | 'purple' | 'blue' | 'green';
  small?: boolean;
}> = ({ children, className = '', hover = true, onClick, small = false }) => {
  return (
    <div
      onClick={onClick}
      className={`relative ${
        small ? 'rounded-xl' : 'rounded-2xl'
      } border border-white/5 bg-zinc-900/70 ${
        hover ? 'hover:border-white/10' : ''
      } ${onClick ? 'cursor-pointer active:opacity-90' : ''} ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default DashboardGlassCard;
