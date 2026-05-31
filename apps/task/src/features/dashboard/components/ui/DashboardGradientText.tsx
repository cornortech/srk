import React from 'react';

// Replaces animated gradient text with plain white text.
// API-compatible: accepts gradient prop but ignores it.
const DashboardGradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
  gradient?: 'gold' | 'purple' | 'blue' | 'green';
}> = ({ children, className = '' }) => {
  return <span className={`text-white ${className}`}>{children}</span>;
};

export default DashboardGradientText;
