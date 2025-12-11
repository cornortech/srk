import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { MagneticButton } from '../../../lib/ui/MagneticButton';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-[#1a1410] to-black" />

      <motion.div
        className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/20 rounded-full blur-[128px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/20 rounded-full blur-[128px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(182, 137, 56, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(182, 137, 56, 0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        />

        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#b68938] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl border mb-8 relative group overflow-hidden"
          style={{
            background: 'rgba(26, 20, 16, 0.4)',
            borderColor: 'rgba(182, 137, 56, 0.3)',
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b68938]/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <TrendingUp className="w-4 h-4 text-[#e1ba73] animate-pulse" />
          <span className="text-sm font-medium bg-gradient-to-r from-[#b68938] to-[#e1ba73] bg-clip-text text-transparent relative z-10">
            Growth Made Simple
          </span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold leading-none tracking-tight mb-8">
          <motion.span
            className="block mb-2 bg-gradient-to-r from-white via-[#b68938] to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Amplify Your
          </motion.span>
          <motion.span
            className="block bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] bg-clip-text text-transparent animate-gradient-slow"
            style={{ backgroundSize: '200% 100%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Social Reach
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12"
        >
          The bridge between{' '}
          <span className="text-[#e1ba73] font-bold">SRK University</span> and{' '}
          <span className="text-[#e1ba73] font-bold">SRK Task</span>. Choose
          your growth package, unlock verified engagement, and watch your
          influence expand exponentially.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a href="#packages">
            <MagneticButton>
              Select Your Package <ArrowRight size={20} className="ml-2" />
            </MagneticButton>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-12 pt-16 flex-wrap"
        >
          {[
            { label: 'Active Users', value: '50K+' },
            { label: 'Engagements', value: '10M+' },
            { label: 'Real Accounts', value: '99.9%' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1 }}
            >
              <motion.div
                className="text-4xl font-bold text-[#b68938] mb-2"
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
