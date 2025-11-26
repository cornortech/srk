import "./styles.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/onboarding/Login";
import OTPVerificationPage from "./pages/onboarding/OtpVerification";
import BankRegisterPage from "./pages/onboarding/Register";
import BankUserPreviewPage from "./pages/onboarding/Preview";
import BankUploadImage from "./pages/onboarding/UploadImage";
import BankSetupPinPage from "./pages/onboarding/SetupPin";
import ModernBankDashboard from "./pages/dashboard/BankDashboard";
import BankStatement from "./pages/dashboard/BankStatement/page";
import AccountSettings from "./pages/setting/page";
import BankPayout from "./pages/dashboard/BankPayout/page";
import PasswordResetPage from "./pages/dashboard/PasswordReset/page";
import SendMoneyPage from "./pages/dashboard/payment/SendMoney";
import SendMoneyPinPage from "./pages/dashboard/payment/SendMoneyPin";
import SendMoneyPreviewPage from "./pages/dashboard/payment/SendMoneyPreview";
import SendMoneySuccessPage from "./pages/dashboard/payment/SendMoneySuccessPage";
import SendMoneyFailurePage from "./pages/dashboard/payment/SendMoneyFailurePage";
import WithdrawMoneyPage from "./pages/dashboard/withdrawMoney/page";
import AddMoneyPage from "./pages/dashboard/addMoney/page";
import QRPage from "./pages/dashboard/QRPage/page";
import BankDashboardLayout from "./components/layout/BankDashboardLayout";
import { AuthenticateLayout } from "@srk/shared/layouts";
import CallbackPage from "./pages/Callback";

const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path: "/callback",
            element: <CallbackPage />,
        },
        {
            path: "/",
            element: <h1>Welcome to SRK BANK</h1>,
        },
        {
            path: "/bank/login",
            element: <LoginPage />,
        },
        {
            path: "/bank/onboarding",
            children: [
                { path: "otp-verification", element: <OTPVerificationPage /> },
                { path: "register", element: <BankRegisterPage /> },
                { path: "user-preview", element: <BankUserPreviewPage /> },
                { path: "upload-image", element: <BankUploadImage /> },
                { path: "setup-pin", element: <BankSetupPinPage /> },
            ],
        },
        {
            path: "/bank/dashboard",
            element: (
                <AuthenticateLayout>
                    <BankDashboardLayout />
                </AuthenticateLayout>
            ),
            children: [
                { index: true, element: <ModernBankDashboard /> },
                { path: "account/statement", element: <BankStatement /> },
                { path: "account/settings", element: <AccountSettings /> },
                { path: "account/payouts", element: <BankPayout /> },
                { path: "account/settings/reset-password", element: <PasswordResetPage /> },
                { path: "account", element: <ModernBankDashboard /> },
                {
                    path: "send-money",
                    children: [
                        {
                            path: "",
                            index: true,
                            element: <SendMoneyPage />,
                        },
                        {
                            path: "pin",
                            element: <SendMoneyPinPage />,
                        },
                        {
                            path: "preview",
                            element: <SendMoneyPreviewPage />,
                        },
                        {
                            path: "success",
                            element: <SendMoneySuccessPage />,
                        },
                        {
                            path: "failure",
                            element: <SendMoneyFailurePage />,
                        },
                    ],
                },
                {
                    path: "withdraw-money",
                    children: [
                        {
                            path: "",
                            index: true,
                            element: <WithdrawMoneyPage />,
                        },
                    ],
                },
                {
                    path: "addMoney",
                    children: [
                        {
                            path: "",
                            index: true,
                            element: <AddMoneyPage />,
                        },
                    ],
                },
                {
                    path: "QRpay",
                    children: [
                        {
                            path: "",
                            index: true,
                            element: <QRPage />,
                        },
                    ],
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

function App() {
    const client = new QueryClient();
    return (
        <QueryClientProvider client={client}>
            <AppRouter />
        </QueryClientProvider>
    );
}

export default App;