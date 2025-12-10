import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
}) => {
  return (
    <span
      className={`bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] bg-clip-text text-transparent animate-gradient ${className}`}
      style={{
        backgroundSize: '200% auto',
      }}
    >
      {children}
    </span>
  );
};

export default GradientText;
