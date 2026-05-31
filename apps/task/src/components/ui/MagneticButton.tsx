import React from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick = () => {},
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold text-sm shadow-[0_4px_16px_rgba(182,137,56,0.4)] hover:brightness-110 hover:shadow-[0_6px_24px_rgba(182,137,56,0.55)] transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);
