import React, { useState, useRef, useCallback, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, ExternalLink, Sparkles } from 'lucide-react';
import TaskProgramButton from '../../components/TaskProgramButton';
import GrowProgramButton from '../../components/GrowProgramButton';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

// Magnetic Button Component
const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = "", onClick = () => {} }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={`relative px-8 py-4 rounded-full bg-gradient-to-r from-[#e1ba73] via-[#d4af37] to-[#b68938] text-black font-bold text-sm md:text-base uppercase tracking-wider hover:shadow-[0_0_60px_rgba(225,186,115,0.7)] active:scale-95 flex items-center gap-2 overflow-hidden group ${className}`}
      style={{ 
        boxShadow: '0 8px 32px rgba(182, 137, 56, 0.4)',
        backgroundSize: '200% 100%',
        backgroundPosition: '0% 0%'
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

// Spotlight Card Component
const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className = "", hoverable = true }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !hoverable) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  }, [hoverable]);

  const handleMouseLeave = useCallback(() => {
    if (!hoverable) return;
    setMousePosition({ x: 0, y: 0 });
  }, [hoverable]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className={`group relative rounded-3xl backdrop-blur-xl border bg-gradient-to-br from-white/5 to-transparent transition-all duration-500 ${hoverable ? 'hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(182,137,56,0.15)]' : ''} ${className}`}
      style={{
        background: 'rgba(26, 20, 16, 0.4)',
        borderColor: 'rgba(182, 137, 56, 0.2)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(225, 186, 115, 0.1), transparent 40%)`,
        }}
      />

      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-[#e1ba73]/0 via-[#e1ba73]/10 to-[#b68938]/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
      
      <div className="relative z-10 h-full">
        {children}
      </div>

      <div className="absolute top-0 left-0 w-12 h-12 border-l border-t border-[#e1ba73]/20 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-[#b68938]/20 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-l border-b border-[#e1ba73]/20 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-r border-b border-[#b68938]/20 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

const SRKGrowPortal = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0705] to-black" />
        
        {/* Animated Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-[1px] h-[1px] bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
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

        {/* Grid Pattern */}
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

        {/* Gradient Orbs */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/10 blur-[100px] rounded-full"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#b68938]/10 to-[#e1ba73]/10 blur-[100px] rounded-full"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-20">
        
        {/* Header with Animation */}
        <motion.div 
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full border border-[#b68938]/30 bg-gradient-to-r from-[#0a0705]/80 to-black/80 backdrop-blur-xl"
            animate={{
              boxShadow: [
                '0 0 20px rgba(225, 186, 115, 0.2)',
                '0 0 40px rgba(225, 186, 115, 0.4)',
                '0 0 20px rgba(225, 186, 115, 0.2)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-[#e1ba73] animate-pulse" />
            <span className="text-sm font-bold tracking-widest uppercase text-[#e1ba73]">Welcome to the Ecosystem</span>
            <Sparkles className="w-5 h-5 text-[#e1ba73] animate-pulse" />
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{
              background: 'linear-gradient(90deg, #e1ba73, #ffffff, #b68938, #e1ba73)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            SRK GROW
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto"
          >
            Choose your path to growth and success
          </motion.p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* GROW Affiliate Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SpotlightCard className="h-full">
              <div className="p-10 lg:p-12 flex flex-col h-full min-h-[500px]">
                {/* Icon */}
                <motion.div 
                  className="mb-8"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#e1ba73] to-[#b68938] flex items-center justify-center shadow-[0_20px_40px_rgba(182,137,56,0.3)]">
                    <TrendingUp className="w-10 h-10 text-black" />
                  </div>
                </motion.div>

                {/* Title */}
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  GROW Affiliate
                </h2>

                {/* Subtitle */}
                <p className="text-[#e1ba73] text-sm uppercase tracking-widest font-bold mb-6">
                  Partner Dashboard
                </p>

                {/* Description */}
                <p className="text-gray-400 text-lg font-medium mb-8 leading-relaxed flex-grow">
                  Access your affiliate dashboard to track referrals, monitor earnings, and manage your growth network. 
                  Join the elite community of SRK partners.
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {['Real-time Analytics', 'Commission Tracking', 'Marketing Tools'].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938]" />
                      <span className="text-sm text-gray-300 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <TaskProgramButton size="lg" variant="solid" />
              </div>
            </SpotlightCard>
          </motion.div>

          {/* SRK GROW Website Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <SpotlightCard className="h-full">
              <div className="p-10 lg:p-12 flex flex-col h-full min-h-[500px]">
                {/* Icon */}
                <motion.div 
                  className="mb-8"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#b68938] to-[#e1ba73] flex items-center justify-center shadow-[0_20px_40px_rgba(225,186,115,0.3)]">
                    <Users className="w-10 h-10 text-black" />
                  </div>
                </motion.div>

                {/* Title */}
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  SRK GROW
                </h2>

                {/* Subtitle */}
                <p className="text-[#e1ba73] text-sm uppercase tracking-widest font-bold mb-6">
                  Main Platform
                </p>

                {/* Description */}
                <p className="text-gray-400 text-lg font-medium mb-8 leading-relaxed flex-grow">
                  Visit the main SRK GROW website to explore our services, purchase growth packages, 
                  and discover how we can amplify your social media presence.
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {['Premium Services', 'Growth Packages', 'Expert Support'].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73]" />
                      <span className="text-sm text-gray-300 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <GrowProgramButton size="lg" variant="solid" />

              </div>
            </SpotlightCard>
          </motion.div>
        </div>

        {/* Bottom Badge */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 md:mt-16 text-center max-w-6xl mx-auto pb-10"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="w-2 h-2 rounded-full bg-[#e1ba73] animate-pulse" />
            <span className="text-sm text-gray-400 font-medium">Trusted by 50,000+ creators worldwide</span>
          </div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        
        body {
          background-color: #000000;
          font-family: 'Manrope', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        ::-webkit-scrollbar {
          width: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0705;
          border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #b68938, #e1ba73);
          border-radius: 6px;
          border: 2px solid #0a0705;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #e1ba73, #b68938);
        }
        
        ::selection {
          background: rgba(225, 186, 115, 0.3);
          color: white;
        }
      `}} />
    </div>
  );
};

export default SRKGrowPortal;