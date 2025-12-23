import { forwardRef } from 'react';
import { PackageDetails } from '../../../lib/types/types';
import PackageCard from '../../../lib/ui/PackageCard';
import { api } from '../../../lib/api';

interface PackagesSectionProps {
  onPackageSelect: (pkg: PackageDetails) => void;
}

const PackagesSection = forwardRef<HTMLElement, PackagesSectionProps>(
  ({ onPackageSelect }, ref) => {
    const { data: growPackagesRes, isLoading } =
      api.package.getAllSrkGrowPackages.useQuery(['packages']);

    if (isLoading) return <div className="py-20 text-center text-white">Loading Packages...</div>;
    
    if (!growPackagesRes?.body) return <div className="py-20 text-center text-white">No data found</div>;

    return (
      <section
        ref={ref}
        id="packages"
        className="py-32 px-6 bg-gradient-to-b from-[#0a0705] to-black relative overflow-hidden"
      >
        {/* Decorative Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#b68938]/5 blur-[150px] rounded-full" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
              Choose Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">
                Growth Package
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {growPackagesRes.body.map((pkg: any, i: number) => (
              <PackageCard
                key={pkg._id || i}
                pkg={pkg}
                index={i}
                onPackageSelect={() => onPackageSelect(pkg)}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
);

export default PackagesSection;