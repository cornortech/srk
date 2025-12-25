import { SVGProps } from 'react';

export interface DashboardData {
  today: number;
  week: number;
  days28: number;
  allTime: number;
  wallet: number;
  consistencyDays: number;
}

export interface Customer {
  name: string;
  userId: string;
  avatar: string;
}

export interface SalesData {
  id: string;
  packageName: string;
  salesCount: number;
  price: number;
  customers: Customer[];
}

export type PayoutStatus = 'Completed' | 'Processing' | 'Failed';

export interface Payout {
  id: string;
  date: Date;
  amount: number;
  status: PayoutStatus;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  todayEarning: number;
  weekEarning: number;
  totalAmountEarned: number;
  avatarColor: string;
  avatarText: string;
  trend: 'up' | 'down' | 'stable';
  isCurrent?: boolean;
  shares: number;
  referralCount: number;
}

export interface AnalyticsData {
  clicks: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  posts: {
    total: number;
    completed: number;
    target: number;
    links: Array<{
      id: string;
      title: string;
      clicks: number;
      target: number;
      completionRate: number;
      platform: string;
    }>;
  };
  videos: {
    total: number;
    completed: number;
    target: number;
    links: Array<{
      id: string;
      title: string;
      views: number;
      target: number;
      completionRate: number;
      platform: string;
    }>;
  };
  features: {
    follow: Array<{
      id: string;
      name: string;
      type: 'channel' | 'page' | 'profile';
      platform: string;
      clicks: number;
      target: number;
      completionRate: number;
    }>;
    watch: Array<{
      id: string;
      title: string;
      platform: string;
      views: number;
      target: number;
      completionRate: number;
    }>;
    share: Array<{
      id: string;
      title: string;
      platform: string;
      shares: number;
      target: number;
      completionRate: number;
    }>;
    like: Array<{
      id: string;
      title: string;
      platform: string;
      likes: number;
      target: number;
      completionRate: number;
    }>;
  };
}

export interface ReferralPackage {
  id: string;
  name: string;
  description: string;
  commission: string;
  variant: 'blue' | 'violet' | 'gold';
  price: number;
  features: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  userId: string;
  avatarUrl: string;
  coins: number;
  totalShares: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export type ToastType = 'success' | 'error' | 'info';
export type CardVariant =
  | 'neutral'
  | 'gold'
  | 'emerald'
  | 'violet'
  | 'blue'
  | 'rose'
  | 'cyan';
export type ViewId =
  | 'dashboard'
  | 'referral'
  | 'mysales'
  | 'leaderboard'
  | 'payout'
  | 'profile'
  | 'srkbank'
  | 'analytics';

export interface NavItem {
  id: ViewId;
  label: string;
  icon: React.FC<SVGProps<SVGSVGElement>>;
  color: string;
  external?: boolean;
}
