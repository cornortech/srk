import React from 'react';

export const StepProgress: React.FC<{ step: number }> = ({ step }) => {
  return (
    <div className="mb-8 flex items-center justify-between max-w-full overflow-x-auto">
      {[1, 2, 3, 4].map((stepNum) => (
        <div key={stepNum} className="flex items-center flex-1 min-w-[4rem]">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0  ${
              step >= stepNum
                ? 'bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black shadow-lg'
                : 'bg-white/5 text-gray-400 border border-white/20'
            }`}
          >
            {stepNum}
          </div>
          {stepNum < 4 && (
            <div
              className={`flex-1 h-1 ${
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
