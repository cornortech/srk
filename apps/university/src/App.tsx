import './App.css';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/Home';
import { SignUp } from './pages/SignUp';
import { PackagePage } from './pages/Package';
import { CourseDetails } from './pages/DetailsPage';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import EarningsDashboard from './pages/dashboard/Earning';
import CoursesDashboard from './components/dashboard/courses/CoursesDashboard';
import Leaderboard from './pages/dashboard/LearderBoard';
import EditProfileTabs from './pages/dashboard/EditProfile';
import { BankAndKYC } from './pages/dashboard/Bank&&KYC';
import CoursePlayer from './components/dashboard/courses/CoursesPlayer';
import ReferralPage from './components/dashboard/referral/ReferralPage';
import CreateCoursePage from './pages/admin/CreateCourse';
import CourseList from './pages/admin/Courses';
import CourseDetail from './pages/admin/CoursesDetails';
import { Invoice } from './pages/dashboard/Invoice';
import PayoutsPage from './pages/dashboard/Payout';
import { AddUsers } from './pages/admin/AddUsers';
import { ListOfUsers } from './pages/admin/ListOfUers';
import { PackageDetails } from './components/PackageDetails';
import { LogoNavbar } from './components/logoNavbar';
import AffiliateRequest from './pages/affiliate/AffiliateRequest';
import { AffilateRequestList } from './pages/admin/AffiliateRequestList';
import { AffilatePage } from './pages/affiliate/AffilatePage';
import { AddPackage } from './pages/admin/AddPackage';
import BalancePayouts from './pages/admin/BalancePayout';
import AdminEarningDashboard from './pages/admin/Earning';
import SrkBankPage from './pages/affiliate/SRKBank';
import PortalActivationPage from './pages/dashboard/PortalActivation';
import AffiliateDashboardLayout from './Layouts/AffiliateLayout';
import AdminLayout from './Layouts/AdminLayout';
import StudyDashboardLayout from './Layouts/StudyLayout';
import LayoutWithNavbar from './Layouts/NavbarLayout';
import AuthLayout from './Layouts/AuthLayout';
import AffiliateRequestVerification from './pages/dashboard/AffiliateRequestVerification';
import AdminSrkBankPage from './pages/admin/AdminSrkBankPage';
import SrkUniversityBank from './pages/admin/UniversityBank';
import TeamsPage from './pages/affiliate/Teams';
import AffiliateTerms from './pages/affiliate/AffiliateTermsAndConditions';
import TermsAndConditions from './pages/TermsAndCondition';
import PrivacyRefundPolicy from './pages/Privacy';
import BankRequest from './pages/admin/ BankRequest';
import { VerificatinPendingPage } from './pages/admin/PaymentVerification';
import PaymentVerificationAuthPage from './pages/auth/PaymentVerification';
import PackageSinglePage from './pages/PackageDetails';
import DisclaimerPage from './pages/Disclaimer';
import CreateWebinar from './pages/admin/CreateWebinar';
import AdminWebinarList from './components/admin/webinar/WebinarListTable/WebinarListTable';
import AdminSettings from './pages/admin/Settings';
import WebinarPage from './pages/affiliate/WebinarPage';
import SrkBonusFlow from './pages/affiliate/SrkBonusFlow';
import AdminSrkBonusFlow from './pages/admin/SrkBonusFlow';
import SrkBonusFlowAdminUser from './pages/admin/SrkBonusFlowAdminUser';
import TourTargetsPage from './pages/affiliate/TourTarget';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import FAQ from './pages/FAQ';
import Features from './pages/Features';
import GettingStarted from './pages/GettingStarted';
import Help from './pages/Help';
import HowItWorks from './pages/HowItWorks';
import AdminTourTargetUserPage from './pages/admin/TourTargetUserPage';
import SRKGrowPortal from './pages/dashboard/GrowViewPage';

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: '',
      element: <LayoutWithNavbar />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/packages', element: <PackagePage /> },
        { path: '/packages/:id', element: <PackageSinglePage /> },
        { path: '/webcam', element: <PortalActivationPage /> },
        {
          path: '/affiliate-landing',
          element: <AffilatePage viewMode={false} />,
        },
        { path: '/course/:courseId', element: <CourseDetails /> },
        { path: '/about', element: <AboutPage /> },
        { path: '/contact', element: <ContactPage /> },
        { path: '/blog', element: <Blog /> },
        { path: '/blog/:slug', element: <BlogPost /> },
        { path: '/faq', element: <FAQ /> },
        { path: '/features', element: <Features /> },
        { path: '/getting-started', element: <GettingStarted /> },
        { path: '/help', element: <Help /> },
        { path: '/how-it-works', element: <HowItWorks /> },
        { path: '/affiliate-terms', element: <AffiliateTerms /> },
        { path: '/privacy-policy', element: <PrivacyRefundPolicy /> },
        { path: '/termsAndCondition', element: <TermsAndConditions /> },
        { path: '/disclaimer', element: <DisclaimerPage /> },
      ],
    },
    {
      path: '/package/:id',
      element: (
        <div>
          <LogoNavbar />
          <PackageDetails />
        </div>
      ),
    },
    {
      path: '/affiliate',
      element: <AffiliateDashboardLayout />,
      children: [
        { index: true, element: <EarningsDashboard /> },
        { path: 'request', element: <AffiliateRequest /> },
        { path: 'courses/:courseId', element: <CoursePlayer /> },
        { path: 'earning', element: <EarningsDashboard /> },
        {
          path: 'courses',
          element: <CoursesDashboard dashboardType="affiliate" />,
        },
        { path: 'srk-bonus-flow', element: <SrkBonusFlow /> },
        { path: 'bank', element: <SrkBankPage /> },
        { path: 'courses/:courseTitle/:courseId', element: <CoursePlayer /> },
        { path: 'payout', element: <PayoutsPage /> },
        { path: 'KYC', element: <BankAndKYC /> },
        { path: 'referral', element: <ReferralPage /> },
        { path: 'leaderboard', element: <Leaderboard /> },
        { path: 'edit-profile', element: <EditProfileTabs /> },
        // { path: "invoice", element: <Invoice /> },
        { path: 'teams', element: <TeamsPage /> },
        { path: 'invoice', element: <Invoice /> },
        { path: 'create-users', element: <AddUsers /> },
        { path: 'webinar', element: <WebinarPage /> },
        { path: 'target', element: <TourTargetsPage /> },
      ],
    },
    {
      path: '/study',
      element: <StudyDashboardLayout />,
      children: [
        { index: true, element: <CoursesDashboard dashboardType="study" /> },
        {
          path: 'courses',
          element: <CoursesDashboard dashboardType="study" />,
        },
        { path: 'courses/:courseId', element: <CoursePlayer /> },
        { path: 'edit-profile', element: <EditProfileTabs /> },
        { path: 'invoice', element: <Invoice /> },
        {
          path: 'affiliate-activation',
          element: <AffiliateRequestVerification />,
        },
        { path: 'request', element: <AffiliateRequest /> },
        {
          path: 'affiliate-landing',
          element: <AffilatePage viewMode={true} />,
        },
      ],
    },
    {
      path: '/srkgrowportal',
      element: <SRKGrowPortal />,
    },
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        { path: 'sign-up', element: <SignUp /> },
        { path: 'login', element: <Login /> },
        { path: 'forgot-password', element: <ForgotPassword /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'kyc-verification', element: <PortalActivationPage /> },
        {
          path: 'payment-verification',
          element: <PaymentVerificationAuthPage />,
        },
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminEarningDashboard /> },
        { path: 'courses/create', element: <CreateCoursePage /> },
        { path: 'courses', element: <CourseList /> },
        { path: 'courses/:id', element: <CourseDetail /> },
        { path: 'create-users', element: <AddUsers /> },
        { path: 'lists-of-users', element: <ListOfUsers /> },
        { path: 'affiliate-request', element: <AffilateRequestList /> },
        { path: 'bank-details-request', element: <BankRequest /> },
        { path: 'balance-payout', element: <BalancePayouts /> },
        { path: 'earning', element: <AdminEarningDashboard /> },
        { path: 'add-packages', element: <AddPackage /> },
        { path: 'srkBank', element: <AdminSrkBankPage /> },
        { path: 'payment-verification', element: <VerificatinPendingPage /> },
        { path: 'university-bank', element: <SrkUniversityBank /> },
        {
          path: 'webinar/create',
          element: <CreateWebinar />,
        },
        {
          path: 'webinar',
          element: <AdminWebinarList />,
        },
        {
          path: 'srk-bonus',
          element: <AdminSrkBonusFlow />,
        },
        {
          path: 'srk-bonus/:id',
          element: <SrkBonusFlowAdminUser />,
        },
        {
          path: 'target',
          element: <AdminTourTargetUserPage />,
        },
        {
          path: 'settings',
          element: <AdminSettings />,
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
