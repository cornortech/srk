import React from 'react';

interface AlertBannerProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ message, type = 'info' }) => {
  const typeClasses = {
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    error: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className={`border px-4 py-3 rounded ${typeClasses[type]}`}>
      {message}
    </div>
  );
};
