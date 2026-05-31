import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = ['Features', 'Trust', 'Synergy', 'Reviews'] as const;

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0705]/95 backdrop-blur-md border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <Link to="/" className="flex-shrink-0">
            <img src="/task-logo.png" alt="SRK Task" className="h-8 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-white/55 hover:text-white transition-colors duration-150"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/task/dashboard"
              className="hidden md:inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black text-sm font-bold shadow-[0_2px_12px_rgba(182,137,56,0.4)] hover:brightness-110 transition-all duration-150"
            >
              Start Now
            </Link>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-white/55 hover:text-white hover:bg-white/[0.07] transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0705] md:hidden flex flex-col pt-20 px-6">
          <nav className="flex flex-col gap-1 mb-8">
            {NAV_ITEMS.map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="py-4 px-4 rounded-xl text-lg font-semibold text-white/70 hover:text-white hover:bg-white/[0.05] transition-all border-b border-white/[0.05] last:border-0"
              >
                {item}
              </a>
            ))}
          </nav>
          <Link
            to="/task/dashboard"
            onClick={() => setMobileOpen(false)}
            className="w-full py-4 rounded-xl font-bold text-sm text-center bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black shadow-[0_4px_20px_rgba(182,137,56,0.4)]"
          >
            Start progressing
          </Link>
        </div>
      )}
    </>
  );
};
