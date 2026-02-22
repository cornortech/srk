import { Route, Routes } from 'react-router-dom';
import { BankLayout } from './layouts/BankLayout';
import { BankDashboardLayout } from './layouts/BankDashboardLayout';

// Onboarding Pages
import BankLoginPage from './pages/onboarding/Login';
import OTPVerificationPage from './pages/onboarding/OtpVerification';
import BankRegisterPage from './pages/onboarding/Register';
import BankUserPreviewPage from './pages/onboarding/Preview';
import BankUploadImage from './pages/onboarding/UploadImage';
import BankSetupPinPage from './pages/onboarding/SetupPin';

// Dashboard Pages
import BankDashboardPage from './pages/dashboard/BankDashboard';

// Send Money Flow
import SendMoneyPage from './pages/dashboard/payment/SendMoney';
import SendMoneyPinPage from './pages/dashboard/payment/SendMoneyPin';
import SendMoneyPreviewPage from './pages/dashboard/payment/SendMoneyPreview';
import SendMoneySuccessPage from './pages/dashboard/payment/SendMoneySuccessPage';
import SendMoneyFailurePage from './pages/dashboard/payment/SendMoneyFailurePage';

// Other Features
import WithDrawMoneyPage from './pages/dashboard/withdrawMoney/page';
import AddMoneyPage from './pages/dashboard/addMoney/page';
import QRPage from './pages/dashboard/QRPage/page';
import AccountSettings from './pages/dashboard/AccountSettings';
import { BankPayout } from './pages/dashboard/Payouts';
import PasswordResetPage from './pages/dashboard/PasswordReset';
import CallbackPage from './pages/sso/SSOCallBack';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import UserVerification from './pages/onboarding/UserVerification';
import BankStatement from './pages/dashboard/BankStatement';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/" element={<BankLayout />}>
          <Route path="login" element={<BankLoginPage />} />
          <Route path="onboarding">
            <Route path="register" element={<BankRegisterPage />} />
            <Route path="otp-verification" element={<OTPVerificationPage />} />
            <Route path="upload-image" element={<BankUploadImage />} />
            <Route path="user-preview" element={<BankUserPreviewPage />} />
            <Route path="setup-pin" element={<BankSetupPinPage />} />
            <Route path="user-verification" element={<UserVerification />} />
          </Route>
          <Route path="dashboard" element={<BankDashboardLayout />}>
            <Route index element={<BankDashboardPage />} />
            <Route path="account/statement" element={<BankStatement />} />
            <Route path="account/settings" element={<AccountSettings />} />
            <Route path="account/payouts" element={<BankPayout />} />
            <Route
              path="account/settings/reset-password"
              element={<PasswordResetPage />}
            />
            <Route path="account" element={<BankDashboardPage />} />
            <Route path="send-money">
              <Route index element={<SendMoneyPage />} />
              <Route path="pin" element={<SendMoneyPinPage />} />
              <Route path="preview" element={<SendMoneyPreviewPage />} />
              <Route path="success" element={<SendMoneySuccessPage />} />
              <Route path="failure" element={<SendMoneyFailurePage />} />
            </Route>
            <Route path="withdraw-money">
              <Route index element={<WithDrawMoneyPage />} />
            </Route>
            <Route path="addMoney">
              <Route index element={<AddMoneyPage />} />
            </Route>
            <Route path="QRpay">
              <Route index element={<QRPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
