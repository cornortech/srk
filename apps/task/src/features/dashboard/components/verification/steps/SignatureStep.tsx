import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SignaturePad } from '../SignaturePad';
import { SignatureStepProps } from './types';

export const SignatureStep: React.FC<SignatureStepProps> = ({
  formData,
  onNext,
  onPrev,
  onSignatureSave,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">3. Digital Signature</h2>
      <p className="text-gray-400">Draw your signature in the box below</p>

      <SignaturePad onSave={onSignatureSave} />

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="text-gray-400 hover:text-white transition px-4 py-2 flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!formData.signature}
          className="px-6 py-2 bg-gradient-to-r from-[#ac9976] to-[#e1ba73] text-black font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next: Details
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default SignatureStep;
