import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Trophy,
  DollarSign,
  Rocket,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Target as TargetIcon,
  Wallet as WalletIcon,
} from 'lucide-react';
import { SpotlightCard } from '../../../components/ui/SpotLlightCard';

export const SynergySection = () => {
  const [flipped, setFlipped] = useState<number | null>(null);

  const cards = [
    {
      front: {
        title: 'SRK Grow',
        subtitle: 'Premium Growth Engine',
        icon: Rocket,
        description:
          'Creators purchase authentic engagement to accelerate their social presence growth.',
        gradient: 'from-[#e1ba73] via-[#d4af37] to-[#b68938]',
        stats: ['500+ Daily Orders', '99.8% Success Rate', '24/7 Support'],
      },
      back: {
        title: 'Real Engagement',
        description:
          'Every interaction is from verified, real users ensuring platform-safe growth.',
        features: [
          'Manual Verification',
          'Human Quality Check',
          'Platform Compliant',
        ],
      },
    },
    {
      front: {
        title: 'SRK Task',
        subtitle: 'Progress Platform',
        icon: DollarSign,
        description:
          'Complete simple tasks and earn instantly. Every task creates value for creators.',
        gradient: 'from-[#b68938] via-[#d4af37] to-[#e1ba73]',
        stats: ['Instant Extracts', '500+ Tasks Daily', 'Global Access'],
      },
      back: {
        title: 'Verified Progresss',
        description:
          'Every task is verified and processed through secure blockchain technology.',
        features: [
          'Instant Processing',
          'Secure Activitys',
          'Real-time Tracking',
        ],
      },
    },
  ];

  const stats = [
    {
      value: '500+',
      label: 'Active Tasks',
      icon: TargetIcon,
      color: '#e1ba73',
    },
    {
      value: '10L+',
      label: 'Monthly Extracts',
      icon: WalletIcon,
      color: '#d4af37',
    },
    {
      value: '50K+',
      label: 'Verified Users',
      icon: UsersIcon,
      color: '#b68938',
    },
    { value: '99.9%', label: 'Success Rate', icon: Trophy, color: '#e1ba73' },
  ];

  const handleCardEnter = useCallback((index: number) => {
    setFlipped(index);
  }, []);

  const handleCardLeave = useCallback(() => {
    setFlipped(null);
  }, []);

  return (
    <section
      id="synergy"
      className="py-32 px-4 relative overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              conic-gradient(from 0deg at 50% 50%, 
                rgba(225, 186, 115, 0.05) 0deg, 
                rgba(182, 137, 56, 0.05) 120deg, 
                rgba(212, 175, 55, 0.05) 240deg, 
                rgba(225, 186, 115, 0.05) 360deg
              )
            `,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 20%, rgba(225, 186, 115, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(182, 137, 56, 0.3) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-8 px-6 py-2.5 rounded-full border border-[#b68938]/30 bg-gradient-to-r from-[#0a0705]/50 to-black/50 backdrop-blur-xl"
          >
            <TrendingUpIcon className="w-4 h-4 text-[#e1ba73]" />
            <span className="text-xs font-bold text-[#e1ba73] tracking-widest uppercase">
              Ecosystem Synergy
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight"
          >
            Synergy of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] via-[#d4af37] to-[#b68938]">
              Growth
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            A perfect ecosystem loop where creators purchase growth on{' '}
            <span className="text-white font-bold">SRK Grow</span>, which
            instantly creates paid tasks for you on{' '}
            <span className="text-white font-bold">SRK Task</span>.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {cards.map((card, i) => {
            const Icon = card.front.icon;
            return (
              <motion.div
                key={card.front.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative h-[500px] perspective-1000"
                onMouseEnter={() => handleCardEnter(i)}
                onMouseLeave={handleCardLeave}
              >
                <motion.div
                  className="relative w-full h-full preserve-3d"
                  animate={{ rotateY: flipped === i ? 180 : 0 }}
                  transition={{ duration: 0.8, type: 'spring' }}
                  style={{ transformStyle: 'preserve-3d' as const }}
                >
                  <div
                    className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden"
                    style={{ backfaceVisibility: 'hidden' as const }}
                  >
                    <SpotlightCard className="h-full">
                      <div className="p-10 h-full flex flex-col">
                        <div className="mb-8">
                          <div
                            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${card.front.gradient} flex items-center justify-center shadow-[0_20px_40px_rgba(182,137,56,0.3)]`}
                          >
                            <Icon className="w-10 h-10 text-black" />
                          </div>
                        </div>

                        <h3 className="text-3xl font-bold text-white mb-3">
                          {card.front.title}
                        </h3>
                        <p className="text-[#e1ba73] text-sm uppercase tracking-widest font-bold mb-6">
                          {card.front.subtitle}
                        </p>
                        <p className="text-gray-400 text-lg font-medium mb-8 leading-relaxed">
                          {card.front.description}
                        </p>

                        <div className="mt-auto space-y-3">
                          {card.front.stats.map((stat) => (
                            <div key={stat} className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938]" />
                              <span className="text-sm text-gray-300 font-medium">
                                {stat}
                              </span>
                            </div>
                          ))}
                        </div>

                        <motion.div
                          className="absolute bottom-6 right-6 text-[#b68938]"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </motion.div>
                      </div>
                    </SpotlightCard>
                  </div>

                  <div
                    className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden' as const,
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <SpotlightCard className="h-full">
                      <div className="p-10 h-full flex flex-col bg-gradient-to-br from-[#1a1410] to-black">
                        <h3 className="text-3xl font-bold text-white mb-6">
                          {card.back.title}
                        </h3>
                        <p className="text-gray-400 text-lg font-medium mb-8 leading-relaxed">
                          {card.back.description}
                        </p>

                        <div className="space-y-4 mt-auto">
                          {card.back.features.map((feature, idx) => (
                            <motion.div
                              key={feature}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#e1ba73]/20 to-[#b68938]/20 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-[#e1ba73]" />
                              </div>
                              <span className="text-white font-medium">
                                {feature}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="hidden lg:flex items-center justify-center mb-20"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="relative flex items-center gap-4">
            <motion.div
              className="w-48 h-[2px] bg-gradient-to-r from-[#e1ba73] to-[#b68938]"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200% 100%' }}
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center shadow-[0_0_30px_rgba(225,186,115,0.5)]"
            >
              <ArrowRight className="w-6 h-6 text-black" />
            </motion.div>
            <motion.div
              className="w-48 h-[2px] bg-gradient-to-r from-[#b68938] to-[#e1ba73]"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              style={{ backgroundSize: '200% 100%' }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.4 }}
                className="relative group"
                whileHover={{ scale: 1.05 }}
              >
                <SpotlightCard>
                  <div className="p-8 flex flex-col items-center text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{
                        background: `rgba(${parseInt(
                          stat.color.slice(1, 3),
                          16
                        )}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(
                          stat.color.slice(5, 7),
                          16
                        )}, 0.1)`,
                        border: `1px solid ${stat.color}40`,
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: stat.color }} />
                    </div>

                    <div
                      className="text-4xl font-bold mb-3"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>

                    <div className="text-sm text-gray-400 font-medium tracking-wider uppercase">
                      {stat.label}
                    </div>
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
