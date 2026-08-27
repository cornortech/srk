import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Users,
  Target,
  Wallet,
  Smartphone,
  Wifi,
  Server,
  Pause,
  MessageSquare,
  Play,
} from 'lucide-react';

export const AvailableEverywhere = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const bouncySpring = { stiffness: 150, damping: 15, restDelta: 0.001 };

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]),
    springConfig
  );
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.7, 1, 1, 0.9]),
    bouncySpring
  );
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [100, -100]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]),
    springConfig
  );

  const contentY = useTransform(scrollYProgress, [0.2, 0.8], [0, -30]);

  const shinePosition = useSpring(
    useTransform(scrollYProgress, [0, 1], ['-100%', '200%']),
    springConfig
  );
  const shineOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]),
    springConfig
  );

  const features = [
    {
      icon: Smartphone,
      title: 'Universal Access',
      desc: 'Works flawlessly on iOS, Android, and Web.',
      delay: 0.1,
    },
    {
      icon: Wifi,
      title: 'Low Latency',
      desc: 'Optimized for 4G/5G networks with real-time sync.',
      delay: 0.2,
    },
    {
      icon: Server,
      title: 'Secure Extracts',
      desc: 'Bank-grade encryption for all Activitys.',
      delay: 0.3,
    },
  ];

  const [notifications, setNotifications] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [animatedBalance, setAnimatedBalance] = useState(24500);
  const [pulse, setPulse] = useState(1);
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 1000 });
  console.log(windowSize);
  // Notification triggers based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (latest > 0.25 && !notifications[0]) {
        setTimeout(
          () => setNotifications((prev) => [true, prev[1], prev[2]]),
          300
        );
      }
      if (latest > 0.5 && !notifications[1]) {
        setTimeout(
          () => setNotifications((prev) => [prev[0], true, prev[2]]),
          600
        );
      }

      // Balance animation based on scroll
      if (latest > 0.4 && latest < 0.6) {
        const newBalance = 24500 + Math.floor(latest * 1000);
        setAnimatedBalance(newBalance);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, notifications]);

  // Continuous animations
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setAnimatedBalance((prev) => {
        const randomChange = Math.floor(Math.random() * 100) - 50;
        return Math.max(20000, prev + randomChange);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Pulsing animation for dynamic island
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => (prev === 1 ? 1.2 : 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Window resize handler
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

  const toggleAnimation = useCallback(() => {
    setIsAnimating((prev) => !prev);
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden min-h-[120vh] sm:min-h-[140vh] lg:min-h-[150vh]"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-r from-[#b68938]/5 to-transparent blur-[80px] sm:blur-[100px] lg:blur-[120px] rounded-full pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[300px] sm:w-[450px] lg:w-[600px] h-[300px] sm:h-[450px] lg:h-[600px] bg-gradient-to-r from-[#b68938]/5 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[375px] lg:w-[500px] h-[250px] sm:h-[375px] lg:h-[500px] bg-gradient-to-l from-[#e1ba73]/5 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        {/* Phone Mockup */}
        <div className="flex justify-center lg:justify-end order-2 lg:order-1">
          <motion.div
            style={{
              rotateX,
              rotateY,
              scale: scale,
              y,
              opacity,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-[280px] sm:w-[320px] lg:w-[340px] h-[580px] sm:h-[660px] lg:h-[700px] bg-black rounded-[45px] sm:rounded-[50px] lg:rounded-[55px] border-[8px] sm:border-[9px] lg:border-[10px] border-[#1a1a1a] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] sm:shadow-[0_40px_80px_-18px_rgba(0,0,0,0.75)] lg:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <motion.div
              style={{
                x: shinePosition,
                opacity: shineOpacity,
              }}
              className="absolute inset-0 z-20 pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-[-20deg]" />
            </motion.div>

            <div className="absolute -inset-[3px] sm:-inset-[3.5px] lg:-inset-[4px] rounded-[50px] sm:rounded-[55px] lg:rounded-[60px] bg-gradient-to-tr from-[#b68938] via-[#e1ba73] to-[#b68938] -z-10 opacity-60" />

            {/* Phone Screen */}
            <div className="w-full h-full bg-[#050505] rounded-[38px] sm:rounded-[42px] lg:rounded-[46px] overflow-hidden relative flex flex-col font-sans">
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] sm:w-[110px] lg:w-[120px] h-[28px] sm:h-[31px] lg:h-[35px] bg-black rounded-b-3xl z-50 flex items-center justify-center gap-2 sm:gap-2.5 lg:gap-3 px-2 sm:px-2.5 lg:px-3 border-x border-b border-white/10"
                animate={{
                  scale: pulse,
                  boxShadow:
                    pulse === 1.2 ? '0 0 20px rgba(225,186,115,0.5)' : 'none',
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-1.5 sm:w-1.5 lg:w-2 h-1.5 sm:h-1.5 lg:h-2 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938]"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-500 font-medium">
                  SRK Active
                </span>
              </motion.div>

              <motion.div
                style={{ y: contentY }}
                className="pt-10 sm:pt-12 lg:pt-14 px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 flex flex-col gap-5 sm:gap-6 lg:gap-8 h-full overflow-y-auto scrollbar-hide"
              >
                {/* User Header */}
                <motion.div
                  className="flex justify-between items-center"
                  animate={{
                    x: notifications.some((n) => n) ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">
                      Welcome back,
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      Rahul Kumar
                    </div>
                  </div>
                  <motion.div
                    className="w-10 sm:w-11 lg:w-12 h-10 sm:h-11 lg:h-12 rounded-full border border-[#b68938]/30 p-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
                      alt="User"
                      className="w-full h-full rounded-full bg-[#111]"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=Rahul&background=111&color=e1ba73&bold=true`;
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* Balance Card */}
                <motion.div
                  className="w-full aspect-[1.6] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410] to-black border border-[#b68938]/20" />
                  <motion.div
                    className="absolute top-0 right-0 w-32 sm:w-36 lg:w-40 h-32 sm:h-36 lg:h-40 bg-gradient-to-br from-[#e1ba73]/10 to-[#b68938]/10 blur-[50px] sm:blur-[55px] lg:blur-[60px] rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                  />

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                      <motion.div
                        className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/5"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Wallet className="w-4 sm:w-4.5 lg:w-5 h-4 sm:h-4.5 lg:h-5 text-[#e1ba73]" />
                      </motion.div>
                      <motion.div
                        className="text-[#e1ba73] text-[8px] sm:text-[9px] lg:text-[10px] font-bold tracking-widest bg-gradient-to-r from-[#e1ba73]/20 to-[#b68938]/20 px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 rounded-full"
                        animate={{
                          background: [
                            'linear-gradient(to right, rgba(225,186,115,0.2), rgba(182,137,56,0.2))',
                            'linear-gradient(to right, rgba(225,186,115,0.3), rgba(182,137,56,0.3))',
                            'linear-gradient(to right, rgba(225,186,115,0.2), rgba(182,137,56,0.2))',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        PRO MEMBER
                      </motion.div>
                    </div>

                    <div>
                      <div className="text-gray-400 text-[9px] sm:text-[10px] lg:text-xs mb-0.5 sm:mb-1 uppercase tracking-wide">
                        Total Progress
                      </div>
                      <motion.div
                        key={animatedBalance}
                        initial={{ scale: 1.1, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight"
                      >
                        ₹{animatedBalance.toLocaleString()}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:gap-4">
                  <motion.button
                    className="py-2.5 sm:py-3 lg:py-3.5 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold text-xs sm:text-sm relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">Withdraw</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#b68938] to-[#e1ba73] opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                  <motion.button
                    className="py-2.5 sm:py-3 lg:py-3.5 rounded-xl bg-[#1a1a1c] text-white font-bold text-xs sm:text-sm border border-white/10 relative overflow-hidden group"
                    whileHover={{ scale: 1.05, borderColor: '#e1ba73' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">History</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/10 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>

                {/* Animation Controls */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={toggleAnimation}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#1a1a1c] text-[10px] sm:text-xs text-gray-400 border border-white/5 flex items-center gap-1.5 sm:gap-2 hover:border-[#e1ba73]/30 transition-colors"
                  >
                    {isAnimating ? (
                      <Pause size={10} className="sm:w-3 sm:h-3" />
                    ) : (
                      <Play size={10} className="sm:w-3 sm:h-3" />
                    )}
                    <span className="hidden sm:inline">
                      {isAnimating ? 'Pause' : 'Play'}
                    </span>
                  </button>
                </div>

                {/* Notifications Section */}
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xs sm:text-sm mb-2 sm:mb-3">
                    Recent Tasks
                  </h3>
                  <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                    {[
                      {
                        icon: Users,
                        title: 'Instagram Follow',
                        time: 'Just now',
                        amount: 50,
                      },
                      {
                        icon: Target,
                        title: 'YouTube View',
                        time: '5 min ago',
                        amount: 75,
                      },
                      {
                        icon: MessageSquare,
                        title: 'Comment Task',
                        time: '10 min ago',
                        amount: 35,
                      },
                    ].map((task, index) => {
                      const Icon = task.icon;
                      return (
                        <motion.div
                          key={task.title}
                          initial={{ opacity: 0, x: -20, scale: 0.9 }}
                          animate={{
                            opacity: notifications[index] ? 1 : 0,
                            x: notifications[index] ? 0 : -20,
                            scale: notifications[index] ? 1 : 0.9,
                          }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.2,
                            type: 'spring',
                            stiffness: 200,
                          }}
                          whileHover={{
                            scale: 1.02,
                            borderColor: '#e1ba73',
                            backgroundColor: 'rgba(26, 26, 26, 0.8)',
                          }}
                          className="flex items-center gap-3 sm:gap-3.5 lg:gap-4 p-3 sm:p-3.5 lg:p-4 rounded-xl sm:rounded-2xl bg-[#111] border border-white/5 backdrop-blur-md cursor-pointer"
                        >
                          <motion.div
                            className="w-8 sm:w-9 lg:w-10 h-8 sm:h-9 lg:h-10 rounded-full bg-gradient-to-r from-[#e1ba73]/20 to-[#b68938]/20 flex items-center justify-center shrink-0"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon
                              size={14}
                              className="sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px] text-[#e1ba73]"
                            />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-xs sm:text-sm font-medium truncate">
                              {task.title}
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-gray-500">
                              {task.time}
                            </div>
                          </div>
                          <motion.div
                            className="text-[#e1ba73] font-bold text-xs sm:text-sm shrink-0"
                            animate={{
                              scale: notifications[index] ? [1, 1.2, 1] : 1,
                            }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.3,
                            }}
                          >
                            +₹{task.amount}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-none mb-6 sm:mb-7 lg:mb-8 tracking-tight">
              Available <br />
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] to-white inline-block"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                Everywhere.
              </motion.span>
            </h2>

            <motion.p
              className="text-base sm:text-lg lg:text-xl text-gray-400 mb-8 sm:mb-9 lg:mb-10 leading-relaxed font-medium border-l-4 border-[#b68938]/30 pl-4 sm:pl-5 lg:pl-6 py-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your Progress potential travels with you. Whether you're commuting,
              waiting, or relaxing, access thousands of verified tasks instantly
              from any device.
            </motion.p>

            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: feature.delay }}
                    whileHover={{
                      x: 10,
                      borderColor: '#e1ba73',
                      boxShadow: '0 10px 30px rgba(225, 186, 115, 0.1)',
                    }}
                    className="flex items-start gap-3 sm:gap-4 lg:gap-5 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/5 transition-all duration-500 group cursor-pointer"
                  >
                    <motion.div
                      className="w-10 sm:w-11 lg:w-12 h-10 sm:h-11 lg:h-12 rounded-xl bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/10 flex items-center justify-center text-[#e1ba73]"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      animate={{
                        boxShadow: [
                          '0 0 0px rgba(225,186,115,0.2)',
                          '0 0 20px rgba(225,186,115,0.4)',
                          '0 0 0px rgba(225,186,115,0.2)',
                        ],
                      }}
                    >
                      <Icon size={20} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </motion.div>
                    <div>
                      <h4 className="text-white font-bold text-base sm:text-lg mb-0.5 sm:mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-gray-500 text-xs sm:text-sm font-medium">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 sm:mt-9 lg:mt-10 flex flex-wrap gap-3 sm:gap-3.5 lg:gap-4"
            >
              {[
                { platform: 'App Store', icon: Smartphone },
                { platform: 'Google Play', icon: Smartphone },
              ].map((store, i) => {
                const Icon = store.icon;
                return (
                  <motion.div
                    key={store.platform}
                    className="px-4 sm:px-5 lg:px-6 py-2.5 sm:py-2.5 lg:py-3 rounded-xl bg-gradient-to-r from-[#1a1a1c] to-black border border-white/10 hover:border-[#e1ba73]/30 transition-colors cursor-pointer relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 relative z-10">
                      <motion.div
                        className="w-7 sm:w-7.5 lg:w-8 h-7 sm:h-7.5 lg:h-8 rounded-lg bg-white/10 flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-3.5 sm:w-3.5 lg:w-4 h-3.5 sm:h-3.5 lg:h-4 text-white" />
                      </motion.div>
                      <div>
                        <div className="text-[10px] sm:text-xs text-gray-400">
                          {i === 0 ? 'Download on' : 'Get it on'}
                        </div>
                        <div className="text-white font-bold text-xs sm:text-sm">
                          {store.platform}
                        </div>
                      </div>
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#e1ba73]/5 to-[#b68938]/5 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
