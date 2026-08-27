import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import PackageCard from '../../../lib/ui/PackageCard';
import { api } from '../../../lib/api';
import { TSrkGrowPackagesSchema } from '@srk/shared/contracts';
import { PackageCardSkeleton } from '../../package-flow/components/ui/PackageCardSkeleton';
import { PackageX } from 'lucide-react';

interface PackagesSectionProps {
  onPackageSelect: (pkg: TSrkGrowPackagesSchema) => void;
}

const PackagesSection = forwardRef<HTMLElement, PackagesSectionProps>(
  ({ onPackageSelect }, ref) => {
    const { data: growPackagesRes, isLoading } =
      api.package.getAllSrkGrowPackages.useQuery(['packages']);

    if (
      growPackagesRes?.status !== 200 ||
      !growPackagesRes ||
      !growPackagesRes.body
    ) {
      return (
        <>
          {' '}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-3"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-16 text-center">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-[#b68938]/10 flex items-center justify-center">
                  <PackageX size={32} className="text-[#b68938]" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                No Packages Available
              </h3>

              <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                We couldn’t find any growth packages right now. This might be
                temporary. Please check back soon or refresh the page.
              </p>
            </div>
          </motion.div>
        </>
      );
    }

    if (isLoading) {
      return (
        <section className="py-32 px-6 bg-gradient-to-b from-[#0a0705] to-black">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      );
    }
    return (
      <section
        ref={ref}
        id="packages"
        className="py-32 px-6 bg-gradient-to-b from-[#0a0705] to-black relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#b68938]/5 blur-[150px] rounded-full" />

        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-[#e1ba73]/10 rounded-full blur-[80px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Choose Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">
                Growth Package
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
              Transparent pricing. No hidden fees. 100% verified engagement from
              real SRK Task users.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {growPackagesRes.body.map((pkg, i) => (
              <PackageCard
                key={`general-${i}`}
                pkg={pkg}
                index={i}
                onPackageSelect={onPackageSelect}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
);

export default PackagesSection;
