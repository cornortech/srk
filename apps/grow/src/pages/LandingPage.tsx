import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { Hero } from '../features/landing/components/Hero';
import { FlowSection } from '../features/landing/components/FlowSection';
import PackagesSection from '../features/landing/components/PackageSelection';
import { BenefitsSection } from '../features/landing/components/BenefitsSection';
import { FAQSection } from '../features/landing/components/FAQSection';
import { CTASection } from '../features/landing/components/CTASection';
import { Footer } from '../components/layout/Footer';
import { PackageSelectionFlow } from '../features/landing/components/PackageSelectionFlow';
import { OrderConfirmation } from '../features/landing/components/OrderConfirmation';
import {
  OrderDetails,
  PackageDetails,
  UserData,
  UserDetails,
} from '../lib/types/types';
import { UserDashboard } from './UserDashboard';

type View =
  | 'landing'
  | 'packageflow'
  | 'checkout'
  | 'confirmation'
  | 'dashboard';

export const GrowLandingPage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [view, setView] = useState<View>('landing');

  const [hasRegistered, setHasRegistered] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, _setAuthMode] = useState<'login' | 'register'>('login');

  const [selectedPackage, setSelectedPackage] = useState<PackageDetails | null>(
    null
  );
  const [checkoutUser, setCheckoutUser] = useState<UserDetails | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  console.log(checkoutUser);

  useEffect(() => {
    const registered = !!localStorage.getItem('srkgrow-hasregistered');
    setHasRegistered(registered);

    const savedUser = localStorage.getItem('srkgrow-activesession');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const handleUserUpdate = (userData: UserData | null) => {
    setUser(userData);
    localStorage.setItem('srkgrow_loggedInUser', JSON.stringify(userData));
  };

  const handleLoginSuccess = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('srkgrow-activesession', JSON.stringify(userData));
    setHasRegistered(true);
    setView('dashboard');
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('srkgrow-activesession');
    setView('landing');
  };

  const handlePackageSelect = (pkg: PackageDetails) => {
    setSelectedPackage(pkg);
    setView('packageflow');
    window.scrollTo(0, 0);
  };

  const handlePackageFlowComplete = (details: UserDetails) => {
    setCheckoutUser(details);
    setView('checkout');
    window.scrollTo(0, 0);
  };

  const handleBackToLanding = () => {
    setView('landing');
    setSelectedPackage(null);
    setCheckoutUser(null);
    setOrderDetails(null);
  };

  return (
    <>
      <Navbar
        user={user}
        onUserUpdate={handleUserUpdate}
        onDashboardClick={() => setView('dashboard')}
      />

      <main>
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <>
              <Hero />
              <FlowSection />
              <PackagesSection onPackageSelect={handlePackageSelect} />
              <BenefitsSection />
              <FAQSection />
              <CTASection onPackageSelect={handlePackageSelect} />
              <Footer />
            </>
          )}

          {view === 'packageflow' && selectedPackage && (
            <PackageSelectionFlow
              selectedPackage={selectedPackage}
              onBack={handleBackToLanding}
              onComplete={handlePackageFlowComplete}
            />
          )}

          {view === 'confirmation' && orderDetails && (
            <OrderConfirmation
              orderDetails={orderDetails}
              onBack={handleBackToLanding}
            />
          )}

          {view === 'dashboard' && user && (
            <UserDashboard user={user} onLogout={handleLogout} />
          )}
        </AnimatePresence>
      </main>
    </>
  );
};
