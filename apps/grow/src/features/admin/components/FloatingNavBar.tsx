import { motion, useScroll, useTransform } from 'framer-motion';
import { useCallback, useMemo } from 'react';

interface FloatingNavBarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const FloatingNavBar: React.FC<FloatingNavBarProps> = ({
  activeView,
  setActiveView,
}) => {
  const { scrollY } = useScroll();

  // In FloatingNavBar component, update the navItems array:
  const navItems = useMemo(
    () => [
      { id: 'global', label: 'Overview', icon: '🌐' },
      { id: 'affiliateverification', label: 'Affiliate Verify', icon: '👥' },
      { id: 'userverification', label: 'User Verify', icon: '👤' },
      { id: 'paymentverification', label: 'Payment Verify', icon: '💰' },
      { id: 'taskmonitoring', label: 'Tasks', icon: '📊' },
      { id: 'privatetasks', label: 'Private', icon: '🎯' },
      { id: 'userlist', label: 'Users', icon: '👥' },
      { id: 'affiliatelist', label: 'Affiliates', icon: '🌟' },
      { id: 'createuser', label: 'Create', icon: '➕' },
      { id: 'payoutqueue', label: 'Payouts', icon: '💰' },
      { id: 'trend', label: 'Trends', icon: '📈' },
    ],
    []
  );

  const navOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 12]);
  const navScale = useTransform(scrollY, [0, 100], [0.95, 1]);
  const navY = useTransform(scrollY, [0, 100], [-20, 0]);

  const handleNavClick = useCallback(
    (itemId: string) => {
      setActiveView(itemId);
    },
    [setActiveView]
  );

  return (
    <motion.nav
      style={{
        opacity: navOpacity,
        backdropFilter: `blur(${navBlur}px)`,
        scale: navScale,
        y: navY,
      }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden lg:block"
    >
      <div className="flex items-center gap-1 p-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
              activeView === item.id
                ? 'bg-gradient-to-r from-[#b68938]/20 to-[#e1ba73]/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};
