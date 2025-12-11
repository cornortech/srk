import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { MagneticButton } from '../../../components/ui/MagneticButton';

export const Footer = () => {
  const platformLinks = [
    'How It Works',
    'Features',
    'Pricing',
    'API',
    'Documentation',
  ];
  const companyLinks = [
    'About Us',
    'Careers',
    'Blog',
    'Contact',
    'Privacy Policy',
  ];
  const socialLinks = ['Twitter', 'Instagram', 'LinkedIn', 'Discord'];

  return (
    <footer className="pt-32 pb-12 border-t border-white/5 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0705] to-black" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-xl blur opacity-60" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center font-bold text-black text-xl">
                  S
                </div>
              </div>
              <span className="text-2xl font-bold text-white">SRK Task</span>
            </div>

            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed font-medium">
              The premier platform for social influence monetization and
              verified ecosystem growth. Built for the modern creator. Part of
              the SRK Ecosystem.
            </p>

            <div className="flex items-center gap-4">
              <MagneticButton className="px-5 py-2 text-sm">
                Join the Network
              </MagneticButton>
              <a
                href="#"
                className="text-sm text-[#e1ba73] font-bold flex items-center gap-2 hover:text-white transition-colors group"
              >
                University Portal
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </motion.div>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Platform</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              {platformLinks.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                    className="hover:text-[#e1ba73] transition-colors flex items-center gap-1 group"
                  >
                    {item}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              {companyLinks.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                    className="hover:text-[#e1ba73] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs text-gray-600 font-medium">
            © 2024 SRK Task. All rights reserved. | Optimized for the SRK
            Ecosystem.
          </p>
          <div className="flex gap-6">
            {socialLinks.map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
