import { useCallback, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { THEME } from '../constants/theme';
import { api } from '../../../lib/api';
import { useSRKFileUpload } from '@srk/shared/hooks';

type TaskType = 'follow' | 'like';

export const CreateUserView: React.FC = () => {
  const { uploadFile, isUploading } = useSRKFileUpload('grow');

  const [formData, setFormData] = useState({
    // User Data
    fullName: '',
    email: '',
    password: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phoneNumber: '',
    country: '',
    kycURLs: [] as string[],
    usedPromoCode: '',

    // Enrollment Data
    growSocialMediaPackageId: '',
    growSocialMediaPackageTypeId: '',
    growSocialMediaPackageSubTypeId: '',
    socialMediaPlatform: '' as 'Instagram' | 'TikTok' | 'YouTube' | 'Twitter' | 'Facebook' | '',
    profileLinkURLs: [] as string[],
    postURLs: [] as string[],

    // Payment Data
    paymentURL: '',
    transactionId: '',
    paymentMethod: 'esewa' as 'esewa' | 'khalti' | 'bankTransfer',
  });

  const [currentProfileLink, setCurrentProfileLink] = useState('');
  const [currentPostUrl, setCurrentPostUrl] = useState('');
  const [promoCodeValidation, setPromoCodeValidation] = useState<{
    isValid: boolean;
    message: string;
    discountDetails?: {
      originalAmount: number;
      discountPercentage: number;
      discountAmount: number;
      finalAmountAfterDiscount: number;
    };
  } | null>(null);

  // Fetch packages
  const { data: packagesData, isLoading: packagesLoading } = api.package.getAllSrkGrowPackages.useQuery(['packages']);

  // Get selected package details
  const selectedPackage = useMemo(() => {
    return packagesData?.body?.find(p => p._id === formData.growSocialMediaPackageId);
  }, [packagesData, formData.growSocialMediaPackageId]);

  // Get selected package type
  const selectedPackageType = useMemo(() => {
    return selectedPackage?.packageTypes?.find(
      pt => pt._id === formData.growSocialMediaPackageTypeId
    );
  }, [selectedPackage, formData.growSocialMediaPackageTypeId]);

  // Get selected package subtype
  const selectedPackageSubType = useMemo(() => {
    return selectedPackageType?.packageSubTypes?.find(
      pst => pst._id === formData.growSocialMediaPackageSubTypeId
    );
  }, [selectedPackageType, formData.growSocialMediaPackageSubTypeId]);

  // Determine task type based on subtype selection
  const taskType: TaskType | null = useMemo(() => {
    if (!selectedPackageSubType) return null;

    // If has followers requirement, it's a follow task
    if ((selectedPackageSubType.noOfFollowers ?? 0) > 0) return 'follow';

    // If has likes/videos requirement, it's a like/engagement task
    if ((selectedPackageSubType.noOfLikes ?? 0) > 0 || (selectedPackageSubType.noOfVideos ?? 0) > 0) return 'like';

    return null;
  }, [selectedPackageSubType]);

  // Promo code validation
  const validatePromoMutation = api.grow.validateGrowUserPromoCode.useMutation({
    onSuccess: (data) => {
      if (data.status === 200) {
        setPromoCodeValidation({
          isValid: true,
          message: 'Promo code applied successfully!',
          discountDetails: data.body.discountDetails,
        });
      }
    },
    onError: () => {
      setPromoCodeValidation({
        isValid: false,
        message: 'Invalid promo code',
      });
    },
  });

  // Create enrollment mutation
  const createEnrollmentMutation = api.grow.createGrowSocialMediaEnrollment.useMutation({
    onSuccess: async (data) => {
      if (data.status === 201) {
        // Auto-accept the enrollment (admin creation should be pre-approved)
        try {
          const acceptResult = await api.grow.acceptSocialGrowEnrollmentRequest.mutation({
            params: { enrollmentId: data.body.enrollmentId },
            body: {},
          });

          if (acceptResult.status === 200) {
            alert('User created, enrolled, and activated successfully! Commission credited to referrer if applicable.');
          } else {
            alert('User created but auto-activation failed. Please activate manually.');
          }
        } catch {
          alert('User created but auto-activation failed. Please activate manually.');
        }

        // Reset form
        setFormData({
          fullName: '',
          email: '',
          password: '',
          gender: 'Male',
          phoneNumber: '',
          country: '',
          kycURLs: [],
          usedPromoCode: '',
          growSocialMediaPackageId: '',
          growSocialMediaPackageTypeId: '',
          growSocialMediaPackageSubTypeId: '',
          socialMediaPlatform: '',
          profileLinkURLs: [],
          postURLs: [],
          paymentURL: '',
          transactionId: '',
          paymentMethod: 'esewa',
        });
        setPromoCodeValidation(null);
      }
    },
    onError: () => {
      alert('Failed to create user');
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Validation
      if (!formData.fullName || !formData.email || !formData.password) {
        alert('Please fill in all required user information');
        return;
      }

      if (!formData.growSocialMediaPackageId || !formData.growSocialMediaPackageTypeId || !formData.growSocialMediaPackageSubTypeId) {
        alert('Please select package, type, and subtype');
        return;
      }

      if (!formData.socialMediaPlatform) {
        alert('Please select a social media platform');
        return;
      }

      if (formData.kycURLs.length === 0) {
        alert('Please upload at least one KYC document');
        return;
      }

      if (!formData.paymentURL || !formData.transactionId) {
        alert('Please provide payment details');
        return;
      }

      // Check task type requirements
      if (taskType === 'follow' && formData.profileLinkURLs.length === 0) {
        alert('Please add at least one profile link for follow tasks');
        return;
      }

      if (taskType === 'like' && formData.postURLs.length === 0) {
        alert('Please add at least one post URL for engagement tasks');
        return;
      }

      // Submit enrollment
      createEnrollmentMutation.mutate({
        body: {
          userData: {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            gender: formData.gender,
            phoneNumber: formData.phoneNumber,
            country: formData.country,
            kycURL: formData.kycURLs,
            usedPromoCode: formData.usedPromoCode || undefined,
          },
          enrollmentData: {
            growSocialMediaPackageId: formData.growSocialMediaPackageId,
            growSocialMediaPackageTypeId: formData.growSocialMediaPackageTypeId,
            growSocialMediaPackageSubTypeId: formData.growSocialMediaPackageSubTypeId,
            socialMediaPlatform: formData.socialMediaPlatform as 'Instagram' | 'TikTok' | 'YouTube' | 'Twitter' | 'Facebook',
            profileLinkURL: formData.profileLinkURLs.length > 0 ? formData.profileLinkURLs : undefined,
          },
          paymentData: {
            paymentURL: formData.paymentURL,
            transactionId: formData.transactionId,
            paymentMethod: formData.paymentMethod,
          },
          postEngagement: formData.postURLs.length > 0 ? {
            postURLs: formData.postURLs,
          } : undefined,
        },
      });
    },
    [formData, taskType, createEnrollmentMutation]
  );

  const handleInputChange = useCallback(
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prev) => {
          const updated = { ...prev, [field]: value };

          // Reset dependent fields when package changes
          if (field === 'growSocialMediaPackageId') {
            updated.growSocialMediaPackageTypeId = '';
            updated.growSocialMediaPackageSubTypeId = '';
            updated.socialMediaPlatform = '';
          }

          // Reset subtype when type changes
          if (field === 'growSocialMediaPackageTypeId') {
            updated.growSocialMediaPackageSubTypeId = '';
          }

          return updated;
        });
      },
    []
  );

  const handleValidatePromoCode = useCallback(() => {
    if (!formData.usedPromoCode) {
      alert('Please enter a promo code');
      return;
    }

    if (!formData.growSocialMediaPackageId) {
      alert('Please select a package first');
      return;
    }

    validatePromoMutation.mutate({
      body: {
        promoCode: formData.usedPromoCode,
        growSocialMediaPackageId: formData.growSocialMediaPackageId,
      },
    });
  }, [formData.usedPromoCode, formData.growSocialMediaPackageId, validatePromoMutation]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      try {
        const uploadPromises = Array.from(files).map((file) =>
          uploadFile(file, 'image')
        );

        const results = await Promise.all(uploadPromises);
        const urls = results.map((result) => result.url);

        setFormData((prev) => ({
          ...prev,
          kycURLs: [...prev.kycURLs, ...urls],
        }));
      } catch {
        alert('Failed to upload KYC documents');
      }
    },
    [uploadFile]
  );

  const removeKycUrl = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      kycURLs: prev.kycURLs.filter((_, i) => i !== index),
    }));
  }, []);

  const addProfileLink = useCallback(() => {
    if (!currentProfileLink) return;

    try {
      new URL(currentProfileLink);
      setFormData((prev) => ({
        ...prev,
        profileLinkURLs: [...prev.profileLinkURLs, currentProfileLink],
      }));
      setCurrentProfileLink('');
    } catch {
      alert('Please enter a valid URL');
    }
  }, [currentProfileLink]);

  const removeProfileLink = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      profileLinkURLs: prev.profileLinkURLs.filter((_, i) => i !== index),
    }));
  }, []);

  const addPostUrl = useCallback(() => {
    if (!currentPostUrl) return;

    try {
      new URL(currentPostUrl);
      setFormData((prev) => ({
        ...prev,
        postURLs: [...prev.postURLs, currentPostUrl],
      }));
      setCurrentPostUrl('');
    } catch {
      alert('Please enter a valid URL');
    }
  }, [currentPostUrl]);

  const removePostUrl = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      postURLs: prev.postURLs.filter((_, i) => i !== index),
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>Create SRK Grow User</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">Register new package users (Admin)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* User Information Section */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">User Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange('fullName')}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                      placeholder="********"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange('phoneNumber')}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={handleInputChange('gender')}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={handleInputChange('country')}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                      placeholder="India"
                    />
                  </div>
                </div>

                {/* KYC Upload */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    KYC Documents <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#b68938] file:text-black hover:file:bg-[#9a7330]"
                  />
                  {isUploading && <p className="text-sm text-gray-400 mt-2">Uploading...</p>}

                  {formData.kycURLs.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.kycURLs.map((url, index) => (
                        <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                          <span className="text-sm text-gray-400 truncate flex-1">Document {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeKycUrl(index)}
                            className="text-red-400 hover:text-red-300 text-sm ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Package Selection Section */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Package Selection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Package <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.growSocialMediaPackageId}
                      onChange={handleInputChange('growSocialMediaPackageId')}
                      disabled={packagesLoading}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50"
                    >
                      <option value="">Select Package</option>
                      {packagesData?.body?.map((pkg) => (
                        <option key={pkg._id} value={pkg._id}>
                          {pkg.name} - ₹{pkg.amount}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPackage && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Package Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.growSocialMediaPackageTypeId}
                        onChange={handleInputChange('growSocialMediaPackageTypeId')}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50"
                      >
                        <option value="">Select Type</option>
                        {selectedPackage.packageTypes?.map((type) => (
                          <option key={type._id} value={type._id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedPackageType && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Package Sub-Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.growSocialMediaPackageSubTypeId}
                        onChange={handleInputChange('growSocialMediaPackageSubTypeId')}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50"
                      >
                        <option value="">Select Sub-Type</option>
                        {selectedPackageType.packageSubTypes?.map((subType) => (
                          <option key={subType._id} value={subType._id}>
                            {subType.name}
                            {(subType.noOfFollowers ?? 0) > 0 && ` - ${subType.noOfFollowers} Followers`}
                            {(subType.noOfLikes ?? 0) > 0 && ` - ${subType.noOfLikes} Likes`}
                            {(subType.noOfVideos ?? 0) > 0 && ` - ${subType.noOfVideos} Videos`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedPackage && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Social Media Platform <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.socialMediaPlatform}
                        onChange={handleInputChange('socialMediaPlatform')}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50"
                      >
                        <option value="">Select Platform</option>
                        {selectedPackage.socialMediaPlatforms?.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Promo Code */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Promo Code (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.usedPromoCode}
                      onChange={handleInputChange('usedPromoCode')}
                      className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50"
                      placeholder="Enter promo code"
                    />
                    <button
                      type="button"
                      onClick={handleValidatePromoCode}
                      disabled={validatePromoMutation.isPending}
                      className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                      {validatePromoMutation.isPending ? 'Validating...' : 'Validate'}
                    </button>
                  </div>
                  {promoCodeValidation && (
                    <div className={`mt-2 p-3 rounded-lg ${promoCodeValidation.isValid ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      <p className="text-sm">{promoCodeValidation.message}</p>
                      {promoCodeValidation.discountDetails && (
                        <p className="text-xs mt-1">
                          Final Amount: ₹{promoCodeValidation.discountDetails.finalAmountAfterDiscount}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Task-specific fields */}
                {taskType === 'follow' && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Profile Links (Follow Tasks) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={currentProfileLink}
                        onChange={(e) => setCurrentProfileLink(e.target.value)}
                        placeholder="https://instagram.com/username"
                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50"
                      />
                      <button
                        type="button"
                        onClick={addProfileLink}
                        className="px-6 py-3 bg-[#b68938] text-black rounded-xl hover:bg-[#9a7330] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {formData.profileLinkURLs.length > 0 && (
                      <div className="space-y-2">
                        {formData.profileLinkURLs.map((url, index) => (
                          <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                            <span className="text-sm text-gray-400 truncate flex-1">{url}</span>
                            <button
                              type="button"
                              onClick={() => removeProfileLink(index)}
                              className="text-red-400 hover:text-red-300 text-sm ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {taskType === 'like' && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Post URLs (Engagement Tasks) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={currentPostUrl}
                        onChange={(e) => setCurrentPostUrl(e.target.value)}
                        placeholder="https://instagram.com/p/postid"
                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50"
                      />
                      <button
                        type="button"
                        onClick={addPostUrl}
                        className="px-6 py-3 bg-[#b68938] text-black rounded-xl hover:bg-[#9a7330] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {formData.postURLs.length > 0 && (
                      <div className="space-y-2">
                        {formData.postURLs.map((url, index) => (
                          <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                            <span className="text-sm text-gray-400 truncate flex-1">{url}</span>
                            <button
                              type="button"
                              onClick={() => removePostUrl(index)}
                              className="text-red-400 hover:text-red-300 text-sm ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Information Section */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Payment Method <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={handleInputChange('paymentMethod')}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50"
                    >
                      <option value="esewa">eSewa</option>
                      <option value="khalti">Khalti</option>
                      <option value="bankTransfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Transaction ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.transactionId}
                      onChange={handleInputChange('transactionId')}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50"
                      placeholder="TXN123456789"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Payment Screenshot URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.paymentURL}
                      onChange={handleInputChange('paymentURL')}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50"
                      placeholder="https://example.com/payment-screenshot.jpg"
                    />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={createEnrollmentMutation.isPending || isUploading}
                className="w-full py-4 rounded-xl font-bold text-lg text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(182,137,56,0.5)] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: THEME.colors.goldGradient }}
              >
                <span className="relative z-10">
                  {createEnrollmentMutation.isPending ? 'Creating User...' : 'Create User & Enroll'}
                </span>
              </motion.button>
            </form>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Package Info</h3>
            {selectedPackage ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400">Selected Package</p>
                  <p className="text-lg font-bold text-white">{selectedPackage.name}</p>
                  <p className="text-2xl font-bold text-[#b68938] mt-2">₹{selectedPackage.amount}</p>
                  {promoCodeValidation?.isValid && promoCodeValidation.discountDetails && (
                    <>
                      <p className="text-sm text-green-400 mt-2">
                        Discount: {promoCodeValidation.discountDetails.discountPercentage}%
                      </p>
                      <p className="text-xl font-bold text-white mt-1">
                        Final: ₹{promoCodeValidation.discountDetails.finalAmountAfterDiscount}
                      </p>
                    </>
                  )}
                </div>

                {selectedPackageSubType && (
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-gray-400">Task Requirements</p>
                    {(selectedPackageSubType.noOfFollowers ?? 0) > 0 && (
                      <p className="text-white">👥 {selectedPackageSubType.noOfFollowers} Followers</p>
                    )}
                    {(selectedPackageSubType.noOfLikes ?? 0) > 0 && (
                      <p className="text-white">❤️ {selectedPackageSubType.noOfLikes} Likes</p>
                    )}
                    {(selectedPackageSubType.noOfVideos ?? 0) > 0 && (
                      <p className="text-white">📹 {selectedPackageSubType.noOfVideos} Videos</p>
                    )}
                  </div>
                )}

                {taskType && (
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-gray-400">Task Type</p>
                    <p className="text-white font-semibold capitalize">{taskType} Task</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Select a package to see details</p>
            )}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};
