import { motion } from 'framer-motion';
import { THEME } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
  onClick,
  delay = 0,
}) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      whileHover={
        hover ? { scale: 1.02, y: -4, transition: { duration: 0.2 } } : {}
      }
      className={`${
        THEME.effects.glass
      } rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/2 hover:border-white/10 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#b68938]/0 via-[#b68938]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
