import React from 'react';

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
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-white/5 text-white hover:bg-white/10 border border-white/10';
      case 'danger':
        return 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20';
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20';
      case 'premium':
        return 'bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#8B5CF6] text-white hover:brightness-110';
      default:
        return 'bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:brightness-110';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative rounded-full font-semibold uppercase tracking-widest
        active:scale-95 flex items-center gap-2 overflow-hidden
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
        focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950
        ${small ? 'px-6 py-3 text-xs' : 'px-8 py-4 text-sm'}
        ${fullWidth ? 'w-full' : ''}
        ${getVariantStyles()}
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};
export default MagneticButton;
