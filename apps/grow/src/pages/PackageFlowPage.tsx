import { useLocation, useNavigate } from 'react-router-dom';
import { PackageSelectionFlow } from '../features/package-flow/components/PackageSelectionFlow';
import { PackageDetails, UserDetails } from '../lib/types/types';
import { useEffect, useState } from 'react';
import { api } from '../lib/api'; // Ensure this path is correct

export const PackageFlowPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Get query params from the URL (for referral links)
  const queryParams = new URLSearchParams(location.search);
  const pkgIdFromUrl = queryParams.get('package');
  const refFromUrl = queryParams.get('ref');

  // 2. State management
  const [selectedPackage, setSelectedPackage] = useState<PackageDetails | null>(
    location.state?.package || null
  );
  
  // Initialize referral code from URL first, then state
  const [referralCode, setReferralCode] = useState<string>(
    refFromUrl || location.state?.referralCode || ""
  );

  // 3. Fetch packages
  const { data: growPackagesRes, isLoading } = api.package.getAllSrkGrowPackages.useQuery(['packages']);

  // 4. Handle auto-selection & Referral logic
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

  // 5. Loading State
  // If we have a pkgId in URL but the package isn't matched yet, stay in loading
  const isResolvingPackage = (pkgIdFromUrl || location.state?.packageId) && !selectedPackage;

  if (isLoading || isResolvingPackage) {
    return (
      <div className="min-h-screen bg-[#0a0705] flex items-center justify-center">
         <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#b68938] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-medium tracking-widest uppercase text-sm">Initializing Secure Checkout...</p>
         </div>
      </div>
    );
  }

  return (
    <PackageSelectionFlow
      selectedPackage={selectedPackage}
      referralCode={referralCode} // Ensure selection flow uses this to set userDetails
      onBack={() => navigate('/')}
      onComplete={(details) => navigate('/order-confirmation', { state: { details } })}
    />
  );
};