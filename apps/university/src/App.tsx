import './App.css';
import { lazy, Suspense } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/Home';

// Eagerly load layouts (small, needed for all routes)
import LayoutWithNavbar from './Layouts/NavbarLayout';
import AuthLayout from './Layouts/AuthLayout';
import AffiliateDashboardLayout from './Layouts/AffiliateLayout';
import AdminLayout from './Layouts/AdminLayout';
import StudyDashboardLayout from './Layouts/StudyLayout';
import { LogoNavbar } from './components/logoNavbar';

// Lazy load all non-home pages to reduce initial bundle
const SignUp = lazy(() => import('./pages/SignUp').then(m => ({ default: m.SignUp })));
const PackagePage = lazy(() => import('./pages/Package').then(m => ({ default: m.PackagePage })));
const CourseDetails = lazy(() => import('./pages/DetailsPage').then(m => ({ default: m.CourseDetails })));
const AboutPage = lazy(() => import('./pages/About'));
const ContactPage = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const EarningsDashboard = lazy(() => import('./pages/dashboard/Earning'));
const CoursesDashboard = lazy(() => import('./components/dashboard/courses/CoursesDashboard'));
const Leaderboard = lazy(() => import('./pages/dashboard/LearderBoard'));
const EditProfileTabs = lazy(() => import('./pages/dashboard/EditProfile'));
const BankAndKYC = lazy(() => import('./pages/dashboard/Bank&&KYC').then(m => ({ default: m.BankAndKYC })));
const CoursePlayer = lazy(() => import('./components/dashboard/courses/CoursesPlayer'));
const ReferralPage = lazy(() => import('./components/dashboard/referral/ReferralPage'));
const CreateCoursePage = lazy(() => import('./pages/admin/CreateCourse'));
const CourseList = lazy(() => import('./pages/admin/Courses'));
const CourseDetail = lazy(() => import('./pages/admin/CoursesDetails'));
const Invoice = lazy(() => import('./pages/dashboard/Invoice').then(m => ({ default: m.Invoice })));
const PayoutsPage = lazy(() => import('./pages/dashboard/Payout'));
const AddUsers = lazy(() => import('./pages/admin/AddUsers').then(m => ({ default: m.AddUsers })));
const ListOfUsers = lazy(() => import('./pages/admin/ListOfUers').then(m => ({ default: m.ListOfUsers })));
const PackageDetails = lazy(() => import('./components/PackageDetails').then(m => ({ default: m.PackageDetails })));
const AffiliateRequest = lazy(() => import('./pages/affiliate/AffiliateRequest'));
const AffilateRequestList = lazy(() => import('./pages/admin/AffiliateRequestList').then(m => ({ default: m.AffilateRequestList })));
const AffilatePage = lazy(() => import('./pages/affiliate/AffilatePage').then(m => ({ default: m.AffilatePage })));
const AddPackage = lazy(() => import('./pages/admin/AddPackage').then(m => ({ default: m.AddPackage })));
const BalancePayouts = lazy(() => import('./pages/admin/BalancePayout'));
const AdminEarningDashboard = lazy(() => import('./pages/admin/Earning'));
const SrkBankPage = lazy(() => import('./pages/affiliate/SRKBank'));
const PortalActivationPage = lazy(() => import('./pages/dashboard/PortalActivation'));
const AffiliateRequestVerification = lazy(() => import('./pages/dashboard/AffiliateRequestVerification'));
const AdminSrkBankPage = lazy(() => import('./pages/admin/AdminSrkBankPage'));
const SrkUniversityBank = lazy(() => import('./pages/admin/UniversityBank'));
const TeamsPage = lazy(() => import('./pages/affiliate/Teams'));
const AffiliateTerms = lazy(() => import('./pages/affiliate/AffiliateTermsAndConditions'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndCondition'));
const PrivacyRefundPolicy = lazy(() => import('./pages/Privacy'));
const BankRequest = lazy(() => import('./pages/admin/ BankRequest'));
const VerificatinPendingPage = lazy(() => import('./pages/admin/PaymentVerification').then(m => ({ default: m.VerificatinPendingPage })));
const PaymentVerificationAuthPage = lazy(() => import('./pages/auth/PaymentVerification'));
const PackageSinglePage = lazy(() => import('./pages/PackageDetails'));
const DisclaimerPage = lazy(() => import('./pages/Disclaimer'));
const CreateWebinar = lazy(() => import('./pages/admin/CreateWebinar'));
const AdminWebinarList = lazy(() => import('./components/admin/webinar/WebinarListTable/WebinarListTable'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const WebinarPage = lazy(() => import('./pages/affiliate/WebinarPage'));
const SrkBonusFlow = lazy(() => import('./pages/affiliate/SrkBonusFlow'));
const AdminSrkBonusFlow = lazy(() => import('./pages/admin/SrkBonusFlow'));
const SrkBonusFlowAdminUser = lazy(() => import('./pages/admin/SrkBonusFlowAdminUser'));
const TourTargetsPage = lazy(() => import('./pages/affiliate/TourTarget'));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogPost = lazy(() => import('./pages/BlogPost').then(m => ({ default: m.BlogPost })));
const FAQ = lazy(() => import('./pages/FAQ'));
const Features = lazy(() => import('./pages/Features'));
const GettingStarted = lazy(() => import('./pages/GettingStarted'));
const Help = lazy(() => import('./pages/Help'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const PaymentGateway = lazy(() => import('./pages/PaymentGateway'));
const AdminTourTargetUserPage = lazy(() => import('./pages/admin/TourTargetUserPage'));
const SRKGrowPortal = lazy(() => import('./pages/dashboard/GrowViewPage'));
const WhoIsItForPage = lazy(() => import('./pages/learn/WhoIsItFor'));
const WhySRKUniversityPage = lazy(() => import('./pages/learn/WhySRKUniversity'));
const CourseTracksPage = lazy(() => import('./pages/learn/CourseTracks'));
const SeizeYourMomentPage = lazy(() => import('./pages/learn/SeizeYourMoment'));
const MilestoneJourneyPage = lazy(() => import('./pages/learn/MilestoneJourney'));
const AllReviewsPage = lazy(() => import('./pages/learn/AllReviews'));
const WhyEnrollPage = lazy(() => import('./pages/learn/WhyEnroll'));
const UncoverEssentialsPage = lazy(() => import('./pages/learn/UncoverEssentials'));
const ExclusiveCommunityPage = lazy(() => import('./pages/learn/ExclusiveCommunity'));
const LearnFromExpertsPage = lazy(() => import('./pages/learn/LearnFromExperts'));
const StructuredLearningPage = lazy(() => import('./pages/learn/StructuredLearning'));
const LiveMentorshipPage = lazy(() => import('./pages/learn/LiveMentorship'));
const AchieverCommunityPage = lazy(() => import('./pages/learn/AchieverCommunity'));
const UpcomingSkillsPage = lazy(() => import('./pages/learn/UpcomingSkills'));
const ChooseYourPlanPage = lazy(() => import('./pages/learn/ChooseYourPlan'));
const ArticlesPage = lazy(() => import('./pages/Articles'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-bgPrimary">
    <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: '',
      element: <LayoutWithNavbar />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/packages', element: <Suspense fallback={<PageLoader />}><PackagePage /></Suspense> },
        { path: '/packages/:id', element: <Suspense fallback={<PageLoader />}><PackageSinglePage /></Suspense> },
        { path: '/webcam', element: <Suspense fallback={<PageLoader />}><PortalActivationPage /></Suspense> },
        {
          path: '/affiliate-landing',
          element: <Suspense fallback={<PageLoader />}><AffilatePage viewMode={false} /></Suspense>,
        },
        { path: '/course/:courseId', element: <Suspense fallback={<PageLoader />}><CourseDetails /></Suspense> },
        { path: '/about', element: <Suspense fallback={<PageLoader />}><AboutPage /></Suspense> },
        { path: '/contact', element: <Suspense fallback={<PageLoader />}><ContactPage /></Suspense> },
        { path: '/payment-gateway', element: <Suspense fallback={<PageLoader />}><PaymentGateway /></Suspense> },
        { path: '/blog', element: <Suspense fallback={<PageLoader />}><Blog /></Suspense> },
        { path: '/blog/:slug', element: <Suspense fallback={<PageLoader />}><BlogPost /></Suspense> },
        { path: '/faq', element: <Suspense fallback={<PageLoader />}><FAQ /></Suspense> },
        { path: '/features', element: <Suspense fallback={<PageLoader />}><Features /></Suspense> },
        { path: '/getting-started', element: <Suspense fallback={<PageLoader />}><GettingStarted /></Suspense> },
        { path: '/help', element: <Suspense fallback={<PageLoader />}><Help /></Suspense> },
        { path: '/how-it-works', element: <Suspense fallback={<PageLoader />}><HowItWorks /></Suspense> },
        { path: '/affiliate-terms', element: <Suspense fallback={<PageLoader />}><AffiliateTerms /></Suspense> },
        { path: '/privacy-policy', element: <Suspense fallback={<PageLoader />}><PrivacyRefundPolicy /></Suspense> },
        { path: '/termsAndCondition', element: <Suspense fallback={<PageLoader />}><TermsAndConditions /></Suspense> },
        { path: '/disclaimer', element: <Suspense fallback={<PageLoader />}><DisclaimerPage /></Suspense> },
        { path: '/learn/who-is-it-for', element: <Suspense fallback={<PageLoader />}><WhoIsItForPage /></Suspense> },
        { path: '/learn/why-srk-university', element: <Suspense fallback={<PageLoader />}><WhySRKUniversityPage /></Suspense> },
        { path: '/learn/course-tracks', element: <Suspense fallback={<PageLoader />}><CourseTracksPage /></Suspense> },
        { path: '/learn/seize-your-moment', element: <Suspense fallback={<PageLoader />}><SeizeYourMomentPage /></Suspense> },
        { path: '/learn/milestone-journey', element: <Suspense fallback={<PageLoader />}><MilestoneJourneyPage /></Suspense> },
        { path: '/learn/all-reviews', element: <Suspense fallback={<PageLoader />}><AllReviewsPage /></Suspense> },
        { path: '/learn/why-enroll', element: <Suspense fallback={<PageLoader />}><WhyEnrollPage /></Suspense> },
        { path: '/learn/uncover-essentials', element: <Suspense fallback={<PageLoader />}><UncoverEssentialsPage /></Suspense> },
        { path: '/learn/exclusive-community', element: <Suspense fallback={<PageLoader />}><ExclusiveCommunityPage /></Suspense> },
        { path: '/learn/learn-from-experts', element: <Suspense fallback={<PageLoader />}><LearnFromExpertsPage /></Suspense> },
        { path: '/learn/structured-learning', element: <Suspense fallback={<PageLoader />}><StructuredLearningPage /></Suspense> },
        { path: '/learn/live-mentorship', element: <Suspense fallback={<PageLoader />}><LiveMentorshipPage /></Suspense> },
        { path: '/learn/achiever-community', element: <Suspense fallback={<PageLoader />}><AchieverCommunityPage /></Suspense> },
        { path: '/learn/upcoming-skills', element: <Suspense fallback={<PageLoader />}><UpcomingSkillsPage /></Suspense> },
        { path: '/learn/choose-your-plan', element: <Suspense fallback={<PageLoader />}><ChooseYourPlanPage /></Suspense> },
        { path: '/articles', element: <Suspense fallback={<PageLoader />}><ArticlesPage /></Suspense> },
        { path: '/articles/:slug', element: <Suspense fallback={<PageLoader />}><ArticlePage /></Suspense> },
      ],
    },
    {
      path: '/package/:id',
      element: (
        <div>
          <LogoNavbar />
          <Suspense fallback={<PageLoader />}><PackageDetails /></Suspense>
        </div>
      ),
    },
    {
      path: '/affiliate',
      element: <AffiliateDashboardLayout />,
      children: [
        { index: true, element: <Suspense fallback={<PageLoader />}><EarningsDashboard /></Suspense> },
        { path: 'request', element: <Suspense fallback={<PageLoader />}><AffiliateRequest /></Suspense> },
        { path: 'courses/:courseId', element: <Suspense fallback={<PageLoader />}><CoursePlayer /></Suspense> },
        { path: 'earning', element: <Suspense fallback={<PageLoader />}><EarningsDashboard /></Suspense> },
        {
          path: 'courses',
          element: <Suspense fallback={<PageLoader />}><CoursesDashboard dashboardType="affiliate" /></Suspense>,
        },
        { path: 'srk-bonus-flow', element: <Suspense fallback={<PageLoader />}><SrkBonusFlow /></Suspense> },
        { path: 'bank', element: <Suspense fallback={<PageLoader />}><SrkBankPage /></Suspense> },
        { path: 'courses/:courseTitle/:courseId', element: <Suspense fallback={<PageLoader />}><CoursePlayer /></Suspense> },
        { path: 'payout', element: <Suspense fallback={<PageLoader />}><PayoutsPage /></Suspense> },
        { path: 'KYC', element: <Suspense fallback={<PageLoader />}><BankAndKYC /></Suspense> },
        { path: 'referral', element: <Suspense fallback={<PageLoader />}><ReferralPage /></Suspense> },
        { path: 'leaderboard', element: <Suspense fallback={<PageLoader />}><Leaderboard /></Suspense> },
        { path: 'edit-profile', element: <Suspense fallback={<PageLoader />}><EditProfileTabs /></Suspense> },
        { path: 'teams', element: <Suspense fallback={<PageLoader />}><TeamsPage /></Suspense> },
        { path: 'invoice', element: <Suspense fallback={<PageLoader />}><Invoice /></Suspense> },
        { path: 'create-users', element: <Suspense fallback={<PageLoader />}><AddUsers /></Suspense> },
        { path: 'webinar', element: <Suspense fallback={<PageLoader />}><WebinarPage /></Suspense> },
        { path: 'target', element: <Suspense fallback={<PageLoader />}><TourTargetsPage /></Suspense> },
      ],
    },
    {
      path: '/study',
      element: <StudyDashboardLayout />,
      children: [
        { index: true, element: <Suspense fallback={<PageLoader />}><CoursesDashboard dashboardType="study" /></Suspense> },
        {
          path: 'courses',
          element: <Suspense fallback={<PageLoader />}><CoursesDashboard dashboardType="study" /></Suspense>,
        },
        { path: 'courses/:courseId', element: <Suspense fallback={<PageLoader />}><CoursePlayer /></Suspense> },
        { path: 'edit-profile', element: <Suspense fallback={<PageLoader />}><EditProfileTabs /></Suspense> },
        { path: 'invoice', element: <Suspense fallback={<PageLoader />}><Invoice /></Suspense> },
        {
          path: 'affiliate-activation',
          element: <Suspense fallback={<PageLoader />}><AffiliateRequestVerification /></Suspense>,
        },
        { path: 'request', element: <Suspense fallback={<PageLoader />}><AffiliateRequest /></Suspense> },
        {
          path: 'affiliate-landing',
          element: <Suspense fallback={<PageLoader />}><AffilatePage viewMode={true} /></Suspense>,
        },
      ],
    },
    {
      path: '/srkgrowportal',
      element: <Suspense fallback={<PageLoader />}><SRKGrowPortal /></Suspense>,
    },
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        { path: 'sign-up', element: <Suspense fallback={<PageLoader />}><SignUp /></Suspense> },
        { path: 'login', element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
        { path: 'forgot-password', element: <Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense> },
        { path: 'reset-password', element: <Suspense fallback={<PageLoader />}><ResetPassword /></Suspense> },
        { path: 'kyc-verification', element: <Suspense fallback={<PageLoader />}><PortalActivationPage /></Suspense> },
        {
          path: 'payment-verification',
          element: <Suspense fallback={<PageLoader />}><PaymentVerificationAuthPage /></Suspense>,
        },
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { index: true, element: <Suspense fallback={<PageLoader />}><AdminEarningDashboard /></Suspense> },
        { path: 'courses/create', element: <Suspense fallback={<PageLoader />}><CreateCoursePage /></Suspense> },
        { path: 'courses', element: <Suspense fallback={<PageLoader />}><CourseList /></Suspense> },
        { path: 'courses/:id', element: <Suspense fallback={<PageLoader />}><CourseDetail /></Suspense> },
        { path: 'create-users', element: <Suspense fallback={<PageLoader />}><AddUsers /></Suspense> },
        { path: 'lists-of-users', element: <Suspense fallback={<PageLoader />}><ListOfUsers /></Suspense> },
        { path: 'affiliate-request', element: <Suspense fallback={<PageLoader />}><AffilateRequestList /></Suspense> },
        { path: 'bank-details-request', element: <Suspense fallback={<PageLoader />}><BankRequest /></Suspense> },
        { path: 'balance-payout', element: <Suspense fallback={<PageLoader />}><BalancePayouts /></Suspense> },
        { path: 'earning', element: <Suspense fallback={<PageLoader />}><AdminEarningDashboard /></Suspense> },
        { path: 'add-packages', element: <Suspense fallback={<PageLoader />}><AddPackage /></Suspense> },
        { path: 'srkBank', element: <Suspense fallback={<PageLoader />}><AdminSrkBankPage /></Suspense> },
        { path: 'payment-verification', element: <Suspense fallback={<PageLoader />}><VerificatinPendingPage /></Suspense> },
        { path: 'university-bank', element: <Suspense fallback={<PageLoader />}><SrkUniversityBank /></Suspense> },
        {
          path: 'webinar/create',
          element: <Suspense fallback={<PageLoader />}><CreateWebinar /></Suspense>,
        },
        {
          path: 'webinar',
          element: <Suspense fallback={<PageLoader />}><AdminWebinarList /></Suspense>,
        },
        {
          path: 'srk-bonus',
          element: <Suspense fallback={<PageLoader />}><AdminSrkBonusFlow /></Suspense>,
        },
        {
          path: 'srk-bonus/:id',
          element: <Suspense fallback={<PageLoader />}><SrkBonusFlowAdminUser /></Suspense>,
        },
        {
          path: 'target',
          element: <Suspense fallback={<PageLoader />}><AdminTourTargetUserPage /></Suspense>,
        },
        {
          path: 'settings',
          element: <Suspense fallback={<PageLoader />}><AdminSettings /></Suspense>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}

export default App;
