import React from 'react';
import { motion } from 'framer-motion';

const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent';

export const PackageCardSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-8">
        {/* Title */}
        <div className={`h-7 w-2/3 rounded-md bg-white/10 mb-3 ${shimmer}`} />

        {/* Description */}
        <div className={`h-4 w-full rounded-md bg-white/10 mb-2 ${shimmer}`} />
        <div className={`h-4 w-4/5 rounded-md bg-white/10 mb-6 ${shimmer}`} />

        {/* Price */}
        <div className="mb-8">
          <div className={`h-10 w-1/2 rounded-lg bg-white/10 ${shimmer}`} />
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`h-5 w-5 rounded-full bg-white/10 ${shimmer}`} />
              <div className={`h-4 w-full rounded-md bg-white/10 ${shimmer}`} />
            </div>
          ))}
        </div>

        {/* Button */}
        <div className={`h-12 w-full rounded-xl bg-white/10 ${shimmer}`} />
      </div>
    </motion.div>
  );
};
