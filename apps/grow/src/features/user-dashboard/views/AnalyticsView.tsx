import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MousePointer2,
  Target,
  Activity,
  Share2,
  LayoutDashboard,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Music2,
  Link as LinkIcon,
  ExternalLink,
  ThumbsUp,
  Heart,
  Plus,
  X,
  Check,
} from 'lucide-react';
import { PlatformData } from '../../../lib/types/types';
import useGrowAuthStore from '../../../store/useGrowAuthStore';
import { useToast } from '../../../lib/contexts/ToastContext';
import { api } from '../../../lib/api';

const analyticsData: {
  platforms: PlatformData[];
  stats: {
    totalClicks: number;
    targetClicks: number;
    shares: number;
    posts: number;
  };
} = {
  platforms: [
    {
      name: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      progress: 0,
      tasks: 0,
      completed: 0,
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: '#E4405F',
      progress: 0,
      tasks: 0,
      completed: 0,
    },
    {
      name: 'YouTube',
      icon: Youtube,
      color: '#FF0000',
      progress: 0,
      tasks: 0,
      completed: 0,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      progress: 0,
      tasks: 0,
      completed: 0,
    },
    {
      name: 'TikTok',
      icon: Music2,
      color: '#000000',
      progress: 0,
      tasks: 0,
      completed: 0,
    },
  ],
  stats: {
    totalClicks: 15420,
    targetClicks: 20000,
    shares: 450,
    posts: 89,
  },
};

export const AnalyticsView: React.FC = () => {
  const { user, setUser } = useGrowAuthStore();
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState('');
  const { showToast } = useToast();

  const { mutate: createTasks, isPending } =
    api.grow.createGrowSocialMediaTasks.useMutation({
      onSuccess: () => {
        showToast('Link added successfully', 'success');
        if (user && user.enrollmentData) {
          const updatedUser = {
            ...user,
            enrollmentData: {
              ...user.enrollmentData,
              engagementPostURLs: [
                ...(user.enrollmentData.engagementPostURLs || []),
                newLink,
              ],
            },
          };

          setUser(updatedUser);
          setNewLink('');
          setIsAddingLink(false);
        }
      },
      onError: (error: any) => {
        showToast(error.body.message || 'Failed to add link', 'error');
      },
    });

  const handleAddLink = () => {
    if (!newLink) return;

    if (!newLink.startsWith('http')) {
      showToast(
        'Please enter a valid URL starting with http:// or https://',
        'error'
      );
      return;
    }

    if (!user?.enrollmentData?.isActive) {
      showToast(
        'Your enrollment is not active yet. Please wait for approval.',
        'error'
      );
      return;
    }

    const enrollmentId = user?.enrollmentData?._id;

    if (!enrollmentId) {
      showToast(
        'Enrollment ID not found. Please reload or contact support.',
        'error'
      );
      return;
    }

    createTasks({
      body: {
        growSocialMediaPackageEnrollmentId: enrollmentId,
        postURLs: [newLink],
        profileLinkURLs: [],
      },
    });
  };
  const enrollmentData = user?.enrollmentData;
  const enrollmentPostUrls = user?.enrollmentData?.engagementPostURLs || [];
  const enrollmentPackageDetails = enrollmentData?.enrollmentPackageDetails;
  const enrolledPlatform = enrollmentPackageDetails?.socialMediaPlatform;
  const enrolledPackageSubType =
    enrollmentData?.enrollmentPackageDetails?.packageType?.packageSubType;

  const filteredPlatforms = analyticsData.platforms
    .filter((platform) =>
      enrolledPlatform
        ? platform.name.toLowerCase() === enrolledPlatform.toLowerCase()
        : true
    )
    .map((platform) => {
      if (
        enrolledPlatform &&
        platform.name.toLowerCase() === enrolledPlatform.toLowerCase() &&
        enrollmentPackageDetails
      ) {
        const subType = enrollmentPackageDetails.packageType.packageSubType;

        const target =
          subType.noOfFollowers ||
          subType.noOfLikes ||
          subType.noOfVideos ||
          platform.tasks;

        const completed = 0;

        const progress =
          target > 0 ? Math.round((completed / target) * 100) : 0;

        return {
          ...platform,
          tasks: target,
          completed,
          progress,
        };
      }
      return platform;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 relative z-10"
    >
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Clicks',
            value: analyticsData.stats.totalClicks.toLocaleString(),
            icon: MousePointer2,
            color: 'text-blue-400',
            sub: 'All time clicks',
          },
          {
            title: 'Target Clicks',
            value: analyticsData.stats.targetClicks.toLocaleString(),
            icon: Target,
            color: 'text-[#e1ba73]',
            sub: 'Goal for this month',
          },
          {
            title: 'Remaining',
            value: (
              analyticsData.stats.targetClicks - analyticsData.stats.totalClicks
            ).toLocaleString(),
            icon: Activity,
            color: 'text-red-400',
            sub: 'To reach goal',
          },
          {
            title: 'Total Shares',
            value: analyticsData.stats.shares.toLocaleString(),
            icon: Share2,
            color: 'text-green-400',
            sub: 'Across all platforms',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#b68938]/30 hover:shadow-[0_0_20px_rgba(182,137,56,0.2)] transition-all group"
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              {i === 2 && (
                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                  −23%
                </span>
              )}
              {i === 0 && (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                  +12%
                </span>
              )}
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-[#e1ba73] transition-colors">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-400">{stat.title}</p>
            <p className="text-xs text-gray-500 mt-2">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Task Completion Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Platform Progress List */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-[#b68938]" />
            Task Completion by Platform
          </h3>
          <div className="space-y-6">
            {filteredPlatforms.length > 0 ? (
              filteredPlatforms.map((platform, i) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-white/5`}
                        style={{ color: platform.color }}
                      >
                        <platform.icon size={20} />
                      </div>
                      <span className="font-medium text-lg">
                        {platform.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-300">
                      {platform.completed} /{' '}
                      {enrolledPackageSubType?.noOfFollowers
                        ? enrolledPackageSubType?.noOfFollowers
                        : enrolledPackageSubType?.noOfVideos}{' '}
                      Tasks
                    </span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${platform.progress}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full rounded-full relative"
                      style={{ backgroundColor: platform.color }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-500">
                      {platform.progress}% Completed
                    </span>
                  </div>
                  {/* Post Performance Section - Only for Reach/Engagement packages with Post URLs */}
                  {(enrollmentPackageDetails?.packageType?.packageSubType
                    ?.noOfLikes ||
                    enrollmentPackageDetails?.packageType?.packageSubType
                      ?.noOfVideos) && (
                    <div className="bg-gray-900/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-[#b68938]" />
                        Post Performance Analytics
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enrollmentPostUrls.map(
                          (postData, index: number) => {
                            // Handle both old format (string) and new format (object)
                            const isObject = typeof postData === 'object';
                            const urlString = isObject ? postData.url : postData;
                            const likesAcquired = isObject ? postData.likesAcquired : 0;
                            const likesTarget = isObject ? postData.likesTarget : (enrolledPackageSubType?.noOfLikes || 0);
                            const progress = isObject ? postData.progress : (likesTarget > 0 ? Math.round((likesAcquired / likesTarget) * 100) : 0);

                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-[#b68938]/30 transition-all group"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="p-2 bg-[#b68938]/10 text-[#e1ba73] rounded-lg">
                                    <LinkIcon size={16} />
                                  </div>
                                  <a
                                    href={urlString}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors"
                                  >
                                    <ExternalLink size={16} />
                                  </a>
                                </div>

                                <div className="mb-4">
                                  <p
                                    className="text-xs text-gray-500 mb-1 truncate block w-full font-mono"
                                    title={urlString}
                                  >
                                    {urlString}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-400 flex items-center gap-1">
                                    {[
                                      'instagram',
                                      'tiktok',
                                      'twitter',
                                    ].includes(
                                      enrollmentPackageDetails?.socialMediaPlatform?.toLowerCase() ||
                                        ''
                                    ) ? (
                                      <Heart size={14} />
                                    ) : (
                                      <ThumbsUp size={14} />
                                    )}
                                    Likes Target
                                  </span>
                                  <span className="text-sm font-bold text-white">
                                    {likesAcquired} / {likesTarget}
                                  </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{
                                      duration: 1.5,
                                      ease: 'easeOut',
                                    }}
                                    className="h-full rounded-full relative bg-[#b68938]"
                                  >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                  </motion.div>
                                </div>
                                <div className="text-right mt-1">
                                  <span className="text-[10px] text-gray-500">
                                    {progress}% Achieved
                                  </span>
                                </div>
                              </motion.div>
                            );
                          }
                        )}

                        {/* Add Post Link Button or Input Field */}
                        {enrollmentPackageDetails?.packageType?.packageSubType
                          ?.noOfVideos &&
                          enrollmentPostUrls.length <
                            enrollmentPackageDetails.packageType.packageSubType
                              .noOfVideos && (
                            <>
                              {!isAddingLink ? (
                                <motion.button
                                  layout
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setIsAddingLink(true)}
                                  className="bg-white/5 rounded-xl p-4 border border-dashed border-white/20 hover:border-[#b68938] hover:bg-[#b68938]/5 transition-all group flex flex-col items-center justify-center min-h-[160px] cursor-pointer"
                                >
                                  <div className="p-3 bg-white/5 rounded-full mb-3 group-hover:bg-[#b68938] group-hover:text-black transition-colors text-gray-400">
                                    <Plus size={24} />
                                  </div>
                                  <span className="font-bold text-white mb-1">
                                    Add Post Link
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {enrollmentPostUrls.length} /{' '}
                                    {
                                      enrollmentPackageDetails.packageType
                                        .packageSubType.noOfVideos
                                    }
                                  </span>
                                </motion.button>
                              ) : (
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="bg-white/5 rounded-xl p-6 border border-white/20 flex flex-col justify-center min-h-[160px]"
                                >
                                  <h4 className="text-sm font-bold text-white mb-3">
                                    Add New Post Link
                                  </h4>
                                  <input
                                    type="text"
                                    value={newLink}
                                    onChange={(e) => setNewLink(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#b68938] mb-3"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleAddLink();
                                      if (e.key === 'Escape')
                                        setIsAddingLink(false);
                                    }}
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => setIsAddingLink(false)}
                                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                      <X size={18} />
                                    </button>
                                    <button
                                      onClick={handleAddLink}
                                      disabled={!newLink || isPending}
                                      className="p-2 rounded-lg bg-[#b68938] text-black font-bold hover:bg-[#cca04e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Check size={18} />
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </>
                          )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-gray-400">
                No active platform enrollment found.
              </div>
            )}
          </div>
        </div>

        {/* Summary Circular Progress */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-white mb-8 w-full text-left">
            Overall Progress
          </h3>
          <div className="relative w-48 h-48 flex items-center justify-center mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="#b68938"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - 0.75)}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 88 * (1 - 0.75),
                }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-white">75%</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Total Success
              </span>
            </div>
          </div>
          <div className="mt-8 w-full space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Active Campaigns</span>
              <span className="text-white font-bold">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Spend</span>
              <span className="text-[#e1ba73] font-bold">₹24,500</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
