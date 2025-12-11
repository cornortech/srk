import React from 'react';
import { motion } from 'framer-motion';

const DashboardGradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
  gradient?: 'gold' | 'purple' | 'blue' | 'green';
}> = ({ children, className = '', gradient = 'gold' }) => {
  const gradientMap = {
    gold: 'linear-gradient(135deg, #b68938 0%, #e1ba73 100%)',
    purple: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    blue: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    green: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
  };

  return (
    <motion.span
      className={`bg-clip-text text-transparent font-bold ${className}`}
      style={{
        backgroundImage: gradientMap[gradient],
        backgroundSize: '200% 200%', // 🔥 required for animation
      }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 5, repeat: Infinity }}
    >
      {children}
    </motion.span>
  );
};

export default DashboardGradientText;
