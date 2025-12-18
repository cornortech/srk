import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  CheckoutUserDetails,
  EngagementType,
  PackageDetails,
  SocialPlatform,
  UserDetails,
} from '../../../lib/types/types';
import PaymentModel from '../../../lib/ui/PaymentModel';
import { StepProgress } from './StepProgress';
import { CheckoutForm } from './CheckoutForm';
import { EngagementStep, OptionStep, PlatformStep } from './StepViews';
import { api } from '../../../lib/api';
import { useSRKFileUpload } from '@srk/shared/hooks';

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
    kyc: [],
  });

  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccessMessage, setPromoSuccessMessage] = useState<string | null>(
    null
  );
  const [discountDetails, setDiscountDetails] = useState<{
    originalAmount: number;
    discountPercentage: number;
    discountAmount: number;
    finalAmountAfterDiscount: number;
  } | null>(null);

  const [kycFiles, setKycFiles] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { uploadFile, isUploading: isUploadingKYC } = useSRKFileUpload('grow');
  const uploadedKycUrlsRef = useRef<string[]>([]);

  const validatePromo = api.grow.validateGrowUserPromoCode.useMutation({
    onSuccess: (data) => {
      console.log('data', data);
      if (data.status === 200) {
        setDiscountDetails(data.body.discountDetails);

        setPromoSuccessMessage(
          (data.body as any).message || 'Promo code applied!'
        );
        setPromoError(null);
      } else {
        // Handle error responses (400, 409, 500)
        setPromoError((data.body as any).message || 'Invalid promo code');
        setDiscountDetails(null);
        setPromoSuccessMessage(null);
      }
    },
    onError: (err) => {
      // Cast to any to safely access message from error response
      setPromoError(
        (err as any).body?.message || 'Failed to validate promo code'
      );
      setDiscountDetails(null);
      setPromoSuccessMessage(null);
    },
  });

  const createEnrollment =
    api.grow.createGrowSocialMediaEnrollement.useMutation({
      onSuccess: (data) => {
        // Handle success if needed, e.g. toast?
        // PaymentModel handles the success UI view
      },
      onError: (error) => {
        console.error('Enrollment failed', error);
        alert('Failed to create enrollment. Please try again.');
        throw error; // Re-throw to let PaymentModel know
      },
    });

  const handleValidatePromoCode = () => {
    if (!userDetails.promoCode) return;
    validatePromo.mutate({
      body: {
        promoCode: userDetails.promoCode,
        growSocialMediaPackageId: selectedPackage._id,
      },
    });
  };

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
    setUserDetails((prev: CheckoutUserDetails) => ({ ...prev, [name]: value }));
  };

  const handlePostLinkChange = (index: number, value: string) => {
    setUserDetails((prev: CheckoutUserDetails) => {
      const newPostLinks = [...(prev.postLinks || ['', '', '', ''])];
      newPostLinks[index] = value;
      return { ...prev, postLinks: newPostLinks };
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!userDetails.name) errors.name = 'Full Name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userDetails.email || !emailRegex.test(userDetails.email)) {
      errors.email = 'Valid Email Address is required';
    }

    if (!userDetails.phone || userDetails.phone.length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    }

    if (!userDetails.password || userDetails.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (userDetails.password !== userDetails.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!userDetails.country) errors.country = 'Country is required';
    if (!selectedPlatform) errors.platform = 'Platform is required';
    if (!engagementType) errors.engagementType = 'Engagement Type is required';

    if (kycFiles.length === 0) {
      errors.kyc = 'At least one KYC document is required';
    }

    if (showMultiplePostLinks) {
      (userDetails.postLinks || []).forEach((link, index) => {
        try {
          new URL(link);
        } catch {
          errors[`postLink_${index}`] =
            'Please enter a valid URL (e.g., https://example.com)';
        }
      });
      // Check count
      if (
        (userDetails.postLinks?.filter((l) => l).length || 0) < numPostLinks
      ) {
        errors.postLinks = `Please provide all ${numPostLinks} links`;
      }
    } else {
      // Single link
      const link = userDetails.socialLink || '';
      try {
        new URL(link);
      } catch {
        errors.socialLink = `Please enter a valid URL (e.g., https://${selectedPlatform}.com/profile)`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Force Validate Promo Code if present
    if (userDetails.promoCode) {
      try {
        const result = await validatePromo.mutateAsync({
          body: {
            promoCode: userDetails.promoCode,
            growSocialMediaPackageId: selectedPackage._id,
          },
        });

        if (result.status === 200) {
          setDiscountDetails(result.body.discountDetails);
          setPromoSuccessMessage(
            (result.body as any).message || 'Promo code applied!'
          );
          setPromoError(null);
        } else {
          const msg = (result.body as any).message || 'Invalid promo code';
          setPromoError(msg);
          // Optionally scroll to promo input
          return;
        }
      } catch (err) {
        console.error(err);
        const msg =
          (err as any).body?.message || 'Failed to validate promo code';
        setPromoError(msg);
        return;
      }
    }

    try {
      // Upload KYC files
      const uploadedUrls: string[] = [];
      if (kycFiles.length > 0) {
        // Upload sequentially or parallel
        for (const file of kycFiles) {
          const result = await uploadFile(file, 'image'); // banking on mostly images
          uploadedUrls.push(result.url);
        }
      }

      // Update state for persistence (if needed for re-renders)
      setUserDetails((prev) => ({ ...prev, kyc: uploadedUrls }));
      uploadedKycUrlsRef.current = uploadedUrls;

      // Open modal
      setShowPaymentModal(true);
    } catch (error) {
      console.error('File upload failed', error);
      alert('Failed to upload KYC documents. Please try again.');
    }
  };

  const handlePaymentSubmit = async (paymentData: {
    transactionId: string;
    paymentProofUrl: string;
    paymentMethod: string;
  }) => {
    try {
      const kycUrls =
        uploadedKycUrlsRef.current.length > 0
          ? uploadedKycUrlsRef.current
          : userDetails.kyc || [];

      const packageType = selectedPackage.packageTypes[selectedTypeIndex];
      const packageSubType =
        packageType?.packageSubTypes?.[selectedSubTypeIndex];

      if (!packageType || !packageSubType) {
        throw new Error('Invalid package option selected');
      }

      // Ensure valid profile link
      let profileLink = userDetails.socialLink || '';
      if (!profileLink) {
        // Fallback to a constructed URL to satisfy schema if user didn't provide one
        // Ideally this should be validated in the form step, but as a safeguard:
        profileLink = `https://${selectedPlatform}.com/user`;
      } else if (!profileLink.startsWith('http')) {
        profileLink = `https://${profileLink}`;
      }

      await createEnrollment.mutateAsync({
        body: {
          userData: {
            fullName: userDetails.name,
            email: userDetails.email,
            phoneNumber: userDetails.phone,
            country: userDetails.country,
            gender: (userDetails.gender.charAt(0).toUpperCase() +
              userDetails.gender.slice(1)) as 'Male' | 'Female' | 'Other',
            password: userDetails.password,
            kycURL: kycUrls,
            usedPromoCode: userDetails.promoCode || undefined,
          },
          enrollementData: {
            growSocialMediaPackageId: selectedPackage._id,
            growSocialMediaPackageTypeId: packageType._id || 'unknown',
            growSocialMediaPackageSubTypeId: packageSubType._id || 'unknown',
            profileLinkURL: profileLink,
          },
          paymentData: {
            paymentURL: paymentData.paymentProofUrl,
            transactionId: paymentData.transactionId,
            paymentMethod: paymentData.paymentMethod as
              | 'esewa'
              | 'khalti'
              | 'bankTransfer',
          },
        },
      });

      // We don't close modal immediately, let PaymentModel show success screen
    } catch (error) {
      console.error('Failed to create enrollment', error);
      throw error; // Propagate to PaymentModel to show error
    }
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
              onValidatePromoCode={handleValidatePromoCode}
              isValidatingPromo={validatePromo.isPending}
              promoError={promoError}
              promoSuccessMessage={promoSuccessMessage}
              discountDetails={discountDetails}
              kycFiles={kycFiles}
              setKycFiles={setKycFiles}
              formErrors={formErrors}
              isUploadingKYC={isUploadingKYC}
            />
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModel
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          if (createEnrollment.isSuccess) onBack();
        }}
        userDetails={{
          ...userDetails,
          platform: selectedPlatform!,
          engagementType: engagementType!,
        }}
        packagePrice={String(
          discountDetails?.finalAmountAfterDiscount || selectedPackage.amount
        )}
        packageName={selectedPackage.name}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
};
