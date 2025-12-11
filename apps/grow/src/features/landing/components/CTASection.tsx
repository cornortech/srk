import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PackageDetails } from '../../../lib/types/types';
import {MagneticButton} from '../../../lib/ui/MagneticButton';
import { PACKAGES_DATA } from '../../../lib/utils/constants';

interface CTASectionProps {
  onPackageSelect: (pkg: PackageDetails) => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onPackageSelect }) => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#b68938]/20 via-black to-[#e1ba73]/20" />

      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(182, 137, 56, 0.3), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#b68938] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-[#b68938]/30 relative overflow-hidden group"
          style={{ background: "rgba(26, 20, 16, 0.6)" }}
        >
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(182, 137, 56, 0.3), transparent)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Sparkles className="w-12 h-12 text-[#b68938] mx-auto mb-6" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">
              Grow?
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-400 mb-10 leading-relaxed relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Join thousands of creators who've amplified their reach through the
            SRK ecosystem. Select your package and start growing today.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <a href="#packages">
              <MagneticButton>
                View All Packages <ArrowRight size={20} className="ml-2" />
              </MagneticButton>
            </a>
            <motion.button
              onClick={() =>
                onPackageSelect(PACKAGES_DATA.intermediate)
              }
              className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-sm uppercase tracking-widest transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Get Started Now</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="mt-12 pt-8 border-t border-white/10 flex items-center justify-center gap-8 text-sm text-gray-500 flex-wrap relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {["No Contract", "Instant Activation", "24/7 Support"].map(
              (item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <Sparkles size={16} className="text-[#b68938]" />
                  <span>{item}</span>
                </motion.div>
              )
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
