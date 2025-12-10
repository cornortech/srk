import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Target,
  Coins,
} from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { SpotlightCard } from './SpotLlightCard';

export const Hero = () => {
  const steps = [
    {
      title: 'CONNECT',
      desc: 'Link SRK University Account',
      icon: Users,
      delay: 0.2,
    },
    { title: 'VERIFY', desc: 'Complete KYC Process', icon: Shield, delay: 0.4 },
    { title: 'TASK', desc: 'Follow & Engage', icon: Target, delay: 0.6 },
    { title: 'EARN', desc: 'Instant Wallet Credit', icon: Coins, delay: 0.8 },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

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

  const particleCount = 20;

  const handleStepHover = useCallback((index: number) => {
    setActiveStep(index);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0705] to-black" />

      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-[1px] h-[1px] bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-full"
          initial={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
          }}
          animate={{
            y: [null, -30, 30, 0],
            x: [null, 15, -15, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(225, 186, 115, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(225, 186, 115, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-xl border border-[#b68938]/30 bg-gradient-to-r from-[#0a0705]/50 to-black/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e1ba73] animate-pulse" />
            <span className="text-xs font-bold text-[#e1ba73] tracking-widest uppercase">
              Welcome to SRK Task Portal
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#e1ba73] animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
          >
            <motion.span
              className="block text-white mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Earn Through
            </motion.span>
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] via-[#d4af37] to-[#b68938]"
              style={{
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Tasks
            </motion.span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-2"
          >
            <p className="text-lg md:text-xl text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Join thousands completing simple tasks.
              <br />
              Multiple schemes coming soon.
            </p>
            <p className="text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] to-[#b68938] max-w-lg mx-auto lg:mx-0 leading-relaxed font-semibold">
              Start your journey with SRK Group.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center lg:justify-start gap-4"
          >
            <MagneticButton className="shadow-[0_0_50px_rgba(225,186,115,0.5)]">
              Join Now & Start Earning <ArrowRight size={20} className="ml-2" />
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center lg:justify-start gap-6 pt-8 border-t border-white/5"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-11 h-11 rounded-full border-2 border-[#0a0705] flex items-center justify-center text-[#b68938] bg-[#1a1410] relative z-0 hover:z-10"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Users size={18} />
                </motion.div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-base">
                50K+ Active Members
              </div>
              <div className="text-sm text-[#b68938] font-semibold">
                Verified by SRK University
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative hidden lg:block h-[600px] pl-10">
          <motion.div
            className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#e1ba73]/20 via-[#b68938] to-[#e1ba73]/20"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="flex flex-col justify-between h-full py-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 100, rotateY: 90 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: step.delay,
                    type: 'spring',
                  }}
                  className="relative group pl-16"
                  onMouseEnter={() => handleStepHover(i)}
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center">
                    <motion.div
                      className="relative"
                      animate={{
                        scale: activeStep === i ? [1, 1.5, 1] : 1,
                        boxShadow:
                          activeStep === i
                            ? [
                                '0 0 0 0 rgba(225, 186, 115, 0)',
                                '0 0 30px 10px rgba(225, 186, 115, 0.5)',
                                '0 0 0 0 rgba(225, 186, 115, 0)',
                              ]
                            : '0 0 15px rgba(225,186,115,0.5)',
                      }}
                      transition={{
                        scale: { duration: 2, repeat: Infinity },
                        boxShadow: { duration: 2, repeat: Infinity },
                      }}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#0a0705] border-2 border-[#e1ba73] z-10" />
                    </motion.div>
                    <div className="absolute w-8 h-[1px] bg-gradient-to-r from-[#b68938]/30 to-transparent right-1/2 top-1/2" />
                  </div>

                  <SpotlightCard className="w-full max-w-md" hoverable={false}>
                    <div className="p-6">
                      <div className="flex items-center gap-5">
                        <motion.div
                          className="p-3.5 rounded-xl bg-gradient-to-br from-[#b68938]/20 to-[#e1ba73]/10 text-[#e1ba73]"
                          animate={{
                            rotate: activeStep === i ? [0, 5, -5, 0] : 0,
                            scale: activeStep === i ? [1, 1.1, 1] : 1,
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon size={22} />
                        </motion.div>
                        <div>
                          <motion.h4
                            className="text-white font-bold text-lg mb-1"
                            animate={{
                              color: activeStep === i ? '#e1ba73' : '#ffffff',
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {step.title}
                          </motion.h4>
                          <p className="text-sm text-gray-500 font-medium">
                            {step.desc}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: activeStep === i ? '100%' : '0%' }}
                        transition={{ duration: 2 }}
                      >
                        <div className="h-full bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-full" />
                      </motion.div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
