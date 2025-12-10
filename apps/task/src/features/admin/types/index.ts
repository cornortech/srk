import React from 'react';

export interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  taskName: string;
  username: string;
}

export interface Payout {
  id: number;
  userId: string;
  username: string;
  points: number;
  amount: number;
  method: string;
  requestedAt: string;
  status: 'Requested' | 'Paid' | 'Pending Review';
  paidAt?: string;
}

export interface Verification {
  id: number;
  name: string;
  email: string;
  requestedAt: string;
  photoUrl: string;
}

export interface TaskVerification {
  id: number;
  userId: string;
  username: string;
  taskName: string;
  points: number;
  submittedAt: string;
  proofUrl: string;
}

export interface User {
  id: string;
  name: string;
  totalPoints: number;
  isVerified: boolean;
  joined: string;
}

export interface LeaderboardUser extends User {
  rank: number;
}

export interface CompletedTask {
  id: number;
  userId: string;
  username: string;
  points: number;
  completedAt: string;
}

export interface TaskData {
  follow: {
    youtube: CompletedTask[];
    facebook: CompletedTask[];
    instagram: CompletedTask[];
    twitter: CompletedTask[];
  };
  video: {
    watch: CompletedTask[];
  };
  share: {
    youtube: CompletedTask[];
    facebook: CompletedTask[];
    instagram: CompletedTask[];
    twitter: CompletedTask[];
  };
}

export interface NavLink {
  name: string;
  icon: React.ElementType;
  content: React.ReactNode;
}
