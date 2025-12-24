import { useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import { Hero } from '../features/landing/components/Hero';
import { FlowSection } from '../features/landing/components/FlowSection';
import PackagesSection from '../features/landing/components/PackageSelection';
import { BenefitsSection } from '../features/landing/components/BenefitsSection';
import { FAQSection } from '../features/landing/components/FAQSection';
import { CTASection } from '../features/landing/components/CTASection';
import { Footer } from '../components/layout/Footer';
import { PackageDetails } from '../lib/types/types';
import { useNavigate } from 'react-router-dom';
import { useScrollIntent } from '../features/landing/hooks/useScrollIntent';

export const GrowLandingPage = () => {
  const navigate = useNavigate();
  const packagesRef = useRef<HTMLElement>(null);

  const sectionRefs = {
    packages: packagesRef,
  };

  useScrollIntent(sectionRefs);

  const handlePackageSelect = (pkg: PackageDetails) => {
    navigate('/package-flow', { state: { package: pkg } });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navbar />

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
