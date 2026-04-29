import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Wallet,
  Zap,
  Star,
  Quote,
  ShieldCheck,
  Globe,
  Clock,
  Heart,
} from 'lucide-react';
import { SpotlightCard } from '../../../components/ui/SpotLlightCard';

export const TrustedByCreators = () => {
const reviews = [
  {
    name: 'Aman Kapoor',
    role: 'Graphic Designer',
    content:
      'From SRK University, I learned Adobe Photoshop design, which completely transformed my career. The hands-on assignments helped me build real-world skills that led me to land a very good job. I am now working in a great position with continuous growth every day, and this would not have been possible without SRK University.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aman',
    rating: 5,
    stats: { tasks: 220, Progresss: '₹14,000' },
  },
  {
    name: 'Riya Mehta',
    role: 'Illustrator',
    content:
      'LProgress Adobe Illustrator at SRK University was a game changer for me. The structured assignments and practical approach helped me master design skills that are actually used in the industry. Because of this, I secured a great job and continue to grow every day in my role. I truly owe this success to SRK University.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riya',
    rating: 5,
    stats: { tasks: 190, Progresss: '₹11,500' },
  },
  {
    name: 'Karan Malhotra',
    role: 'Video Editor',
    content:
      'SRK University helped me master DaVinci Resolve with a practical lProgress approach that prepared me for real-world editing. The assignments pushed my creativity and built strong technical skills. Thanks to this, I landed a solid job in video editing and experience consistent career growth. This journey would not have been possible without SRK University.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan',
    rating: 5,
    stats: { tasks: 260, Progresss: '₹16,000' },
  },
];

  const badges = [
    { icon: ShieldCheck, label: '100% Verified', value: '50K+' },
    { icon: Zap, label: 'Instant Extracts', value: '10L+' },
    { icon: Clock, label: '24/7 Support', value: '99.9%' },
    { icon: Globe, label: 'Global Community', value: '120+' },
  ];

  const [windowSize, setWindowSize] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const particleCount = 8;

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-black to-[#0a0705]">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#e1ba73]/5 via-[#b68938]/5 to-[#e1ba73]/5"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ backgroundSize: '400% 100%' }}
        />

        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={`floating-${i}`}
            className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/10 blur-3xl"
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
            }}
            animate={{
              x: [null, Math.random() * 100 - 50],
              y: [null, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-8 px-6 py-2.5 rounded-full border border-[#b68938]/30 bg-gradient-to-r from-[#0a0705]/50 to-black/50 backdrop-blur-xl"
          >
            <Heart className="w-4 h-4 text-[#e1ba73]" />
            <span className="text-xs font-bold text-[#e1ba73] tracking-widest uppercase">
              Community Love
            </span>
            <Heart className="w-4 h-4 text-[#e1ba73]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          >
            Trusted by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] to-white">
              Creators
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            Join thousands of verified creators who trust SRK Task for
            consistent Progresss and premium experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {reviews.slice(0, 3).map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative group"
            >
              <SpotlightCard>
                <div className="p-8">
                  <div className="absolute top-6 right-6 text-[#e1ba73]/10 group-hover:text-[#e1ba73]/20 transition-colors">
                    <Quote size={40} />
                  </div>

                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={16}
                        className="fill-[#e1ba73] text-[#e1ba73]"
                      />
                    ))}
                  </div>

                  <p className="text-gray-300 text-lg mb-8 font-medium leading-relaxed">
                    "{review.content}"
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full border-2 border-[#b68938]/30 p-1">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-full h-full rounded-full bg-black/50"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${
                            review.name.split(' ')[0]
                          }&background=111&color=e1ba73&bold=true`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-white font-bold">{review.name}</div>
                      <div className="text-[#e1ba73] text-xs uppercase tracking-wider font-bold">
                        {review.role}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#e1ba73]" />
                      <span className="text-sm text-gray-400">
                        {review.stats.tasks} tasks
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-[#e1ba73]" />
                      <span className="text-sm text-gray-400">
                        {review.stats.Progresss} earned
                      </span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 text-center group hover:border-[#e1ba73]/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-[#e1ba73]" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {badge.value}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  {badge.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
