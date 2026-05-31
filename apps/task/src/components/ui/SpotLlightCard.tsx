import React from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverable?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
}) => (
  <div className={`bg-[#111008] rounded-xl border border-white/[0.07] hover:border-[#b68938]/20 transition-colors duration-200 ${className}`}>
    {children}
  </div>
);
