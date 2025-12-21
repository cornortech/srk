import { useLocation, useNavigate } from 'react-router-dom';
import { PackageSelectionFlow } from '../features/package-flow/components/PackageSelectionFlow';
import { UserDetails } from '../lib/types/types';
import { TSrkGrowPackagesSchema } from '@srk/shared/contracts';

export const PackageFlowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPackage = location.state?.package as TSrkGrowPackagesSchema;

  if (!selectedPackage) {
    setTimeout(() => navigate('/'), 0);
    return null;
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
      onBack={handleBack}
      onComplete={handleComplete}
    />
  );
};
