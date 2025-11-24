import React from 'react';

interface SideBarProps {
  isOpen?: boolean;
}

export const SideBar: React.FC<SideBarProps> = ({ isOpen = true }) => {
  return (
    <aside className={`bg-gray-100 h-screen transition-all ${isOpen ? 'w-64' : 'w-0'}`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">Sidebar</h2>
      </div>
    </aside>
  );
};
