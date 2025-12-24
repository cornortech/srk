import React from 'react';
import { motion } from 'framer-motion';

interface NavItemProps {
  icon: React.ElementType;
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

export const NavItem: React.FC<NavItemProps> = React.memo(
  ({ icon: Icon, name, isSelected, onClick }) => (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl w-full text-left transition-all duration-300 font-semibold uppercase tracking-wider ${
        isSelected
          ? 'bg-[#1A1715] text-[#E1BA73] shadow-inner border border-[#E1BA73]/30'
          : 'text-gray-400 hover:bg-[#1A1715]/50 hover:text-white'
      }`}
      whileHover={{ x: isSelected ? 0 : 4 }}
    >
      <Icon
        size={24}
        className={isSelected ? 'text-[#E1BA73]' : 'text-gray-500'}
      />
      <span className="text-sm">{name}</span>
    </motion.button>
  )
);
