export type SocialPlatform = 'youtube' | 'facebook' | 'instagram' | 'twitter' | 'tiktok';
export type EngagementType = 'follow' | 'reach';
export type PackageType = 'starter' | 'intermediate' | 'pro';
export type KYCStatus = 'not_started' | 'pending' | 'approved' | 'rejected';

export interface PackageDetails {
  id: PackageType;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  followerOptions: number[];
  reachOptions: Array<{ videos: number; likesPerVideo: number }>;
  period: string;
  popular?: boolean;
}

export interface UserData {
  id: string;
  email: string;
  password: string;
  name: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  approved: boolean; // Add this line
  country:string ; 
  phone:number ; 
  kycDocuments: {
    id: string;
    name: string;
    size: number;
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
  }[];
  createdAt: string;
  lastLogin: string;
}

export interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserData) => void;
}

export interface KYCDocument {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  socialLink: string;
  platform: SocialPlatform;
  engagementType: EngagementType;
  selectedOption: number;
  packageType: PackageType;
  additionalInfo?: string;
  postLinks?: string[];
}

export interface CheckoutUserDetails extends Omit<UserDetails, 'phone'> {
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  gender: string;
  promoCode: string;
  postLinks?: string[];
}

export interface StatusModalProps {
  status: { type: 'success' | 'error'; message?: string };
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export interface OrderDetails {
  packageType: PackageType;
  platform: SocialPlatform;
  engagementType: EngagementType;
  selectedOption: number;
  amount: string;
  timestamp: string;
  transactionId: string;
  name: string;
  email: string;
  phone: string;
  socialLink: string;
}

export interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (userData: UserData) => void;
  initialMode: 'login' | 'register';
}

export interface DashboardProps {
  user: UserData;
  onLogout: () => void;
}

export interface PlatformData {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  progress: number;
  tasks: number;
  completed: number;
}