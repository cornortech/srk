import "./styles.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthenticateLayout } from "@srk/shared/layouts";
import BankDashboardLayout from "../components/layout/BankDashboardLayout";
import CallbackPage from "./Callback";
import LoginPage from "./onboarding/Login";
import OTPVerificationPage from "./onboarding/OtpVerification";
import BankRegisterPage from "./onboarding/Register";
import BankUserPreviewPage from "./onboarding/Preview";
import BankUploadImage from "./onboarding/UploadImage";
import BankSetupPinPage from "./onboarding/SetupPin";
import ModernBankDashboard from "./dashboard/BankDashboard";
import BankStatement from "./dashboard/BankStatement/page";
import AccountSettings from "./setting/page";
import BankPayout from "./dashboard/BankPayout/page";
import PasswordResetPage from "./dashboard/PasswordReset/page";
import SendMoneyPage from "./dashboard/payment/SendMoney";
import SendMoneyPinPage from "./dashboard/payment/SendMoneyPin";
import SendMoneyPreviewPage from "./dashboard/payment/SendMoneyPreview";
import SendMoneySuccessPage from "./dashboard/payment/SendMoneySuccessPage";
import SendMoneyFailurePage from "./dashboard/payment/SendMoneyFailurePage";
import AddMoneyPage from "./dashboard/addMoney/page";
import WithdrawMoneyPage from "./dashboard/withdrawMoney/page";
import QRPage from "./dashboard/QRPage/page";

const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path: "/callback",
            element: <CallbackPage />,
        },
        {
            path: "/",
            element: (
                <AuthenticateLayout>
                    <BankDashboardLayout />
                </AuthenticateLayout>
            ),
            children: [
                { path: "login", element: <LoginPage /> },
                {
                    path: "onboarding",
                    children: [
                        { path: "otp-verification", element: <OTPVerificationPage /> },
                        { path: "register", element: <BankRegisterPage /> },
                        { path: "user-preview", element: <BankUserPreviewPage /> },
                        { path: "upload-image", element: <BankUploadImage /> },
                        { path: "setup-pin", element: <BankSetupPinPage /> },
                    ],
                },
                {
                    path: "dashboard",
                    element: <BankDashboardLayout />,
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
                                    element: <SendMoneySuccessPage />, //success page
                                },
                                {
                                    path: "failure",
                                    element: <SendMoneyFailurePage />, //failure page
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