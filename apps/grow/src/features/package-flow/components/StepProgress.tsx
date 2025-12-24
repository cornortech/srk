import React from 'react';

export const StepProgress: React.FC<{ step: number }> = ({ step }) => {
  return (
    <div className="mb-8 flex items-center justify-between">
      {[1, 2, 3, 4].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= stepNum
                ? 'bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black shadow-lg'
                : 'bg-white/5 text-gray-400 border border-white/20'
            }`}
          >
            {stepNum}
          </div>
          {stepNum < 4 && (
            <div
              className={`w-16 md:w-24 h-1 mx-2 ${
                step > stepNum
                  ? 'bg-gradient-to-r from-[#b68938] to-[#e1ba73]'
                  : 'bg-white/10'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
