import React from 'react';
import { CoinExchangeView as CoinExchangeViewComponent } from '../../../features/dashboard/views/CoinExchangeView';
import { useDashboardContext } from '../layout/DashboardLayoutWrapper';

export const CoinExchangePage: React.FC = () => {
  const {
    eligible,
    balance,
    payoutRequested,
    setPayoutRequested,
    addNotification,
  } = useDashboardContext();

  return (
    <CoinExchangeViewComponent
      eligible={eligible}
      balance={balance}
      payoutRequested={payoutRequested}
      setPayoutRequested={setPayoutRequested}
      addNotification={addNotification}
    />
  );
};

export default CoinExchangePage;
