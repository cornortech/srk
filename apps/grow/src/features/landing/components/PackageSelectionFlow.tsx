import React, { useState } from 'react';
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
  const [selectedTypeIndex, setSelectedTypeIndex] = useState<number>(0);
  const [selectedSubTypeIndex, setSelectedSubTypeIndex] = useState<number>(0);
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
    packageId: selectedPackage._id,
    postLinks: ['', '', '', ''],
    additionalInfo: '',
    kyc: [''],
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

  const handleOptionSelect = (typeIndex: number, subTypeIndex: number) => {
    setSelectedTypeIndex(typeIndex);
    setSelectedSubTypeIndex(subTypeIndex);
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
    const finalDetails: CheckoutUserDetails = {
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
      password: userDetails.password,
      confirmPassword: userDetails.confirmPassword,
      country: userDetails.country,
      gender: userDetails.gender,
      platform: selectedPlatform!,
      engagementType: engagementType!,
      selectedOption: selectedSubTypeIndex,
      packageId: selectedPackage._id,
      socialLink:
        userDetails.socialLink || `https://${selectedPlatform}.com/your-profile`,
      additionalInfo: userDetails.additionalInfo,
      postLinks: userDetails.postLinks,
      promoCode: userDetails.promoCode,
      kyc: userDetails.kyc,
    };

    setShowPaymentModal(false);
    // Close the payment flow and go back to landing
    onBack();
  };

  const getSelectedOptionDetails = () => {
    const packageType = selectedPackage.packageTypes[selectedTypeIndex];
    if (!packageType || !packageType.packageSubTypes) {
      return { description: 'Select an option' };
    }

    const subType = packageType.packageSubTypes[selectedSubTypeIndex];
    if (!subType) {
      return { description: 'Select an option' };
    }

    if (engagementType === 'follow') {
      return {
        followers: subType.noOfFollowers || 0,
        description: `${subType.noOfFollowers || 0} followers/subscribers`,
      };
    } else {
      return {
        videos: subType.noOfVideos || 0,
        likesPerVideo: subType.noOfLikes || 0,
        totalLikes: (subType.noOfVideos || 0) * (subType.noOfLikes || 0),
        description: `${subType.noOfVideos || 0} video${
          (subType.noOfVideos || 0) > 1 ? 's' : ''
        } with ${subType.noOfLikes || 0} likes each (Total: ${
          (subType.noOfVideos || 0) * (subType.noOfLikes || 0)
        } likes)`,
      };
    }
  };

  const optionDetails = getSelectedOptionDetails();

  const showMultiplePostLinks =
    engagementType === 'reach' &&
    (selectedPackage.packageTypes[selectedTypeIndex]?.packageSubTypes[
      selectedSubTypeIndex
    ]?.noOfVideos || 0) > 1;

  const numPostLinks =
    engagementType === 'reach'
      ? selectedPackage.packageTypes[selectedTypeIndex]?.packageSubTypes[
          selectedSubTypeIndex
        ]?.noOfVideos || 0
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
            <span className="text-[#b68938]">{selectedPackage.amount}</span>
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
              selectedTypeIndex={selectedTypeIndex}
              selectedSubTypeIndex={selectedSubTypeIndex}
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
        packagePrice={String(selectedPackage.amount)}
        packageName={selectedPackage.name}
      />
    </div>
  );
};
