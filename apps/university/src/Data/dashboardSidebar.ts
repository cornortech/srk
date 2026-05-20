import {
  LucideIcon,
  Book,
  Users,
  Ban,
  Gift,
  Trophy,
  DollarSign,
  Receipt,
  Edit,
  CircleDollarSign,
  User,
  Banknote,
  Package,
  UserPlus,
  Video,
  GitPullRequest,
  Sparkle,
  BanknoteIcon,
  PiggyBankIcon,
  Undo2,
  Group,
  Settings,
  Activity,
} from 'lucide-react';

export type TSidebarItem = {
  title: string;
  icon: LucideIcon;
  href: string;
};

export const studySidebarItems: TSidebarItem[] = [
  { title: 'Courses', icon: Book, href: '/study/courses' },
  { title: 'Invoice', icon: Receipt, href: '/study/invoice' },
  { title: 'Edit Profile', icon: Edit, href: '/study/edit-profile' },
  { title: 'Affiliate Program', icon: Gift, href: '/study/affiliate-landing' },
];

export const getStudySidebarItems = (
  isAffiliateUser: boolean,
  purpose?: 'affiliate' | 'study'
): TSidebarItem[] => {

  const AffiliateProgramHref = isAffiliateUser
    ? '/affiliate'
    : '/study/affiliate-landing';

  const sidebarItem = [
    { title: 'Courses', icon: Book, href: '/study/courses' },
    { title: 'Invoice', icon: Receipt, href: '/study/invoice' },
    { title: 'Edit Profile', icon: Edit, href: '/study/edit-profile' },
    {
      title: 'Affiliate Program',
      icon: Gift,
      href: AffiliateProgramHref,
    },
    { title: 'SRK Grow Program', icon: Group, href: '/srkgrowportal' },
  ];

  if (purpose === 'study') {
    sidebarItem.unshift({
      title: 'Switch to Affiliate',
      icon: Undo2,
      href: 'switchToAffiliate',
    });
    sidebarItem.pop();
  }

  return sidebarItem;
};

export const getAffiliateSidebarItems = (
  allowToAddUser: boolean
): TSidebarItem[] => {
  const sidebarItem = [
    { title: 'Earning', icon: CircleDollarSign, href: '/affiliate/earning' },
    { title: 'Store', icon: Book, href: '/affiliate/courses' },
    { title: 'Bank & KYC', icon: Ban, href: '/affiliate/kyc' },
    { title: 'Referral', icon: Gift, href: '/affiliate/referral' },
    { title: 'Leaderboard', icon: Trophy, href: '/affiliate/leaderboard' },
    { title: 'Teams', icon: User, href: '/affiliate/teams' },
    {
      title: 'Srk Bonus Flow',
      icon: Banknote,
      href: '/affiliate/srk-bonus-flow',
    },
    { title: 'bank', icon: DollarSign, href: '/affiliate/bank' },
    { title: 'Payout', icon: DollarSign, href: '/affiliate/payout' },
    { title: 'target', icon: Package, href: '/affiliate/target' },
    // { title: "Rewards", icon: Gift, href: "/affiliate/rewards" },
    // { title: "Invoice", icon: Receipt, href: "/affiliate/invoice" },
    { title: 'Edit Profile', icon: Edit, href: '/affiliate/edit-profile' },
    { title: 'Webinar', icon: Video, href: '/affiliate/webinar' },
  ];

  if (allowToAddUser) {
    // sidebarItem.push({
    //   title: "Create Users",
    //   icon: UserPlus,
    //   href: "/affiliate/create-users",
    // });
  }
  return sidebarItem;
};

export const AdminSidebarItems: TSidebarItem[] = [
  { title: 'Earning', icon: CircleDollarSign, href: '/admin/earning' },
  { title: 'Courses', icon: Book, href: '/admin/courses' },
  { title: 'Create Courses', icon: Book, href: '/admin/courses/create' },
  { title: 'Create Users', icon: UserPlus, href: '/admin/create-users' },
  { title: 'Users', icon: Users, href: '/admin/lists-of-users' },
  {
    title: 'Affiliate Request',
    icon: GitPullRequest,
    href: '/admin/affiliate-request',
  },
  {
    title: 'Bank Details Request',
    icon: GitPullRequest,
    href: '/admin/bank-details-request',
  },
  {
    title: 'Balance Payout',
    icon: BanknoteIcon,
    href: '/admin/balance-payout',
  },
  {
    title: 'Payment verification',
    icon: BanknoteIcon,
    href: '/admin/payment-verification',
  },
  { title: 'Add Package', icon: Package, href: '/admin/add-packages' },
  { title: 'Srk Bank', icon: Banknote, href: '/admin/srkBank' },
  { title: 'Webinar', icon: Video, href: '/admin/webinar' },
  {
    title: 'Univeristy Bank',
    icon: PiggyBankIcon,
    href: '/admin/university-bank',
  },
  {
    title: 'Tour Target',
    icon: Sparkle,
    href: '/admin/target',
  },
  {
    title: 'Srk Bonus',
    icon: Sparkle,
    href: '/admin/srk-bonus',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
  {
    title: 'System Logs',
    icon: Activity,
    href: '/admin/logs',
  },
];

export const visitorSidebarItems: TSidebarItem[] = [
  { title: 'Home', icon: Book, href: '/' },
  { title: 'About us', icon: Gift, href: '/about' },
  { title: 'Packages', icon: User, href: '/packages' },
  { title: 'Contact Us', icon: UserPlus, href: '/contact' },
];
