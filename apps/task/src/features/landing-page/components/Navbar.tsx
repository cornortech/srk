import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const navItems = ['FEATURES', 'TRUST', 'SYNERGY', 'REVIEWS'];

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-linear-to-b from-black/95 via-[#0a0705]/95 to-black/95 backdrop-blur-xl py-3 shadow-[0_20px_60px_rgba(0,0,0,0.4)]'
            : 'bg-transparent py-5'
        }`}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e1ba73]/10 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 5,
            ease: 'easeInOut',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-full blur-lg"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity },
                  }}
                />
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center shadow-[0_0_40px_rgba(225,186,115,0.6)]">
                  <span className="font-bold text-black text-lg">S</span>
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-white">SRK</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] to-[#b68938]">
                  Task
                </span>
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="relative text-sm font-bold tracking-widest uppercase group"
                >
                  <span
                    className={`relative z-10 transition-colors duration-300 ${
                      isScrolled
                        ? 'text-gray-300 group-hover:text-[#e1ba73]'
                        : 'text-white/90 group-hover:text-white'
                    }`}
                  >
                    {item}
                  </span>
                  <motion.div
                    className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#e1ba73] to-[#b68938]"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#e1ba73]/0 via-[#e1ba73]/10 to-[#b68938]/0 rounded-lg opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                </motion.a>
              ))}
            </div>

            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 40px rgba(225, 186, 115, 0.5)',
              }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block px-8 py-3 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold text-sm uppercase tracking-widest relative overflow-hidden"
            >
              <Link to="/task/dashboard" className="relative z-10">
                START EARNING
              </Link>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
            </motion.button>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-white p-2 hover:text-[#e1ba73] transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#e1ba73] to-[#b68938]"
          style={{
            scaleX: scrollY.get(),
            transformOrigin: '0%',
          }}
        />
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-linear-to-b from-black to-[#0a0705] md:hidden pt-32 px-8 flex flex-col gap-6"
          >
            {['Features', 'Trust', 'Synergy', 'Reviews'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={closeMobileMenu}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-3xl font-bold text-white hover:text-[#e1ba73] transition-colors border-b border-white/10 pb-4"
              >
                {item}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-5 rounded-2xl font-bold text-lg mt-4 bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black shadow-[0_20px_60px_rgba(225,186,115,0.4)]"
            >
              Start Earning
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
