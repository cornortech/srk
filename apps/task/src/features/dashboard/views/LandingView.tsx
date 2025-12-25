import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Coins,
  Trophy,
  Zap,
  Shield,
  TrendingUp,
} from 'lucide-react';
import AnimatedBackground from '../../../components/ui/AnimatedBackground';
import DashboardGradientText from '../components/ui/DashboardGradientText';
import MagneticButton from '../components/ui/DashboardMagneticButton';
import { DashboardGlassCard } from '../components/ui/DashboardGlassCard';

interface LandingViewProps {
  setView: (view: 'dashboard') => void;
  addNotification: (message: string, type: 'success') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  setView,
  addNotification,
}) => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
    <AnimatedBackground />

    <div className="relative z-10 text-center px-6 max-w-6xl">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-6">
          <span className="bg-linear-to-r from-[#ac9976] to-[#e1ba73] bg-clip-text text-transparent animate-gradient">
            <DashboardGradientText>EARN THROUGH TASKS</DashboardGradientText>
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-8 leading-relaxed">
          Transform your social engagement into real rewards. Complete verified
          tasks, earn coins, and unlock premium features.
        </p>

        {/* Animated stats */}
        <div className="flex justify-center gap-8 mb-12">
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '500K+', label: 'Coins Earned' },
            { value: '98%', label: 'Success Rate' },
            { value: '24/7', label: 'Support' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold from-[#ac9976] to-[#e1ba73]">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-16"
      >
        <MagneticButton
          onClick={() => {
            setView('dashboard');
            addNotification('Welcome to SRK Portal!', 'success');
          }}
          className="text-lg relative"
        >
          <span className="flex items-center justify-center gap-3">
            <Sparkles size={24} />
            Join Now & Start Earning
            <ArrowRight size={24} />
          </span>

          {/* Floating coins animation */}
          <motion.div
            className="absolute -top-4 -right-4"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Coins size={20} className="from-[#ac9976] to-[#e1ba73]" />
          </motion.div>
        </MagneticButton>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {[
          {
            icon: <Zap size={32} />,
            title: 'Instant Rewards',
            desc: 'Get coins immediately after task completion',
            color: 'from-amber-500/20 to-yellow-500/20',
          },
          {
            icon: <Shield size={32} />,
            title: 'Verified Tasks',
            desc: 'All tasks are verified for authenticity',
            color: 'from-blue-500/20 to-cyan-500/20',
          },
          {
            icon: <TrendingUp size={32} />,
            title: 'Growth Opportunities',
            desc: 'Unlock higher rewards with SRK Grow',
            color: 'from-purple-500/20 to-pink-500/20',
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <DashboardGlassCard
              hover
              gradient={index === 0 ? 'gold' : index === 1 ? 'blue' : 'purple'}
            >
              <div className="p-6">
                <div
                  className={`w-14 h-14 rounded-2xl bg-div-to-br ${feature.color} flex items-center justify-center mb-4`}
                >
                  <div className="from-[#ac9976] to-[#e1ba73]">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400">{feature.desc}</p>
              </div>
            </DashboardGlassCard>
          </motion.div>
        ))}
      </div>

      {/* Floating animated elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-10 opacity-20"
      >
        <Coins size={40} className="from-[#ac9976] to-[#e1ba73]" />
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-1/4 right-10 opacity-20"
      >
        <Trophy size={40} className="text-purple-400" />
      </motion.div>
    </div>
  </div>
);
