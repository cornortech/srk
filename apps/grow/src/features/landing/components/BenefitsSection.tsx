import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, BarChart3, Globe, Users, CheckCircle } from 'lucide-react';
import SpotlightCard from '../../../lib/ui/SpotlightCards';

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "100% Verified Users",
      description:
        "Every engagement comes from KYC-verified SRK University students. Zero bots, zero fake accounts.",
    },
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      description:
        "Watch your metrics grow in real-time. Our distributed network ensures rapid task completion.",
    },
    {
      icon: BarChart3,
      title: "Transparent Analytics",
      description:
        "Track every follower, like, and engagement with detailed dashboards and real-time reporting.",
    },
    {
      icon: Globe,
      title: "Organic Algorithm Boost",
      description:
        "Authentic engagement signals improve your content's reach across all social platforms.",
    },
    {
      icon: Users,
      title: "Targeted Demographics",
      description:
        "Reach the audience that matters most to your brand with precision targeting options.",
    },
    {
      icon: CheckCircle,
      title: "24/7 Dedicated Support",
      description:
        "Our expert team is always available to help you optimize your growth strategy.",
    },
  ];

  return (
    <section
      id="benefits"
      className="py-32 px-6 bg-[#0a0705] relative overflow-hidden"
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-20"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(182, 137, 56, 0.1), transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">
              SRK Grow
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            Built on trust, powered by technology, and designed for sustainable
            growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <SpotlightCard
                delay={i * 0.1}
                className="group hover:border-[#b68938]/50 transition-all h-full"
              >
                <div className="p-8 relative">
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(182, 137, 56, 0.1), transparent 70%)",
                    }}
                  />

                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-[#b68938]/15 flex items-center justify-center mb-6 relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <benefit.icon
                      size={28}
                      className="text-[#b68938] relative z-10"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-[#b68938]/20"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#b68938] transition-colors relative z-10">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                    {benefit.description}
                  </p>

                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#b68938] to-[#e1ba73]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
