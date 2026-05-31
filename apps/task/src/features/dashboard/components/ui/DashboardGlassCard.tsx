import React from 'react';

// Clean card with warm dark background, subtle border, tasteful radius.
// Replaces the glassmorphism + shimmer original while keeping the same API.
export const DashboardGlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
  gradient?: 'gold' | 'purple' | 'blue' | 'green';
  small?: boolean;
}> = ({ children, className = '', hover = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-[#111008] rounded-xl border border-white/[0.07]',
        hover ? 'hover:border-[#b68938]/25 transition-colors duration-200' : '',
        onClick ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
};

export default DashboardGlassCard;
