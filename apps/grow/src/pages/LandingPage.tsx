import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import { Hero } from '../features/landing/components/Hero';
import { FlowSection } from '../features/landing/components/FlowSection';
import PackagesSection from '../features/landing/components/PackageSelection';
import { BenefitsSection } from '../features/landing/components/BenefitsSection';
import { FAQSection } from '../features/landing/components/FAQSection';
import { CTASection } from '../features/landing/components/CTASection';
import { Footer } from '../components/layout/Footer';
import {
  OrderDetails,
  PackageDetails,
  UserData,
  UserDetails,
} from '../lib/types/types';
import { useNavigate, useParams } from 'react-router-dom';
import { useScrollIntent } from '../features/landing/hooks/useScrollIntent';

type View =
  | 'landing'
  | 'packageflow'
  | 'checkout'
  | 'confirmation'
  | 'dashboard';

export const GrowLandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [view, setView] = useState<View>('landing');
  const { section } = useParams();
  const packagesRef = useRef<HTMLElement>(null);

  const sectionRefs = {
    packages: packagesRef,
  };

  useScrollIntent(sectionRefs);

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
    const savedUser = localStorage.getItem('srkgrow-activesession');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleUserUpdate = (userData: UserData | null) => {
    setUser(userData);
    localStorage.setItem('srkgrow_loggedInUser', JSON.stringify(userData));
  };

  const handlePackageSelect = (pkg: PackageDetails) => {
    navigate('/package-flow', { state: { package: pkg } });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navbar
        user={user}
        onUserUpdate={handleUserUpdate}
        onDashboardClick={() => navigate('/dashboard')}
      />

      <main>
        <Hero />
        <FlowSection />
        <PackagesSection
          ref={packagesRef}
          onPackageSelect={handlePackageSelect}
        />
        <BenefitsSection />
        <FAQSection />
        <CTASection onPackageSelect={handlePackageSelect} />
        <Footer />
      </main>
    </>
  );
};
