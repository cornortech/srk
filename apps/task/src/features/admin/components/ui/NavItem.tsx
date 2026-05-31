import React from 'react';

interface NavItemProps {
  icon: React.ElementType;
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

export const NavItem: React.FC<NavItemProps> = React.memo(
  ({ icon: Icon, name, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={[
        'flex items-center gap-2.5 px-3 py-2.5 text-sm w-full text-left border-l-2 transition-colors duration-150',
        isSelected
          ? 'border-primary bg-white/[0.04] text-white'
          : 'border-transparent text-white/45 hover:text-white/80 hover:bg-white/[0.03]',
      ].join(' ')}
    >
      <Icon size={15} className="flex-shrink-0" />
      <span className="font-medium">{name}</span>
    </button>
  )
);
