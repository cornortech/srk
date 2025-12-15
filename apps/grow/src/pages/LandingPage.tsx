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
import { TSrkGrowPackagesSchema } from '@srk/shared/contracts';

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
  const [growPackages, setGrowPackages] = useState<TSrkGrowPackagesSchema[]>([]);

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

  // Helper function to convert API response to PackageDetails format
  const convertApiPackageToDetails = (pkg: TSrkGrowPackagesSchema): PackageDetails => {
    // Determine package type ID based on name
    let packageId: 'starter' | 'intermediate' | 'pro' = 'starter';
    const nameLower = pkg.name.toLowerCase();
    if (nameLower.includes('pro')) {
      packageId = 'pro';
    } else if (nameLower.includes('intermediate')) {
      packageId = 'intermediate';
    }

    // Extract follower and reach options from packageTypes and packageSubTypes
    const followerOptions: number[] = [];
    const reachOptions: Array<{ videos: number; likesPerVideo: number }> = [];

    pkg.packageTypes?.forEach((type) => {
      const typeName = type.name.toLowerCase();
      
      if (typeName.includes('follow')) {
        // Extract follower counts from package sub types
        type.packageSubTypes?.forEach((subType) => {
          if (subType.noOfFollowers) {
            followerOptions.push(subType.noOfFollowers);
          }
        });
      } else if (typeName.includes('reach')) {
        // Extract reach options (videos + likes)
        type.packageSubTypes?.forEach((subType) => {
          if (subType.noOfVideos && subType.noOfLikes) {
            reachOptions.push({
              videos: subType.noOfVideos,
              likesPerVideo: subType.noOfLikes,
            });
          }
        });
      }
    });

    // Fallback to defaults if extraction failed
    const finalFollowerOptions = followerOptions.length > 0 
      ? followerOptions 
      : [200, 500, 700]; // Default follower tiers
    
    const finalReachOptions = reachOptions.length > 0 
      ? reachOptions 
      : [
          { videos: 1, likesPerVideo: 200 },
          { videos: 2, likesPerVideo: 100 },
        ]; // Default reach options

    return {
      id: packageId,
      name: pkg.name,
      price: `${pkg.amount}`, // Assuming amount is already formatted
      description: pkg.description,
      features: pkg.packageTypes?.map(pt => pt.description).filter(Boolean) || [],
      followerOptions: finalFollowerOptions,
      reachOptions: finalReachOptions,
      period: 'one-time',
      popular: pkg.isPopular,
    };
  };

  const handlePackageSelect = (pkg: TSrkGrowPackagesSchema) => {
    const packageDetails = convertApiPackageToDetails(pkg);
    navigate('/package-flow', { state: { package: packageDetails } });
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
          onGrowPackagesLoaded={setGrowPackages}
        />
        <BenefitsSection />
        <FAQSection />
        <CTASection onPackageSelect={handlePackageSelect} growPackages={growPackages} />
        <Footer />
      </main>
    </>
  );
};
