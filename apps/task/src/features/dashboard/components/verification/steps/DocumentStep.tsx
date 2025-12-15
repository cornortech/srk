import React from 'react';
import { ChevronRight, Upload } from 'lucide-react';
import { DocumentStepProps } from './types';

export const DocumentStep: React.FC<DocumentStepProps> = ({
  formData,
  onNext,
  onFileChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">1. Upload Document</h2>
      <p className="text-gray-400">
        Please upload a valid government-issued ID (e.g., Passport, Driver's
        License).
      </p>

      <div
        className="border-2 border-dashed border-[#ac9976] rounded-lg p-8 text-center bg-gray-700/50 cursor-pointer hover:bg-gray-700/70 transition"
        onClick={() => document.getElementById('documentUpload')?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-3 text-amber-400" />

        <input
          id="documentUpload"
          type="file"
          accept="image/*,.pdf"
          onChange={onFileChange}
          className="hidden"
        />

        <p className="text-amber-400 font-medium">
          {formData.documentFile
            ? formData.documentFile.name
            : 'Click to select file'}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          PDF or image files up to 5MB.
        </p>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          onClick={onNext}
          disabled={!formData.documentFile}
          className="px-6 py-2 bg-gradient-to-r from-[#ac9976] to-[#e1ba73] text-black font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next: Selfie <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default DocumentStep;
