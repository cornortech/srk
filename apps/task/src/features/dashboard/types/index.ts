import React from 'react';

export type SocialPlatform =
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'twitter';
export type TaskType = 'follow' | 'watch' | 'post' | 'like' | 'share';
export type DashboardView =
  | 'verification'
  | 'analytics'
  | 'tasks'
  | 'leaderboard'
  | 'coinExchange'
  | 'profile'
  | 'payout'
  | 'logout';
export type TaskStatus = 'pending' | 'completed' | 'rejected' | 'in_review';

export interface Task {
  id: string;
  type: TaskType;
  platform: SocialPlatform;
  title: string;
  coins: number;
  duration?: string;
  username?: string;
  embedId?: string;
  link?: string;
  desc: string;
  status?: TaskStatus;
  required?: string;
  proofType?: 'screenshot' | 'video' | 'link';
}

export interface RejectedTaskEntry extends Task {
  rejectionReason: string;
  uploadedProofUrl: string;
  taskId: string;
  date: string;
  adminComment?: string;
  canRetry: boolean;
}

export interface PlatformInfo {
  platform: SocialPlatform;
  icon: React.FC<any>;
  color: string;
  gradient: string;
  name: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: string;
  score: number;
  consistencyDays: number;
  isSelf?: boolean;
  avatar?: string;
  change?: 'up' | 'down' | 'stable';
  changeAmount?: number;
}

export interface AnalyticsData {
  totalCoins: number;
  today: number;
  last7Days: number;
  last28Days: number;
  allTime: number;
  history: { date: string; coins: number }[];
  activityGraph: number[];
  completionRate: number;
  averageDaily: number;
  peakDay: { date: string; coins: number };
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  level: number;
  xp: number;
  nextLevelXP: number;
  socialLinks: Record<SocialPlatform, string>;
  documentStatus: 'pending' | 'verified' | 'rejected';
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
