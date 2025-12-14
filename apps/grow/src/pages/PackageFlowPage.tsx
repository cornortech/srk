import { useLocation, useNavigate } from 'react-router-dom';
import { PackageSelectionFlow } from '../features/landing/components/PackageSelectionFlow';
import { PackageDetails, UserDetails } from '../lib/types/types';

export const PackageFlowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPackage = location.state?.package as PackageDetails;

  if (!selectedPackage) {
    // If accessed directly without state, redirect to landing
    // In a real app, you might want to fetch package by ID from URL params
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
