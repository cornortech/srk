import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import LoginModel from '../../components/user-components/auth/LoginModel';
import Navbar from '../../components/layout-components/Navbar';
import { Hero } from '../../components/user-components/landing-page/Hero';
import { FlowSection } from '../../components/user-components/landing-page/FlowSection';
import PackagesSection from '../../components/user-components/landing-page/PackageSelection';
import { BenefitsSection } from '../../components/user-components/landing-page/BenefitsSection';
import { FAQSection } from '../../components/user-components/landing-page/FAQSection';
import { CTASection } from '../../components/user-components/landing-page/CTASection';
import { Footer } from '../../components/layout-components/Footer';
import { PackageSelectionFlow } from '../../components/user-components/landing-page/PackageSelectionFlow';
import { OrderConfirmation } from '../../components/user-components/landing-page/OrderConfirmation';
import { UserDashboard } from '../user-dashboard/page';
import { OrderDetails, PackageDetails, UserData, UserDetails } from '../../lib/types/types';

type View =
  | 'landing'
  | 'packageflow'
  | 'checkout'
  | 'confirmation'
  | 'dashboard';

const GrowLandingPage: React.FC = () => {

  const [user, setUser] = useState<UserData | null>(null);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, _setAuthMode] = useState<'login' | 'register'>('login');

  const [view, setView] = useState<View>('landing');
  const [selectedPackage, setSelectedPackage] = useState<PackageDetails | null>(null);
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
    localStorage.setItem("srkgrow_loggedInUser", JSON.stringify(userData));
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

      <AnimatePresence>
        {showAuthModal && (
          <LoginModel
            initialMode={authMode}
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={handleLoginSuccess}
            hasRegistered={hasRegistered}
            onRegistrationComplete={() => setHasRegistered(true)}
          />
        )}
      </AnimatePresence>

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
            <OrderConfirmation orderDetails={orderDetails} onBack={handleBackToLanding} />
          )}

          {view === 'dashboard' && user && (
            <UserDashboard user={user} onLogout={handleLogout} />
          )}
        </AnimatePresence>
      </main>
    </>
  );
};

export default GrowLandingPage;
