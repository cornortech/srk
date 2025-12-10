import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-white/5 text-white hover:bg-white/10 border border-white/10';
      case 'danger':
        return 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20';
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20';
      case 'premium':
        return 'bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#8B5CF6] text-white hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]';
      default:
        return 'bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_40px_rgba(182,137,56,0.6)]';
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      className={`
        relative rounded-full font-semibold uppercase tracking-widest
        active:scale-95 flex items-center gap-2 overflow-hidden group
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
        focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950
        ${small ? 'px-6 py-3 text-xs' : 'px-8 py-4 text-sm'}
        ${fullWidth ? 'w-full' : ''}
        ${getVariantStyles()}
        ${className}
      `}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Particle effects on hover */}
      {isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ x: -10, y: '50%', opacity: 1 }}
              animate={{ x: '110%', opacity: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
          ))}
        </>
      )}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
export default MagneticButton;
