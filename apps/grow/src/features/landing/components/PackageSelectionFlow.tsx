import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import {
  CheckoutUserDetails,
  EngagementType,
  PackageDetails,
  SocialPlatform,
  UserDetails,
} from '../../../lib/types/types';
import PaymentModel from '../../../lib/ui/PaymentModel';
import { StepProgress } from './package-flow/StepProgress';
import { CheckoutForm } from './package-flow/CheckoutForm';
import {
  EngagementStep,
  OptionStep,
  PlatformStep,
} from './package-flow/StepViews';

interface PackageSelectionFlowProps {
  selectedPackage: PackageDetails;
  onComplete: (userDetails: UserDetails) => void;
  onBack: () => void;
}

export const PackageSelectionFlow: React.FC<PackageSelectionFlowProps> = ({
  selectedPackage,
  onComplete,
  onBack,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform | null>(null);
  const [engagementType, setEngagementType] = useState<EngagementType | null>(
    null
  );
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userDetails, setUserDetails] = useState<CheckoutUserDetails>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    gender: '',
    promoCode: '',
    phone: '',
    socialLink: '',
    platform: 'youtube' as SocialPlatform,
    engagementType: 'follow' as EngagementType,
    selectedOption: 0,
    packageType: selectedPackage.id,
    postLinks: ['', '', '', ''],
    additionalInfo: '',
  });

  const socialPlatforms: SocialPlatform[] = [
    'youtube',
    'facebook',
    'instagram',
    'twitter',
    'tiktok',
  ];

  const handlePlatformSelect = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    setStep(2);
  };

  const handleEngagementSelect = (type: EngagementType) => {
    setEngagementType(type);
    setStep(3);
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setStep(4);
  };

  const handleUserDetailsChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostLinkChange = (index: number, value: string) => {
    setUserDetails((prev) => {
      const newPostLinks = [...(prev.postLinks || ['', '', '', ''])];
      newPostLinks[index] = value;
      return { ...prev, postLinks: newPostLinks };
    });
  };

  const handleSubmit = () => {
    if (
      !selectedPlatform ||
      !engagementType ||
      !userDetails.name ||
      !userDetails.email ||
      !userDetails.phone
    ) {
      alert('Please fill in all required fields');
      return;
    }

    // Open payment modal instead of completing immediately
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    let socialLinkValue = userDetails.socialLink;
    if (
      engagementType === 'reach' &&
      selectedPackage.reachOptions[selectedOption]?.videos > 1
    ) {
      const validLinks =
        userDetails.postLinks?.filter((link) => link.trim() !== '') || [];
      if (validLinks.length > 0) {
        socialLinkValue = validLinks.join(', ');
      }
    }

    const finalDetails: UserDetails = {
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
      platform: selectedPlatform!,
      engagementType: engagementType!,
      selectedOption,
      packageType: selectedPackage.id,
      socialLink:
        socialLinkValue || `https://${selectedPlatform}.com/your-profile`,
      additionalInfo: userDetails.additionalInfo,
      postLinks: userDetails.postLinks,
    };

    setShowPaymentModal(false);
    // Close the payment flow and go back to landing
    onBack();
  };

  const getSelectedOptionDetails = () => {
    if (engagementType === 'follow') {
      return {
        followers: selectedPackage.followerOptions[selectedOption],
        description: `${selectedPackage.followerOptions[selectedOption]} followers/subscribers`,
      };
    } else {
      const option = selectedPackage.reachOptions[selectedOption];
      return {
        videos: option.videos,
        likesPerVideo: option.likesPerVideo,
        totalLikes: option.videos * option.likesPerVideo,
        description: `${option.videos} video${
          option.videos > 1 ? 's' : ''
        } with ${option.likesPerVideo} likes each (Total: ${
          option.videos * option.likesPerVideo
        } likes)`,
      };
    }
  };

  const optionDetails = getSelectedOptionDetails();

  const showMultiplePostLinks =
    engagementType === 'reach' &&
    selectedPackage.reachOptions[selectedOption]?.videos > 1;

  const numPostLinks =
    engagementType === 'reach'
      ? selectedPackage.reachOptions[selectedOption]?.videos || 0
      : 0;

  return (
    <div className="min-h-screen z-[1000] bg-[#0a0705] text-white pt-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button & Header */}
        <div className="mb-8">
          <button
            onClick={
              step === 1 ? onBack : () => setStep((step - 1) as 1 | 2 | 3)
            }
            className="flex items-center space-x-2 text-gray-400 hover:text-[#b68938] transition-colors mb-6 group"
          >
            <ArrowLeft size={20} />
            <span className="font-bold text-sm uppercase tracking-widest">
              {step === 1 ? 'Back to Packages' : 'Back'}
            </span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {selectedPackage.name} Package -{' '}
            <span className="text-[#b68938]">{selectedPackage.price}</span>
          </h1>
        </div>

        {/* Step Progress */}
        <StepProgress step={step} />

        {/* Content */}
        <div className="space-y-8">
          {step === 1 && (
            <PlatformStep
              platforms={socialPlatforms}
              selected={selectedPlatform}
              onSelect={handlePlatformSelect}
            />
          )}

          {step === 2 && (
            <EngagementStep
              selected={engagementType}
              onSelect={handleEngagementSelect}
              packageData={selectedPackage}
            />
          )}

          {step === 3 && engagementType && (
            <OptionStep
              engagementType={engagementType}
              selectedOption={selectedOption}
              onSelect={handleOptionSelect}
              packageData={selectedPackage}
            />
          )}

          {step === 4 && selectedPlatform && engagementType && (
            <CheckoutForm
              selectedPackage={selectedPackage}
              selectedPlatform={selectedPlatform}
              engagementType={engagementType}
              optionDescription={optionDetails.description}
              userDetails={userDetails}
              handleUserDetailsChange={handleUserDetailsChange}
              handlePostLinkChange={handlePostLinkChange}
              handleSubmit={handleSubmit}
              handleBack={() => setStep(3)}
              showMultiplePostLinks={showMultiplePostLinks}
              numPostLinks={numPostLinks}
            />
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModel
        isOpen={showPaymentModal}
        onClose={handlePaymentComplete}
        userDetails={{
          ...userDetails,
          platform: selectedPlatform!,
          engagementType: engagementType!,
        }}
        packagePrice={selectedPackage.price}
        packageName={selectedPackage.name}
      />
    </div>
  );
};
