import React, { forwardRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PACKAGES_DATA } from '../../../lib/utils/constants';
import { PackageDetails } from '../../../lib/types/types';
import PackageCard from '../../../lib/ui/PackageCard';
import { TSrkGrowPackagesSchema } from '@srk/shared/contracts';
import { api } from '../../../lib/api';

export interface PackagesSectionProps {
  onPackageSelect: (pkg: TSrkGrowPackagesSchema) => void;
  onGrowPackagesLoaded?: (packages: TSrkGrowPackagesSchema[]) => void;
}

const PackagesSection = forwardRef<HTMLElement, PackagesSectionProps>(
  ({ onPackageSelect, onGrowPackagesLoaded }, ref) => {
    const generalPackages = [
      PACKAGES_DATA.starter,
      PACKAGES_DATA.intermediate,
      PACKAGES_DATA.pro,
    ];

    const [packages, setPackages] = useState<TSrkGrowPackagesSchema[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchPackages = async () => {
        try {
          setIsLoading(true);
          // Call the core API directly without React Query hook
          const response = await api.package.getAllSrkGrowPackages();
          console.log('API Response:', response);
          
          if (Array.isArray(response.body)) {
            setPackages(response.body);
            if (onGrowPackagesLoaded) {
              onGrowPackagesLoaded(response.body);
            }
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Failed to load packages';
          console.error('Error loading packages:', err);
          setError(errorMsg);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPackages();
    }, [onGrowPackagesLoaded]);

    if (isLoading) {
      return (
        <section
          ref={ref}
          id="packages"
          className="py-32 px-6 bg-gradient-to-b from-[#0a0705] to-black relative overflow-hidden"
        >
          <div className="text-center py-20">
            <p className="text-gray-400">Loading packages...</p>
          </div>
        </section>
      );
    }

    if (error) {
      return (
        <section
          ref={ref}
          id="packages"
          className="py-32 px-6 bg-gradient-to-b from-[#0a0705] to-black relative overflow-hidden"
        >
          <div className="text-center py-20">
            <p className="text-red-400">Error loading packages: {error}</p>
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
            {Array.isArray(packages) && packages.length > 0 ? (
              packages.map((pkg: TSrkGrowPackagesSchema, i: number) => (
                <PackageCard
                  key={`general-${i}`}
                  pkg={pkg}
                  index={i}
                  onPackageSelect={onPackageSelect}
                />
              ))
            ) : (
              <p className="text-gray-400 col-span-3 text-center py-8">
                No packages available to display
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }
);

export default PackagesSection;
