import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  EngagementType,
  SocialPlatform,
  UserDetails,
} from '../../../lib/types/types';
import PaymentModel from '../../../lib/ui/PaymentModel';
import { StepProgress } from './StepProgress';
import { CheckoutForm } from './CheckoutForm';
import { EngagementStep, OptionStep, PlatformStep } from './StepViews';
import { api } from '../../../lib/api';
import { useSRKFileUpload } from '@srk/shared/hooks';
import {
  createGrowSocialMediaEnrollmentSchema,
  TCreateGrowSocialMediaEnrollment,
  TSrkGrowPackagesSchema,
} from '@srk/shared/contracts';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../../../lib/contexts/ToastContext';
import { formatRupees } from '../../../lib/utils/formatters';

interface PackageSelectionFlowProps {
  selectedPackage: TSrkGrowPackagesSchema;
  referralCode?: string; // Add this
  onComplete: (userDetails: UserDetails) => void;
  onBack: () => void;
}

export const PackageSelectionFlow: React.FC<PackageSelectionFlowProps> = ({
  selectedPackage,
  referralCode = '',
  onComplete,
  onBack,
}) => {
  const toast = useToast();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform | null>(null);
  const [engagementType, setEngagementType] = useState<EngagementType | null>(
    null
  );
  const [selectedTypeIndex, setSelectedTypeIndex] = useState<number>(0);
  const [selectedSubTypeIndex, setSelectedSubTypeIndex] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [kycFiles, setKycFiles] = useState<File[]>([]);

  const form = useForm<TCreateGrowSocialMediaEnrollment>({
    resolver: zodResolver(createGrowSocialMediaEnrollmentSchema),
    defaultValues: {
      userData: {
        fullName: '',
        email: '',
        password: '',
        gender: undefined,
        phoneNumber: '',
        country: '',
        // kycURL: [],
        usedPromoCode: referralCode || '',
      },
      enrollmentData: {
        growSocialMediaPackageId: selectedPackage?._id,
        growSocialMediaPackageTypeId: '',
        growSocialMediaPackageSubTypeId: '',
        socialMediaPlatform: '',
        profileLinkURL: [],
      },
      paymentData: {
        paymentURL: 'https://placeholder.com', // Placeholder for validation
        transactionId: 'placeholder',
        paymentMethod: 'esewa',
      },
      postEngagement: {
        postURLs: [],
      },
    },
  });

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors: zodErrors },
    setValue,
    watch,
    trigger,
  } = form;

  // We still need confirmPassword and terms for UI
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const { uploadFile, isUploading: isUploadingKYC } = useSRKFileUpload('grow');
  const uploadedKycUrlsRef = useRef<string[]>([]);

  const validatePromo = api.grow.validateGrowUserPromoCode.useMutation({
    onSuccess: (data) => {
      if (data.status === 200) {
        setDiscountDetails(data.body.discountDetails);
        setPromoSuccessMessage(
          (data.body as any).message || 'Promo code applied!'
        );
        setPromoError(null);
      } else {
        setPromoError((data.body as any).message || 'Invalid promo code');
        setDiscountDetails(null);
        setPromoSuccessMessage(null);
      }
    },
    onError: (err) => {
      setPromoError(
        (err as any).body?.message || 'Failed to validate promo code'
      );
      setDiscountDetails(null);
      setPromoSuccessMessage(null);
    },
  });

  const createEnrollment = api.grow.createGrowSocialMediaEnrollment.useMutation(
    {
      onSuccess: (data) => {
        // Handle success if needed, e.g. toast?
        // PaymentModel handles the success UI view
      },
      onError: (error) => {
        console.error('Enrollment failed', error);
        toast.error('Failed to create enrollment. Please try again.');
        throw error;
      },
    }
  );

  const watchedPromoCode = watch('userData.usedPromoCode');

  React.useEffect(() => {
    if (!watchedPromoCode || watchedPromoCode.trim() === '') {
      setPromoError(null);
      setPromoSuccessMessage(null);
      setDiscountDetails(null);
    }
  }, [watchedPromoCode]);

  const handleValidatePromoCode = () => {
    const promoCode = watch('userData.usedPromoCode');
    if (!promoCode || !promoCode.trim()) return;
    validatePromo.mutate({
      body: {
        promoCode: promoCode.trim(),
        growSocialMediaPackageId: selectedPackage._id,
      },
    });
  };

  const socialPlatforms: SocialPlatform[] = [
    'YouTube',
    'Facebook',
    'Instagram',
    'Twitter',
    'TikTok',
  ];

  const handlePlatformSelect = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    setValue('enrollmentData.socialMediaPlatform', platform);
    setStep(2);
  };

  const handleEngagementSelect = (type: EngagementType) => {
    setEngagementType(type);
    setStep(3);
  };

  const handleOptionSelect = (typeIndex: number, subTypeIndex: number) => {
    setSelectedTypeIndex(typeIndex);
    setSelectedSubTypeIndex(subTypeIndex);

    const packageType = selectedPackage?.packageTypes[typeIndex];
    const packageSubType = packageType?.packageSubTypes?.[subTypeIndex];

    setValue(
      'enrollmentData.growSocialMediaPackageTypeId',
      packageType?._id || ''
    );
    setValue(
      'enrollmentData.growSocialMediaPackageSubTypeId',
      packageSubType?._id || ''
    );

    setStep(4);
  };

  const handleSubmit = async () => {
    // Validate manually for step 4 specific fields
    const isStepValid = await trigger([
      'userData.fullName',
      'userData.email',
      'userData.password',
      'userData.phoneNumber',
      'userData.country',
      'userData.gender',
    ]);

    if (!isStepValid) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (watch('userData.password') !== confirmPassword) {
      form.setError('userData.password', { message: 'Passwords do not match' });
      toast.error('Passwords do not match');
      return;
    }

    if (kycFiles.length === 0) {
      toast.error('Please upload at least one KYC document');
      return;
    }

    // validation for Profile Link or Post URLs
    if (engagementType === 'follow') {
      // Filter out empty strings before validation
      const profileLinks = watch('enrollmentData.profileLinkURL') || [];
      const filteredProfileLinks = profileLinks.filter(
        (link: string) => link.trim() !== ''
      );

      if (filteredProfileLinks.length === 0) {
        toast.error('Please provide a profile link');
        return;
      }

      // Set the filtered values
      setValue('enrollmentData.profileLinkURL', filteredProfileLinks);

      const profileLinkReady = await trigger('enrollmentData.profileLinkURL');
      if (!profileLinkReady) {
        toast.error('Invalid Profile Link');
        return;
      }
    } else {
      const profileLinks = [];
      // Filter out empty strings before validation
      const postLinks = watch('postEngagement.postURLs') || [];
      const filteredPostLinks = postLinks.filter(
        (link: string) => link.trim() !== ''
      );

      if (filteredPostLinks.length === 0) {
        toast.error('Please provide at least one post URL');
        return;
      }

      // Set the filtered values
      setValue('postEngagement.postURLs', filteredPostLinks);

      const postLinksReady = await trigger('postEngagement.postURLs');
      if (!postLinksReady) {
        toast.error('Invalid Post URLs');
        return;
      }
    }

    const promoCode = watch('userData.usedPromoCode');
    if (promoCode) {
      try {
        const result = await validatePromo.mutateAsync({
          body: {
            promoCode: promoCode.trim(),
            growSocialMediaPackageId: selectedPackage?._id,
          },
        });

        if (result.status !== 200) {
          setPromoError((result.body as any).message || 'Invalid promo code');
          toast.error('Invalid promo code');
          return;
        }
      } catch (err) {
        toast.error('Failed to validate promo code');
        return;
      }
    }

    try {
      const uploadedKycKeys: string[] = [];
      for (const file of kycFiles) {
        const result = await uploadFile(file, 'image');
        uploadedKycKeys.push(result.key);
      }

      setValue('userData.kycURL', uploadedKycKeys);
      uploadedKycUrlsRef.current = uploadedKycKeys;
    } catch (error) {
      console.error('File upload failed', error);
      toast.error('Failed to upload KYC documents. Please try again.');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (paymentData: {
    transactionId: string;
    paymentProofUrl: string;
    paymentMethod: string;
  }) => {
    try {
      const kycUrls = uploadedKycUrlsRef.current;
      const packageType = selectedPackage?.packageTypes[selectedTypeIndex];
      const packageSubType =
        packageType?.packageSubTypes?.[selectedSubTypeIndex];

      if (!packageType || !packageSubType) {
        throw new Error('Invalid package option selected');
      }

      const profileLinks = watch('enrollmentData.profileLinkURL');
      const postLinks = watch('postEngagement.postURLs');

      await createEnrollment.mutateAsync({
        body: {
          userData: {
            fullName: watch('userData.fullName'),
            email: watch('userData.email'),
            phoneNumber: watch('userData.phoneNumber'),
            country: watch('userData.country'),
            gender: watch('userData.gender') as any,
            password: watch('userData.password'),
            kycURL: kycUrls,
            usedPromoCode: watch('userData.usedPromoCode') || undefined,
          },
          enrollmentData: {
            growSocialMediaPackageId: selectedPackage._id,
            growSocialMediaPackageTypeId: packageType._id,
            growSocialMediaPackageSubTypeId: packageSubType._id,
            profileLinkURL: profileLinks,
            socialMediaPlatform: selectedPlatform!,
          },
          paymentData: {
            paymentURL: paymentData.paymentProofUrl,
            transactionId: paymentData.transactionId,
            paymentMethod:
              paymentData.paymentMethod === 'bank'
                ? 'bankTransfer'
                : (paymentData.paymentMethod as any),
          },
          postEngagement:
            engagementType === 'reach'
              ? {
                  postURLs: postLinks?.filter((l: string) => l.trim() !== ''),
                }
              : undefined,
        },
      });
    } catch (error) {
      console.error('Failed to create enrollment', error);
      throw error;
    }
  };

  const getSelectedOptionDetails = () => {
    const packageType = selectedPackage?.packageTypes[selectedTypeIndex];
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
    (selectedPackage?.packageTypes[selectedTypeIndex]?.packageSubTypes[
      selectedSubTypeIndex
    ]?.noOfVideos || 0) > 1;

  const numPostLinks =
    engagementType === 'reach'
      ? selectedPackage?.packageTypes[selectedTypeIndex]?.packageSubTypes[
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
            {selectedPackage?.name} Package -{' '}
            <span className="text-[#b68938]">
              {formatRupees(selectedPackage?.amount)}
            </span>
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
              form={
                form as unknown as import('react-hook-form').UseFormReturn<
                  import('@srk/shared/contracts').TCreateGrowSocialMediaEnrollment
                >
              }
              isPromoLocked={!!referralCode}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
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
          name: watch('userData.fullName'),
          email: watch('userData.email'),
          phone: watch('userData.phoneNumber'),
          socialLink: watch('enrollmentData.profileLinkURL')?.[0] || '',
          platform: selectedPlatform!,
          engagementType: engagementType!,
          password: watch('userData.password'),
          confirmPassword: confirmPassword,
          country: watch('userData.country'),
          gender: watch('userData.gender'),
          promoCode: watch('userData.usedPromoCode') || '',
          postLinks: watch('postEngagement.postURLs'),
          kyc: watch('userData.kycURL'),
          selectedOption: selectedSubTypeIndex,
          userType: 'package' as const,
          packageId: selectedPackage?._id,
        }}
        packagePrice={String(
          discountDetails?.finalAmountAfterDiscount || selectedPackage?.amount
        )}
        packageName={selectedPackage?.name}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
}
