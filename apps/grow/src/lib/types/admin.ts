export interface User {
  id: string;
  name: string;
  role: 'Affiliate' | 'Client';
  package: string;
  balance: number;
  status: string;
  joinDate: string;
  referer: string;
}

export interface TaskDetail {
  total: number;
  completed: number;
  status: 'Approved' | 'In Review' | 'Pending' | 'N/A';
  link: string;
}

export interface PlatformTasks {
  follow: TaskDetail;
  video: TaskDetail;
  post: TaskDetail;
}

export interface TaskMonitoringEntry {
  userId: string;
  platforms: {
    facebook: PlatformTasks;
    youtube: PlatformTasks;
    instagram: PlatformTasks;
    twitter: PlatformTasks;
    tiktok: PlatformTasks;
  };
}

export interface PrivateTaskPerformance {
  userId: string;
  totalClicks: number;
  facebookClicks: number;
  youtubeClicks: number;
  instagramClicks: number;
  twitterClicks: number;
  tiktokClicks: number;
  link: string;
}

export interface TrendItem {
  month: string;
  revenue: number;
  users: number;
}

export interface AdminData {
  totalRevenue: number;
  totalPayouts: number;
  totalLiability: number;
  affiliateCount: number;
}

export interface DashboardData extends AdminData {
  allUsers: User[];
  privateTaskPerformance: PrivateTaskPerformance[];
  taskMonitoringData: TaskMonitoringEntry[];
  trends: TrendItem[];
}

export interface VerificationItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  profilePhoto?: string;
  kycDocument?: string;
  refererName?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface PaymentVerificationItem {
  id: string;
  userId: string;
  fullName: string;
  userEmail: string;
  packageType: string;
  postLinks?: string[];
  amount: number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}
