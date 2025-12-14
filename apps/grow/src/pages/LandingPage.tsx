import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Hero } from '../features/landing/components/Hero';
import { FlowSection } from '../features/landing/components/FlowSection';
import PackagesSection from '../features/landing/components/PackageSelection';
import { BenefitsSection } from '../features/landing/components/BenefitsSection';
import { FAQSection } from '../features/landing/components/FAQSection';
import { CTASection } from '../features/landing/components/CTASection';
import { Footer } from '../components/layout/Footer';
import { PackageDetails, UserData } from '../lib/types/types';

export const GrowLandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);

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
        <PackagesSection onPackageSelect={handlePackageSelect} />
        <BenefitsSection />
        <FAQSection />
        <CTASection onPackageSelect={handlePackageSelect} />
        <Footer />
      </main>
    </>
  );
};
