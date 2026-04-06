import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Target, Wallet, Globe } from 'lucide-react';
import { SpotlightCard } from '../../../components/ui/SpotLlightCard';

export const StatsBar = () => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const stats = [
    {
      value: '10,000+',
      label: 'Active Verified Members',
      icon: Users,
      description: 'KYC-verified individuals from SRK University',
      color: '#e1ba73',
    },
    {
      value: '50,000+',
      label: 'Engagement Tasks Completed',
      icon: Target,
      description: 'Successful verified task completions',
      color: '#d4af37',
    },
    {
      value: '99.8%',
      label: 'Task Approval Rate',
      icon: Wallet,
      description: 'Honest submissions with proper verification',
      color: '#b68938',
    },
    {
      value: '24/7',
      label: 'Member Support Available',
      icon: Globe,
      description: 'Live chat and email support anytime',
      color: '#e1ba73',
    },
  ];

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredStat(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredStat(null);
  }, []);

  return (
    <section className="py-20 relative bg-gradient-to-b from-black/80 to-[#0a0705] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(225, 186, 115, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(182, 137, 56, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(225, 186, 115, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: '-50px' }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                className="relative group"
              >
                <AnimatePresence>
                  {hoveredStat === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 p-4 rounded-2xl backdrop-blur-xl border border-[#b68938]/30 bg-gradient-to-b from-[#0a0705]/90 to-black/90 z-20 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                    >
                      <div className="text-sm text-gray-300 font-medium text-center">
                        {stat.description}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0a0705] border-b border-r border-[#b68938]/30 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <SpotlightCard className="h-full">
                  <div className="p-8 flex flex-col items-center text-center">
                    <motion.div
                      className="relative mb-6"
                      animate={{
                        rotate: hoveredStat === index ? 360 : 0,
                        scale: hoveredStat === index ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#e1ba73]/20 to-[#b68938]/20 blur-xl rounded-full" />
                      <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-black/80 to-[#1a1410] border border-white/5">
                        <Icon
                          className="w-7 h-7"
                          style={{ color: stat.color }}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="text-5xl font-bold mb-3"
                      animate={{
                        color: hoveredStat === index ? stat.color : '#ffffff',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {stat.value}
                    </motion.div>

                    <div className="text-sm text-gray-400 font-medium tracking-wider uppercase">
                      {stat.label}
                    </div>

                    <motion.div
                      className="mt-6 h-[2px] bg-gradient-to-r from-transparent via-[#b68938] to-transparent"
                      initial={{ width: 0 }}
                      animate={{ width: hoveredStat === index ? '80%' : '40%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
