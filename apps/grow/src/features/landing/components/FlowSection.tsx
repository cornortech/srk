import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Package, Target, Sparkles } from 'lucide-react';
import SpotlightCard from '../../../lib/ui/SpotlightCards';

export const FlowSection = () => {
  const steps = [
    {
      number: "01",
      title: "SRK University",
      subtitle: "Verified Students",
      description:
        "Students register through the official SRK University portal with complete KYC verification.",
      icon: Shield,
      color: "from-blue-500 to-blue-600",
    },
    {
      number: "02",
      title: "SRK Grow",
      subtitle: "Package Selection",
      description:
        "You choose your growth package based on your needs - followers, likes, engagement, or comprehensive plans.",
      icon: Package,
      color: "from-[#b68938] to-[#e1ba73]",
      highlight: true,
    },
    {
      number: "03",
      title: "SRK Task",
      subtitle: "Task Distribution",
      description:
        "Your selected package automatically generates verified tasks distributed to active SRK Task users.",
      icon: Target,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <section
      id="flow"
      className="py-32 px-6 bg-[#0a0705] relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(182, 137, 56, 0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "24px 24px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-5 px-5 py-2 rounded-full border border-[#e1ba73]/30 bg-[#1a1410]/50 backdrop-blur-sm relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b68938]/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-bold text-[#b68938] tracking-widest uppercase relative z-10">
              The Ecosystem
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">
              It Works
            </span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            A seamless three-step ecosystem connecting verified users, growth
            packages, and authentic engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 z-0 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[#b68938] to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {steps.map((step, i) => (
            <SpotlightCard
              key={i}
              delay={i * 0.2}
              className={`relative z-10 group ${
                step.highlight ? "ring-2 ring-[#b68938]/50" : ""
              }`}
            >
              <div className="p-8 relative">
                <div className="flex items-center justify-between mb-6">
                  <motion.span
                    className="text-6xl font-bold text-white/5"
                    whileHover={{
                      scale: 1.1,
                      color: "rgba(182, 137, 56, 0.1)",
                    }}
                  >
                    {step.number}
                  </motion.span>
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <step.icon size={32} className="text-white" />
                  </motion.div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#b68938] transition-colors">
                  {step.title}
                </h3>
                <div className="text-[#b68938] font-bold text-sm uppercase tracking-wider mb-4">
                  {step.subtitle}
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>

                {step.highlight && (
                  <motion.div
                    className="mt-6 px-4 py-2 rounded-lg bg-[#b68938]/10 border border-[#b68938]/30 relative overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b68938]/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="flex items-center gap-2 text-[#b68938] text-sm font-bold relative z-10">
                      <Sparkles size={16} />
                      <span>You Are Here</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};
