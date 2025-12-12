import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import {
  CheckoutUserDetails,
  EngagementType,
  PackageDetails,
  SocialPlatform,
} from '../../../../lib/types/types';

interface CheckoutFormProps {
  selectedPackage: PackageDetails;
  selectedPlatform: SocialPlatform;
  engagementType: EngagementType;
  optionDescription: string;
  userDetails: CheckoutUserDetails;
  handleUserDetailsChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handlePostLinkChange: (index: number, value: string) => void;
  handleSubmit: () => void;
  handleBack: () => void;
  showMultiplePostLinks: boolean;
  numPostLinks: number;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  selectedPackage,
  selectedPlatform,
  engagementType,
  optionDescription,
  userDetails,
  handleUserDetailsChange,
  handlePostLinkChange,
  handleSubmit,
  handleBack,
  showMultiplePostLinks,
  numPostLinks,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid lg:grid-cols-3 gap-8"
    >
      {/* Order Summary - Left Side */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-md rounded-3xl border border-[rgba(182,137,56,0.2)] bg-[rgba(26,20,16,0.4)] p-6 sticky top-32"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Order Summary
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400">Package</span>
              <span className="font-bold text-white">
                {selectedPackage.name}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400">Platform</span>
              <span className="font-bold text-white capitalize">
                {selectedPlatform}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400">Type</span>
              <span className="font-bold text-white">
                {engagementType === 'follow'
                  ? 'Follow/Subscribe'
                  : 'Reach & Engagement'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400">Option</span>
              <span className="font-bold text-white text-right">
                {optionDescription}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400">Price</span>
              <span className="text-2xl font-bold text-[#b68938]">
                {selectedPackage.price}
              </span>
            </div>
          </div>
          {selectedPackage.originalPrice && (
            <div className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[#b68938]/20 to-[#e1ba73]/20 border border-[#b68938]/30 text-center">
              <span className="text-[#e1ba73] font-bold text-sm">
                Save {selectedPackage.originalPrice}
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* User Details Form - Right Side */}
      <div className="lg:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl rounded-3xl border border-[#b68938]/30 p-8"
          style={{ background: 'rgba(26, 20, 16, 0.6)' }}
        >
          <h2 className="text-3xl font-bold mb-2">Personal Information</h2>
          <p className="text-gray-400 mb-8">
            Please provide your details to proceed with the purchase.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={userDetails.name}
                onChange={handleUserDetailsChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={userDetails.email}
                onChange={handleUserDetailsChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={userDetails.password}
                onChange={handleUserDetailsChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                placeholder="Create a strong password"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={userDetails.confirmPassword}
                onChange={handleUserDetailsChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                placeholder="Confirm your password"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={userDetails.phone}
                onChange={handleUserDetailsChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Country *
              </label>
              <select
                name="country"
                value={userDetails.country}
                onChange={handleUserDetailsChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23b68938' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="" className="bg-[#1a1410] text-white">
                  Select your country
                </option>
                <option value="Nepal" className="bg-[#1a1410] text-white">
                  Nepal
                </option>
                <option value="India" className="bg-[#1a1410] text-white">
                  India
                </option>
                <option value="Bangladesh" className="bg-[#1a1410] text-white">
                  Bangladesh
                </option>
                <option value="Sri Lanka" className="bg-[#1a1410] text-white">
                  Sri Lanka
                </option>
                <option value="Other" className="bg-[#1a1410] text-white">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Gender
              </label>
              <select
                name="gender"
                value={userDetails.gender}
                onChange={handleUserDetailsChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23b68938' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="" className="bg-[#1a1410] text-white">
                  Select gender
                </option>
                <option value="male" className="bg-[#1a1410] text-white">
                  Male
                </option>
                <option value="female" className="bg-[#1a1410] text-white">
                  Female
                </option>
                <option value="other" className="bg-[#1a1410] text-white">
                  Other
                </option>
                <option
                  value="prefer-not-to-say"
                  className="bg-[#1a1410] text-white"
                >
                  Prefer not to say
                </option>
              </select>
            </div>

            {/* Dynamic Post Link Fields */}
            {showMultiplePostLinks ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                  Post/Video Links * ({numPostLinks} links required)
                </label>
                <div className="space-y-4">
                  {Array.from({ length: numPostLinks }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500 min-w-[60px]">
                        Post {index + 1}:
                      </span>
                      <input
                        type="url"
                        value={userDetails.postLinks?.[index] || ''}
                        onChange={(e) =>
                          handlePostLinkChange(index, e.target.value)
                        }
                        required
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                        placeholder={`https://${selectedPlatform}.com/your-video-${
                          index + 1
                        }`}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Please provide {numPostLinks} separate links for each
                  post/video
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                  {engagementType === 'follow'
                    ? 'Profile Link *'
                    : 'Post/Video Link *'}
                </label>
                <input
                  type="url"
                  name="socialLink"
                  value={userDetails.socialLink}
                  onChange={handleUserDetailsChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                  placeholder={
                    engagementType === 'follow'
                      ? `https://${selectedPlatform}.com/your-profile`
                      : `https://${selectedPlatform}.com/your-video`
                  }
                />
              </div>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="mb-8">
            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                required
                className="w-5 h-5 rounded bg-white/5 border border-white/10 focus:ring-[#b68938] focus:ring-2 focus:ring-offset-2 focus:ring-offset-black text-[#b68938] transition-all"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                I agree to the Terms & Conditions and Privacy Policy. I
                understand that all engagements come from verified SRK
                University students and the delivery time is{' '}
                {selectedPackage.id === 'starter'
                  ? '7 days'
                  : selectedPackage.id === 'intermediate'
                  ? '3 days'
                  : '24 hours'}
                .
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-white/10">
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-sm uppercase tracking-widest transition-all"
            >
              Back to Options
            </button>

            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_30px_rgba(182,137,56,0.5)] hover:scale-105 active:scale-95"
            >
              Complete Order for {selectedPackage.price}
            </button>
          </div>

          {/* Secure Payment Note */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield size={16} className="text-[#b68938]" />
              <span>
                Your information is secured with 256-bit SSL encryption
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
