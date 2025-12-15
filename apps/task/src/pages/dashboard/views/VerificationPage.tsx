import React from 'react';
import { VerificationView as VerificationViewComponent } from '../../../features/dashboard/views/VerificationView';
import { useDashboardContext } from '../layout/DashboardLayoutWrapper';
import { useNavigate } from 'react-router-dom';

export const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isApproved,
    setShowVerification,
    hasPurchased,
    setHasPurchased,
    addNotification,
  } = useDashboardContext();

  return (
    <VerificationViewComponent
      isApproved={isApproved}
      setShowVerification={setShowVerification}
      hasPurchased={hasPurchased}
      setHasPurchased={setHasPurchased}
      addNotification={addNotification}
    />
  );
};

export default VerificationPage;
