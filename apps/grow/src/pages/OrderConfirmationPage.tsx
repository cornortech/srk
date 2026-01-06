import { useLocation, useNavigate } from 'react-router-dom';
import { OrderConfirmation } from '../features/landing/components/OrderConfirmation';
import { OrderDetails } from '../lib/types/types';

export const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails as OrderDetails;

  if (!orderDetails) {
    setTimeout(() => navigate('/'), 0);
    return null;
  }

  const handleBack = () => {
    navigate('/');
  };

  return (
    <OrderConfirmation
      orderDetails={orderDetails}
      onBack={handleBack}
    />
  );
};
