import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DetailsStepProps } from './types';

export const DetailsStep: React.FC<DetailsStepProps> = ({
  formData,
  onNext,
  onPrev,
  onInputChange,
}) => {
  const isValid = formData.fullName && formData.dob && formData.signature;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">4. Personal Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Full Name (as per ID)
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={onInputChange}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-amber-500/50 focus:border-amber-500/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={onInputChange}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-amber-500/50 focus:border-amber-500/50 focus:outline-none"
          />
        </div>

        {/* Signature Preview */}
        {formData.signature && (
          <div>
            <p className="text-gray-400 mb-2">Signature Preview:</p>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <img
                src={formData.signature}
                alt="Signature Preview"
                className="h-20 mx-auto object-contain"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="text-gray-400 hover:text-white transition px-4 py-2 flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="px-6 py-2 bg-gradient-to-r from-[#ac9976] to-[#e1ba73] text-black font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next: Review <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default DetailsStep;
