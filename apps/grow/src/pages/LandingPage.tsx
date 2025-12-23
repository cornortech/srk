import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import { Hero } from '../features/landing/components/Hero';
import { FlowSection } from '../features/landing/components/FlowSection';
import PackagesSection from '../features/landing/components/PackageSelection';
import { BenefitsSection } from '../features/landing/components/BenefitsSection';
import { FAQSection } from '../features/landing/components/FAQSection';
import { CTASection } from '../features/landing/components/CTASection';
import { Footer } from '../components/layout/Footer';
import { PackageDetails, UserData } from '../lib/types/types';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

type View =
  | 'landing'
  | 'packageflow'
  | 'checkout'
  | 'confirmation'
  | 'dashboard';

export const GrowLandingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<UserData | null>(null);
  const packagesRef = useRef<HTMLElement>(null);

  // 1. Capture Referral Data
  useEffect(() => {
    const ref = searchParams.get('ref');
    const pkgId = searchParams.get('package');

    if (ref && pkgId) {
      // NOTE: You need to find the full package object to pass it to the flow
      // If you have your MOCK_PACKAGES or API data here:
      // const targetPkg = ALL_PACKAGES.find(p => p.id === pkgId);
      
      // For now, we redirect them to the flow route with the ref code in state
      navigate('/package-flow', { 
        state: { 
          packageId: pkgId, // The ID from URL
          referralCode: ref   // The 'ref' from URL
        } 
      });
    }
  }, [searchParams, navigate]);

  // Existing auth check
  useEffect(() => {
    const savedUser = localStorage.getItem('srkgrow-activesession');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      navigate('/dashboard');
    }
  }, [navigate]);

  const handlePackageSelect = (pkg: PackageDetails) => {
    // Normal selection from landing page (no referral code)
    navigate('/package-flow', { state: { package: pkg } });
    window.scrollTo(0, 0);
  };

  // ... rest of your component ...
  const handleUserUpdate = (userData: UserData | null) => {
    setUser(userData);
    localStorage.setItem('srkgrow_loggedInUser', JSON.stringify(userData));
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
