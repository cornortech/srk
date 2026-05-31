import React from 'react';
import { DollarSign, Shield, X } from 'lucide-react';
import { NavLink } from '../types';
import { NavItem } from '../components/ui/NavItem';

interface SidebarProps {
  isDesktop: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  navLinks: NavLink[];
  selectedSection: string;
  setSelectedSection: (section: string) => void;
  onSrkBankClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isDesktop,
  isSidebarOpen,
  setIsSidebarOpen,
  navLinks,
  selectedSection,
  setSelectedSection,
  onSrkBankClick,
}) => {
  if (!isSidebarOpen) return null;

  return (
    <div
      className={`flex-shrink-0 z-50 ${
        isDesktop
          ? 'sticky top-0 h-screen w-[260px]'
          : 'fixed inset-0 w-72'
      } bg-bgPrimary border-r border-white/[0.06] flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary flex items-center justify-center flex-shrink-0">
            <Shield size={14} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-white">
            Admin<span className="text-primary">Task</span>
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden p-1.5 text-white/40 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navLinks.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            name={link.name}
            isSelected={selectedSection === link.name}
            onClick={() => {
              setSelectedSection(link.name);
              if (!isDesktop) setIsSidebarOpen(false);
            }}
          />
        ))}
      </nav>

      {/* SRK Bank action */}
      <div className="border-t border-white/[0.06] p-3 flex-shrink-0">
        <NavItem
          icon={DollarSign}
          name="SRK Bank"
          isSelected={false}
          onClick={onSrkBankClick}
        />
      </div>
    </div>
  );
};
