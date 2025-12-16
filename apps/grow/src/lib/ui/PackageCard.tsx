import React from 'react';
import { motion } from 'framer-motion';
import SpotlightCard from './SpotlightCards';
import { TSrkGrowPackagesSchema } from '@srk/shared/contracts';
import { CheckCircle } from 'lucide-react';

interface PackageCardProps {
  pkg: TSrkGrowPackagesSchema;
  index: number;
  onPackageSelect: (pkg: TSrkGrowPackagesSchema) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  index,
  onPackageSelect,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -10 }}
    className="relative"
  >
    <SpotlightCard
      delay={index * 0.1}
      className={`relative h-full ${
        pkg.isPopular ? 'ring-2 ring-[#b68938] md:scale-105' : ''
      }`}
    >
      {pkg.isPopular && (
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black text-xs font-bold uppercase tracking-widest shadow-lg"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Most Popular
        </motion.div>
      )}

      <div className="p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
          {pkg.name}
        </h3>
        <p className="text-gray-500 text-sm mb-6 relative z-10">
          {pkg.description}
        </p>

        <div className="mb-8 relative z-10">
          <motion.span
            className="text-5xl font-bold text-[#b68938]"
            whileHover={{ scale: 1.1 }}
          >
            {pkg.amount}
          </motion.span>
          {pkg.amountBeforeDiscount && (
            <span className="text-lg text-gray-500 line-through ml-2">
              {pkg.amountBeforeDiscount}
            </span>
          )}
          <span className="text-gray-500 ml-2">One Time</span>
        </div>

        <ul className="space-y-4 mb-8 relative z-10">
          {pkg.features.map((feature, fi) => (
            <motion.li
              key={fi}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + fi * 0.05 }}
            >
              <CheckCircle
                size={20}
                className="text-[#b68938] shrink-0 mt-0.5"
              />
              <span className="text-gray-300 text-sm">{feature}</span>
            </motion.li>
          ))}
        </ul>

        <motion.button
          onClick={() => onPackageSelect(pkg)}
          className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all relative overflow-hidden group ${
            pkg.isPopular
              ? 'bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_40px_rgba(182,137,56,0.5)]'
              : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {pkg.isPopular && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          <span className="relative z-10">Select Package</span>
        </motion.button>
      </div>
    </SpotlightCard>
  </motion.div>
);

export default PackageCard;
