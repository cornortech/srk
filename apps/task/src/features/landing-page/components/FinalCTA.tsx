import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Star, ShieldCheck } from 'lucide-react';
import { MagneticButton } from '../../../components/ui/MagneticButton';

export const FinalCTA = () => {
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

  const particleCount = 12;

  return (
    <section className="py-40 px-6 relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#0a0705] via-black to-[#0a0705]"
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(225, 186, 115, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(182, 137, 56, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 30%, rgba(225, 186, 115, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 70%, rgba(182, 137, 56, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 50%, rgba(225, 186, 115, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(182, 137, 56, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={`cta-particle-${i}`}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938]"
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
            }}
            animate={{
              y: [null, -100, 100, 0],
              x: [null, 50, -50, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: 'spring' }}
          className="text-center"
        >
          <motion.div
            initial={{ rotate: -5, scale: 0.9 }}
            animate={{ rotate: 5, scale: 1 }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, repeatType: 'reverse' },
              scale: { duration: 2, repeat: Infinity, repeatType: 'reverse' },
            }}
            className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full border border-[#b68938]/30 bg-gradient-to-r from-[#0a0705]/80 to-black/80 backdrop-blur-xl"
          >
            <Star className="w-5 h-5 text-[#e1ba73] animate-pulse" />
            <span className="text-sm font-bold tracking-widest uppercase text-[#e1ba73]">
              Limited Time Offer
            </span>
            <Star className="w-5 h-5 text-[#e1ba73] animate-pulse" />
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{
              background:
                'linear-gradient(90deg, #e1ba73, #ffffff, #b68938, #e1ba73)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Ready to Dominate Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] via-white to-[#b68938]">
              Destiny?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Join the fastest-growing community of social influencers and start
            Progress instantly through verified tasks. No experience required.
            Start today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >

          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-sm text-gray-500 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#b68938]" />
            <span>Trusted by 50,000+ creators worldwide. No hidden fees.</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
