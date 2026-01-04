import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  AnalyticsData,
  DashboardData,
  LeaderboardEntry,
  NavItem,
  Payout,
  SalesData,
  ToastType,
  ViewId,
} from '../lib/types/dashboard';
import { DARK_BG, GOLD_PRIMARY } from '../features/dashboard/constants';
import {
  MOCK_ANALYTICS_DATA,
  MOCK_DASHBOARD_DATA,
  MOCK_LEADERBOARD,
  MOCK_SALES_DATA,
  MOCK_USER_PROFILE,
} from '../data/dashboardMock';
import { DashboardView } from '../features/dashboard/views/DashboardView';
import { ReferralView } from '../features/dashboard/views/ReferralView';
import { MySalesView } from '../features/dashboard/views/MySalesView';
import { LeaderboardView } from '../features/dashboard/views/LeaderboardView';
import { PayoutView } from '../features/dashboard/views/PayoutView';
import { ProfileView } from '../features/dashboard/views/ProfileView';
import { BackgroundEffects } from '../features/dashboard/components/ui/BackgroundEffects';
import { MenuIcon } from '../features/dashboard/components/ui/DashboardIcons';
import { Toast } from '../features/dashboard/components/ui/Toast';
import { DashboardSidebar } from '../features/dashboard/components/DashboardSidebar';
import { api } from '../lib/api';
import { Navigate } from 'react-router-dom';

export const initialEarningData: DashboardData = {
  today: 0,
  week: 0,
  days28: 0,
  allTime: 0,
  wallet: 0,
  consistencyDays: 0,
};

export const GrowDashboard = () => {
  const affiliateUserId = localStorage.getItem('affiliateGrowUserId');

  if (!affiliateUserId) {
    return <Navigate to="/login" replace />;
  }

  const [currentView, setCurrentView] = useState<ViewId>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>('success');
  const [dashboardData, setDashboardData] =
    useState<DashboardData>(initialEarningData);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );

  const { data: growPackagesRes, isLoading: packagesLoading } =
    api.package.getAllSrkGrowPackages.useQuery(['packages']);

  const dataToSend = growPackagesRes?.body;

  console.log(growPackagesRes?.body);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success'): void => {
      setToastMessage(message);
      setToastType(type);
      setTimeout(() => setToastMessage(null), 3000);
    },
    []
  );

  const { data: affiliatedUserCommission, isLoading: commissionLoading } =
    api.growAffiliate.getUserAffiliateSalesComissionEarnings.useQuery(
      ['affiliatedUserCommission', affiliateUserId],
      {
        params: {
          affiliateUserId: affiliateUserId,
        },
      }
    );

  const handleNavigation = useCallback(
    (item: NavItem) => {
      if (item.external) {
        window.open('https://www.srkbank.example.com', '_blank');
        showToast('Redirecting to SRK Bank...', 'info');
      } else {
        setCurrentView(item.id);
        setIsSidebarOpen(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    // setIsLoading(true);
    const timer = setTimeout(() => {
      setDashboardData(MOCK_DASHBOARD_DATA);
      setSalesData(MOCK_SALES_DATA);
      setLeaderboardData(MOCK_LEADERBOARD);

      setAnalyticsData(MOCK_ANALYTICS_DATA);
      // setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const renderCurrentView = (): ReactNode => {
    if (packagesLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl min-h-[140px] animate-pulse"
              style={{
                background: 'rgba(20, 17, 14, 0.8)',
                border: '1px solid rgba(225, 186, 115, 0.1)',
              }}
            />
          ))}
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView userID={affiliateUserId} data={dashboardData} showToast={showToast} />;
      case 'analytics':
        return analyticsData ? (
          'null'
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl min-h-[140px] animate-pulse"
                style={{
                  background: 'rgba(20, 17, 14, 0.8)',
                  border: '1px solid rgba(225, 186, 115, 0.1)',
                }}
              />
            ))}
          </div>
        );
      case 'referral':
        return <ReferralView userID={affiliateUserId} data={dataToSend ?? []} showToast={showToast} />;
      case 'mysales':
        return (
          <MySalesView
            userID={affiliateUserId}
            data={affiliatedUserCommission?.body ?? []}
            isLoading={commissionLoading}
          />
        );
      case 'leaderboard':
        return <LeaderboardView userID={affiliateUserId} />;
      case 'payout':
        return <PayoutView userID={affiliateUserId} />;
      case 'profile':
        return (
          <ProfileView
            userID={affiliateUserId}
            data={affiliatedUserCommission?.body}
            showToast={showToast}
          />
        );
      default:
        return <DashboardView userID={affiliateUserId} data={dashboardData} showToast={showToast} />;
    }
  };

  return (
    <div
      className="min-h-screen text-white font-sans relative overflow-hidden"
      style={{ backgroundColor: DARK_BG }}
    >
      <BackgroundEffects />

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebars */}
      <DashboardSidebar
        userID={affiliateUserId}
        isMobile={false}
        currentView={currentView}
        isOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onNavigate={handleNavigation}
      />
      <DashboardSidebar
        userID={affiliateUserId}
        isMobile={true}
        currentView={currentView}
        isOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onNavigate={handleNavigation}
      />

      {/* Main Content */}
      <main className="transition-all duration-300 md:ml-64">
        <div className="p-4 sm:p-6 relative z-10">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-800/50">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors backdrop-blur-sm"
              style={{
                background: 'rgba(20, 17, 14, 0.7)',
                border: '1px solid rgba(225, 186, 115, 0.15)',
              }}
            >
              <MenuIcon className="w-6 h-6 text-gray-400" />
            </button>
            <h2 className="text-lg font-bold text-white uppercase">
              {currentView}
            </h2>
            <div className="w-6" />
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white uppercase">
              {currentView}
            </h2>
            {packagesLoading && (
              <div
                className="flex items-center space-x-2 text-sm"
                style={{ color: GOLD_PRIMARY }}
              >
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                <span>Loading...</span>
              </div>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-160px)] pr-2">
            {renderCurrentView()}
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
};
