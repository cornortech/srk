import React from 'react';
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
} from 'lucide-react';
import { PlatformData } from '../../../lib/types/types';

export const analyticsData: {
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
      progress: 85,
      tasks: 120,
      completed: 102,
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: '#E4405F',
      progress: 62,
      tasks: 200,
      completed: 124,
    },
    {
      name: 'YouTube',
      icon: Youtube,
      color: '#FF0000',
      progress: 45,
      tasks: 50,
      completed: 22,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      progress: 90,
      tasks: 80,
      completed: 72,
    },
    {
      name: 'TikTok',
      icon: Music2,
      color: '#000000',
      progress: 30,
      tasks: 150,
      completed: 45,
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
            {analyticsData.platforms.map((platform, i) => (
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
                    <span className="font-medium text-lg">{platform.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-300">
                    {platform.completed} / {platform.tasks} Tasks
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
              </motion.div>
            ))}
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
