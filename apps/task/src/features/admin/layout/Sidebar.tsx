import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Shield, X } from 'lucide-react';
import { NavLink } from '../types';
import { NavItem } from '../components/ui/NavItem';
import { DARK_BG, GOLD_ACCENT, GOLD_PRIMARY } from '../constants/theme';

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
}) => (
  <motion.div
    initial={false}
    animate={{
      width: isDesktop ? (isSidebarOpen ? 300 : 0) : isSidebarOpen ? '100%' : 0,
      x: isDesktop ? 0 : isSidebarOpen ? 0 : '-100%',
    }}
    transition={{ duration: 0.3 }}
    className={`fixed ${
      isDesktop ? 'sticky top-0 h-screen' : 'inset-0'
    } flex-shrink-0 z-50 p-6 ${DARK_BG} border-r border-gray-700/50 shadow-2xl overflow-hidden`}
    style={{
      boxShadow: '8px 0 20px rgba(0,0,0,0.6)',
    }}
  >
    <div className="h-full flex flex-col space-y-8">
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
            }}
          >
            <Shield size={20} className="text-black" strokeWidth={3} />
          </div>
          <span className="font-extrabold text-white text-xl tracking-wider">
            ADMIN<span style={{ color: GOLD_PRIMARY }}>Task</span>
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden text-white hover:text-[#E1BA73] p-2"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-grow space-y-2 overflow-y-auto pr-2">
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
      </div>

      <NavItem
        icon={DollarSign}
        name="SRK Bank"
        isSelected={false}
        onClick={onSrkBankClick}
      />
    </div>
  </motion.div>
);
