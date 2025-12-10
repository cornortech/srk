import {
  Payout,
  Verification,
  TaskVerification,
  TaskData,
  User,
  LeaderboardUser,
} from '../types';

export const initialPayouts: Payout[] = [
  {
    id: 501,
    userId: 'user_010',
    username: 'CoolAdmin',
    points: 1500,
    amount: 15.0,
    method: 'PayPal',
    requestedAt: '2024-11-23 14:00',
    status: 'Requested',
  },
  {
    id: 502,
    userId: 'user_001',
    username: 'CryptoGuru',
    points: 2000,
    amount: 20.0,
    method: 'Bank Transfer',
    requestedAt: '2024-11-24 09:30',
    status: 'Requested',
  },
  {
    id: 503,
    userId: 'user_005',
    username: 'JaneDoe_x',
    points: 1000,
    amount: 10.0,
    method: 'PayPal',
    requestedAt: '2024-11-20 18:00',
    paidAt: '2024-11-21 10:00',
    status: 'Paid',
  },
  {
    id: 504,
    userId: 'user_020',
    username: 'Art_Lover',
    points: 500,
    amount: 5.0,
    method: 'Crypto Wallet',
    requestedAt: '2024-11-19 12:00',
    paidAt: '2024-11-20 09:00',
    status: 'Paid',
  },
  {
    id: 505,
    userId: 'user_015',
    username: 'Traveler_88',
    points: 3000,
    amount: 30.0,
    method: 'Skrill',
    requestedAt: '2024-11-25 11:00',
    status: 'Pending Review',
  },
  {
    id: 506,
    userId: 'user_025',
    username: 'TechFanatic',
    points: 800,
    amount: 8.0,
    method: 'Payoneer',
    requestedAt: '2024-11-22 10:00',
    paidAt: '2024-11-22 15:30',
    status: 'Paid',
  },
];

export const DUMMY_VERIFICATIONS: Verification[] = [
  {
    id: 101,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    requestedAt: '2024-11-20',
    photoUrl: 'https://placehold.co/100x100/1A1715/E1BA73?text=AJ',
  },
  {
    id: 102,
    name: 'Sarah Lee',
    email: 'sarah.lee@web.net',
    requestedAt: '2024-11-20',
    photoUrl: 'https://placehold.co/100x100/1A1715/E1BA73?text=SL',
  },
  {
    id: 103,
    name: 'Michael Chen',
    email: 'mchen@work.com',
    requestedAt: '2024-11-21',
    photoUrl: 'https://placehold.co/100x100/1A1715/E1BA73?text=MC',
  },
  {
    id: 104,
    name: 'David Smith',
    email: 'dsmith@corp.io',
    requestedAt: '2024-11-22',
    photoUrl: 'https://placehold.co/100x100/1A1715/E1BA73?text=DS',
  },
];

export const DUMMY_TASK_VERIFICATIONS: TaskVerification[] = [
  {
    id: 901,
    userId: 'user_030',
    username: 'NewStreamer',
    taskName: 'Submit 5-star rating on App Store',
    points: 500,
    submittedAt: '2024-11-26 10:00',
    proofUrl:
      'https://placehold.co/400x200/1A1715/E1BA73?text=App+Store+Screenshot',
  },
  {
    id: 902,
    userId: 'user_045',
    username: 'DesignFan',
    taskName: 'Share promotion on TikTok (Proof needed)',
    points: 1200,
    submittedAt: '2024-11-26 14:30',
    proofUrl:
      'https://placehold.co/400x200/1A1715/E1BA73?text=TikTok+Link+or+Screenshot',
  },
  {
    id: 903,
    userId: 'user_020',
    username: 'Art_Lover',
    taskName: 'Write a short blog post review',
    points: 800,
    submittedAt: '2024-11-27 09:15',
    proofUrl: 'https://placehold.co/400x200/1A1715/E1BA73?text=Blog+Post+URL',
  },
];

export const DUMMY_TASKS: TaskData = {
  follow: {
    youtube: [
      {
        id: 201,
        userId: 'user_001',
        username: 'CryptoGuru',
        points: 150,
        completedAt: '2024-11-25 10:30',
      },
      {
        id: 202,
        userId: 'user_005',
        username: 'JaneDoe_x',
        points: 150,
        completedAt: '2024-11-25 11:45',
      },
    ],
    facebook: [
      {
        id: 203,
        userId: 'user_010',
        username: 'CoolAdmin',
        points: 120,
        completedAt: '2024-11-25 12:01',
      },
    ],
    instagram: [
      {
        id: 204,
        userId: 'user_015',
        username: 'Traveler_88',
        points: 180,
        completedAt: '2024-11-25 14:22',
      },
      {
        id: 205,
        userId: 'user_020',
        username: 'Art_Lover',
        points: 180,
        completedAt: '2024-11-25 15:10',
      },
    ],
    twitter: [
      {
        id: 206,
        userId: 'user_025',
        username: 'TechFanatic',
        points: 100,
        completedAt: '2024-11-25 16:05',
      },
    ],
  },
  video: {
    watch: [
      {
        id: 301,
        userId: 'user_001',
        username: 'CryptoGuru',
        points: 50,
        completedAt: '2024-11-26 09:00',
      },
      {
        id: 302,
        userId: 'user_010',
        username: 'CoolAdmin',
        points: 50,
        completedAt: '2024-11-26 10:15',
      },
    ],
  },
  share: { youtube: [], facebook: [], instagram: [], twitter: [] },
};

export const DUMMY_USERS: User[] = [
  {
    id: 'user_001',
    name: 'CryptoGuru',
    totalPoints: 12000,
    isVerified: true,
    joined: '2024-10-01',
  },
  {
    id: 'user_005',
    name: 'JaneDoe_x',
    totalPoints: 8500,
    isVerified: true,
    joined: '2024-10-15',
  },
  {
    id: 'user_010',
    name: 'CoolAdmin',
    totalPoints: 15000,
    isVerified: true,
    joined: '2024-09-20',
  },
  {
    id: 'user_015',
    name: 'Traveler_88',
    totalPoints: 4200,
    isVerified: false,
    joined: '2024-11-01',
  },
  {
    id: 'user_020',
    name: 'Art_Lover',
    totalPoints: 9100,
    isVerified: true,
    joined: '2024-10-10',
  },
  {
    id: 'user_025',
    name: 'TechFanatic',
    totalPoints: 6300,
    isVerified: false,
    joined: '2024-11-05',
  },
];

export const DUMMY_LEADERBOARD: LeaderboardUser[] = DUMMY_USERS.sort(
  (a, b) => b.totalPoints - a.totalPoints
)
  .slice(0, 5)
  .map((user, index) => ({ ...user, rank: index + 1 }));
