import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Bot,
  Fingerprint,
  ShieldCheck,
  Globe,
  BarChart3,
} from 'lucide-react';
import { SpotlightCard } from './SpotLlightCard';

export const TrustGrid = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: Bot,
      title: 'Zero Bot Tolerance',
      desc: 'Our proprietary AI filters reject 99.9% of automated traffic. Only real humans, real engagement.',
      gradient: 'from-[#e1ba73] to-[#ff6b6b]',
      delay: 0.1,
    },
    {
      icon: Fingerprint,
      title: '100% Verified Identities',
      desc: 'Every earner passes mandatory KYC verification via the SRK University portal.',
      gradient: 'from-[#b68938] to-[#4dabf7]',
      delay: 0.2,
    },
    {
      icon: ShieldCheck,
      title: 'Bank-Grade Security',
      desc: '256-bit encryption and secure escrow systems protect every transaction.',
      gradient: 'from-[#e1ba73] to-[#51cf66]',
      delay: 0.3,
    },
    {
      icon: Zap,
      title: 'Instant Settlements',
      desc: 'No waiting periods. Earnings are credited to your wallet in milliseconds.',
      gradient: 'from-[#b68938] to-[#ffd43b]',
      delay: 0.4,
    },
    {
      icon: Globe,
      title: 'Global Reach',
      desc: 'Access a diverse network of active users from 120+ countries ready to engage.',
      gradient: 'from-[#e1ba73] to-[#339af0]',
      delay: 0.5,
    },
    {
      icon: BarChart3,
      title: 'Transparent Analytics',
      desc: 'Real-time tracking of every click, follow, and interaction with granular reporting.',
      gradient: 'from-[#b68938] to-[#da77f2]',
      delay: 0.6,
    },
  ];

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredCard(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  return (
    <section
      id="trust"
      className="py-32 px-4 relative overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(225, 186, 115, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(182, 137, 56, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)
            `,
          }}
          animate={{
            background: [
              `
                radial-gradient(circle at 20% 30%, rgba(225, 186, 115, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(182, 137, 56, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)
              `,
              `
                radial-gradient(circle at 30% 40%, rgba(225, 186, 115, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(182, 137, 56, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 60% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)
              `,
              `
                radial-gradient(circle at 20% 30%, rgba(225, 186, 115, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(182, 137, 56, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)
              `,
            ],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(225, 186, 115, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(225, 186, 115, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-8 px-6 py-2.5 rounded-full border backdrop-blur-xl bg-gradient-to-r from-[#0a0705]/50 to-black/50"
            style={{
              borderColor: 'rgba(182, 137, 56, 0.3)',
              boxShadow: '0 8px 32px rgba(182, 137, 56, 0.1)',
            }}
          >
            <span className="text-xs font-bold text-[#e1ba73] tracking-[0.2em] uppercase">
              The SRK Standard
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight"
          >
            Uncompromising{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] via-[#d4af37] to-[#b68938]">
              Quality
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed"
          >
            We don't just connect you; we protect the integrity of every
            interaction. Built on a foundation of trust and technology.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: feature.delay }}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <SpotlightCard className="h-full">
                  <div className="p-8 lg:p-10 flex flex-col h-full">
                    <div className="relative mb-8">
                      <motion.div
                        className="absolute -inset-4 rounded-2xl"
                        style={{
                          background: `conic-gradient(from 0deg, ${
                            hoveredCard === i
                              ? feature.gradient
                              : 'rgba(225, 186, 115, 0.1)'
                          }, transparent)`,
                        }}
                        animate={{
                          rotate: hoveredCard === i ? 360 : 0,
                          opacity: hoveredCard === i ? 1 : 0,
                        }}
                        transition={{
                          rotate: {
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          },
                          opacity: { duration: 0.3 },
                        }}
                      />

                      <motion.div
                        className={`relative w-20 h-20 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-black/80 to-[#1a1410] border`}
                        style={{
                          borderColor:
                            hoveredCard === i
                              ? `hsl(${i * 60}, 70%, 50%)`
                              : 'rgba(182, 137, 56, 0.2)',
                        }}
                        animate={{
                          scale: hoveredCard === i ? 1.1 : 1,
                          rotate: hoveredCard === i ? [0, 5, -5, 0] : 0,
                        }}
                        transition={{
                          scale: { duration: 0.3 },
                          rotate: { duration: 0.6 },
                        }}
                      >
                        <Icon
                          size={32}
                          className="text-[#e1ba73]"
                          strokeWidth={1.5}
                        />
                      </motion.div>

                      <motion.div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: hoveredCard === i ? '80%' : '40%' }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>

                    <motion.h3
                      className="text-xl lg:text-2xl font-bold mb-4 leading-tight"
                      style={{
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                      }}
                      animate={{
                        backgroundImage:
                          hoveredCard === i
                            ? `linear-gradient(135deg, ${feature.gradient})`
                            : 'linear-gradient(135deg, #ffffff, #ffffff)',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.title}
                    </motion.h3>

                    <p className="text-gray-400 text-sm lg:text-base leading-relaxed font-medium mb-6">
                      {feature.desc}
                    </p>

                    <div className="mt-auto pt-6">
                      <motion.div
                        className="h-[2px] rounded-full overflow-hidden"
                        initial={{ width: '0%' }}
                        animate={{ width: hoveredCard === i ? '100%' : '20%' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-[#e1ba73] to-[#b68938]"
                          style={{
                            boxShadow: '0 0 20px rgba(225, 186, 115, 0.5)',
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </SpotlightCard>

                <motion.div
                  className="absolute inset-0 -z-10 rounded-3xl blur-2xl opacity-0"
                  style={{
                    background: `radial-gradient(circle at center, ${
                      hoveredCard === i
                        ? feature.gradient
                            .replace('from-', '')
                            .replace('to-', '')
                            .split(' ')[0]
                        : 'transparent'
                    } 0%, transparent 70%)`,
                  }}
                  animate={{
                    opacity: hoveredCard === i ? 0.3 : 0,
                    scale: hoveredCard === i ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
