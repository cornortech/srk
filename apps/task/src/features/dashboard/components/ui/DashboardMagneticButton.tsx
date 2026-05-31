import React from 'react';

const variantStyles: Record<string, string> = {
  primary: 'bg-[#b68938] text-black hover:bg-[#c9993f] shadow-[0_2px_8px_rgba(182,137,56,0.35)]',
  secondary: 'bg-white/[0.06] text-white border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.18]',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/35',
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20',
  premium: 'bg-[#b68938] text-black hover:bg-[#c9993f] shadow-[0_2px_8px_rgba(182,137,56,0.35)]',
};

const MagneticButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'premium';
  fullWidth?: boolean;
}> = ({
  children,
  onClick,
  disabled,
  small,
  className = '',
  variant = 'primary',
  fullWidth = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={[
      'flex items-center gap-2 font-semibold rounded-lg transition-all duration-200',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b68938]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0705]',
      small ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-sm',
      fullWidth ? 'w-full justify-center' : '',
      variantStyles[variant] ?? variantStyles.primary,
      className,
    ].join(' ')}
  >
    {children}
  </button>
);

export default MagneticButton;
