import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingView } from '../../features/dashboard/views/LandingView';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/task/dashboard');
  };

  const addNotification = (message: string, type: 'success') => {
    // You can integrate with a global notification system here
    console.log(`[${type}] ${message}`);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <LandingView setView={handleStart} addNotification={addNotification} />
    </div>
  );
};

export default OnboardingPage;
