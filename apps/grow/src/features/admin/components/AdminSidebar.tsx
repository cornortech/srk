import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isMobile = false,
  onClose,
}) => {
  const navItems = useMemo(
    () => [
      { id: 'global', label: 'Global Overview', icon: '🌐' },
      {
        id: 'affiliateverification',
        label: 'Affiliate Verification',
        icon: '👥',
      },
      { id: 'userverification', label: 'Enrollment Verification', icon: '👤' },
      { id: 'paymentverification', label: 'Payment Verification', icon: '💰' },
      { id: 'taskmonitoring', label: 'Task Monitoring', icon: '📊' },
      { id: 'privatetasks', label: 'Private Tasks', icon: '🎯' },
      { id: 'affiliatelist', label: 'Affiliate Users', icon: '🌟' },
      { id: 'packagelist', label: 'Package Users', icon: '👥' },
      { id: 'createuser', label: 'Create User', icon: '➕' },
      { id: 'payoutqueue', label: 'Payout Queue', icon: '💰' },
      { id: 'trend', label: 'Performance Trends', icon: '📈' },
    ],
    []
  );

  const handleNavClick = useCallback(
    (itemId: string) => {
      setActiveView(itemId);
      if (isMobile && onClose) onClose();
    },
    [setActiveView, isMobile, onClose]
  );

  return (
    <>
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.div
        initial={isMobile ? { x: -300 } : {}}
        animate={isMobile ? { x: 0 } : {}}
        exit={isMobile ? { x: -300 } : {}}
        className={`
          ${
            isMobile
              ? 'fixed inset-y-0 left-0 z-50'
              : 'hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0'
          }
          flex flex-col w-64 h-full
        `}
      >
        <div
          className={`flex-1 flex flex-col min-h-0 ${
            isMobile ? 'bg-gradient-to-b from-[#1a140f] to-[#0f0a05]' : ''
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center"
              >
                <span className="font-bold text-black text-xl">S</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  SRK<span className="text-[#b68938]">Admin</span>
                </h1>
                <p className="text-xs text-gray-400">Premium Dashboard</p>
              </div>

              {isMobile && onClose && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="ml-auto p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <span className="text-white">✕</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleNavClick(item.id)}
                whileHover={{ x: 10 }}
                className={`
                  w-full h-[60px] flex items-center gap-3 p-3 rounded-xl
                  transition-all duration-200 text-left
                  ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-[#b68938]/20 to-[#b68938]/10 text-white shadow-lg border border-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <div
                  className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-lg
                  ${activeView === item.id ? 'bg-[#b68938]/20' : 'bg-white/5'}
                `}
                >
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 border-t border-white/10 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center">
                <span className="text-gray-400">⚙️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin Panel</p>
                <p className="text-xs text-gray-400">v2.0.1</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
