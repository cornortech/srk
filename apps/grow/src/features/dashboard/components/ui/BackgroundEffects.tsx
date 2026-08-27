import React from 'react';

export const BackgroundEffects: React.FC = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0A0705] via-[#1A120B] to-[#0A0705]"></div>
    <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#E1BA73]/10 rounded-full blur-[128px] animate-pulse opacity-30"></div>
    <div
      className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#B68938]/10 rounded-full blur-[128px] animate-pulse opacity-30"
      style={{ animationDelay: '1s' }}
    ></div>
    <div className="absolute inset-0 bg-[linear-gradient(rgba(225,186,115,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(225,186,115,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
  </div>
);
