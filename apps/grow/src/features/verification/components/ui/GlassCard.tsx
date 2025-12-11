import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
}) => {
  return (
    <motion.div
      className={`relative backdrop-blur-md rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-6 ${className}`}
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#b68938]/10 via-transparent to-[#e1ba73]/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
