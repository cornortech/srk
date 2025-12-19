import { PackageDetails, PackageType, SocialPlatform } from '../types/types';

export const SOCIAL_COLORS: Record<SocialPlatform, string> = {
  YouTube: '#FF0000',
  Facebook: '#1877F2',
  Instagram: '#E4405F',
  Twitter: '#1DA1F2',
  TikTok: '#000000',
};

export const PACKAGES_DATA: Record<PackageType, PackageDetails> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: '₹900',
    originalPrice: '₹1500',
    period: 'one-time',
    description: 'Perfect for testing the waters',
    features: [
      '200 followers per social media selected',
      '200 Total likes scheme',
      '100% Active accounts',
    ],
    followerOptions: [200],
    reachOptions: [
      { videos: 1, likesPerVideo: 200 },
      { videos: 2, likesPerVideo: 100 },
      { videos: 4, likesPerVideo: 50 },
    ],
    popular: false,
  },
  intermediate: {
    id: 'intermediate',
    name: 'Intermediate',
    price: '₹1,500',
    originalPrice: '₹3,999',
    period: 'one-time',
    description: 'Most popular for creators',
    features: [
      '500 followers per social media selected',
      '500 total likes scheme',
      '100% Active Accounts',
    ],
    followerOptions: [500],
    reachOptions: [
      { videos: 1, likesPerVideo: 500 },
      { videos: 2, likesPerVideo: 250 },
      { videos: 4, likesPerVideo: 125 },
      { videos: 8, likesPerVideo: 63 },
    ],
    popular: true,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: '₹4,999',
    originalPrice: '₹7,999',
    period: 'one-time',
    description: 'For serious influencers',
    features: [
      '700 followers per social media selected',
      '700 total likes scheme',
      '100% Active Accounts',
    ],
    followerOptions: [700],
    reachOptions: [
      { videos: 1, likesPerVideo: 700 },
      { videos: 2, likesPerVideo: 350 },
      { videos: 4, likesPerVideo: 175 },
      { videos: 8, likesPerVideo: 88 },
      { videos: 12, likesPerVideo: 58 },
    ],
    popular: false,
  },
};
