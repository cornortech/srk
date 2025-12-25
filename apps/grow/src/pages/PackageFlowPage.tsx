import { useLocation, useNavigate } from 'react-router-dom';
import { PackageSelectionFlow } from '../features/package-flow/components/PackageSelectionFlow';
import { UserDetails } from '../lib/types/types';
import { TSrkGrowPackagesSchema } from '@srk/shared/contracts';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export const PackageFlowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const selectedPackage = location.state?.package as TSrkGrowPackagesSchema;

  const queryParams = new URLSearchParams(location.search);
  const pkgIdFromUrl = queryParams.get('package');
  const refFromUrl = queryParams.get('ref');

  const [selectedPackage, setSelectedPackage] =
    useState<TSrkGrowPackagesSchema | null>(location.state?.package || null);

  const [referralCode, setReferralCode] = useState<string>(
    refFromUrl || location.state?.referralCode || ''
  );
  const { data: growPackagesRes, isLoading } =
    api.package.getAllSrkGrowPackages.useQuery(['packages']);

  useEffect(() => {
    if (growPackagesRes?.body) {
      // Priority 1: ID from URL (?package=...)
      // Priority 2: ID from location state (internal navigation)
      const targetId = pkgIdFromUrl || location.state?.packageId;

      if (targetId) {
        const pkg = growPackagesRes.body.find((p: any) => p._id === targetId);
        if (pkg) {
          setSelectedPackage(pkg);
        }
      }
    }
  }, [growPackagesRes, pkgIdFromUrl, location.state]);

  const isResolvingPackage =
    (pkgIdFromUrl || location.state?.packageId) && !selectedPackage;

  if (!selectedPackage || isResolvingPackage) {
    return (
      <div className="min-h-screen bg-[#0a0705] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#b68938] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium tracking-widest uppercase text-sm">
            Initializing Secure Checkout...
          </p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/');
  };

  const handleComplete = (details: UserDetails) => {
    navigate('/order-confirmation', { state: { userDetails: details } });
  };

  return (
    <PackageSelectionFlow
      selectedPackage={selectedPackage}
      referralCode={referralCode} // Ensure selection flow uses this to set userDetails
      onBack={() => navigate('/')}
      onComplete={(details) => navigate('/order-confirmation', { state: { details } })}
    />
  );
};
