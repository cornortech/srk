import { motion } from 'framer-motion';
import { THEME } from '../../constants/theme';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
}) => (
  <motion.span
    className={`bg-clip-text text-transparent font-bold ${className}`}
    style={{ backgroundImage: THEME.colors.goldGradient }}
    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
    transition={{ duration: 5, repeat: Infinity }}
  >
    {children}
  </motion.span>
);
