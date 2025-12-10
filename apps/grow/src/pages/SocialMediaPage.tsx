import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  UserCircle,
  LogOut,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Music2,
  MousePointer2,
  Target,
  Activity,
  Share2,
  LayoutDashboard,
  CheckCircle,
  Upload,
} from 'lucide-react';
import { PlatformData } from '../lib/types/types';

interface UserDashboardProps {
  onLogout?: () => void;
}

const SocialMediaGrow: React.FC<UserDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'profile' | 'taskuploading'
  >('analytics');
  const [taskType, setTaskType] = useState<'post' | 'video'>('post');
  const [postUrl, setPostUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Mock data for package limits and tasks
  const [packageLimits, setPackageLimits] = useState({
    posts: { used: 1, total: 5 },
    videos: { used: 0, total: 3 },
  });

  const [userTasks, setUserTasks] = useState({
    posts: [
      {
        id: '1',
        url: 'https://facebook.com/post/123',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
    ],
    videos: [],
  });

  const handleAddTask = () => {
    if (taskType === 'post' && postUrl.trim()) {
      if (packageLimits.posts.used >= packageLimits.posts.total) {
        alert('You have reached your post limit!');
        return;
      }
      const newPost = {
        id: Date.now().toString(),
        url: postUrl,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setUserTasks((prev) => ({
        ...prev,
        posts: [...prev.posts, newPost],
      }));
      setPackageLimits((prev) => ({
        ...prev,
        posts: { ...prev.posts, used: prev.posts.used + 1 },
      }));
      setPostUrl('');
    } else if (taskType === 'video' && videoUrl.trim()) {
      if (packageLimits.videos.used >= packageLimits.videos.total) {
        alert('You have reached your video limit!');
        return;
      }

      setPackageLimits((prev) => ({
        ...prev,
        videos: { ...prev.videos, used: prev.videos.used + 1 },
      }));
      setVideoUrl('');
    }
  };

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

  return (
    <div className="flex h-screen bg-[#0a0705] text-white overflow-hidden font-sans pt-[80px]">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-20 md:w-64 border-r border-white/10 flex flex-col bg-black/50 backdrop-blur-xl h-full fixed md:static left-0 top-[80px] z-50"
      >
        <nav className="flex-1 px-4 py-8 space-y-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#b68938]/20 text-[#e1ba73] border border-[#b68938]/30 shadow-lg'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <BarChart3 size={24} />
            <span className="font-medium hidden md:block">Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-[#b68938]/20 text-[#e1ba73] border border-[#b68938]/30 shadow-lg'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <UserCircle size={24} />
            <span className="font-medium hidden md:block">Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('taskuploading')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'taskuploading'
                ? 'bg-[#b68938]/20 text-[#e1ba73] border border-[#b68938]/30 shadow-lg'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <Upload size={24} />
            <span className="font-medium hidden md:block">Task Upload</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => onLogout?.()}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="font-medium hidden md:block">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 md:ml-20 relative">
        {/* Background Gradients */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#b68938]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#e1ba73]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {activeTab === 'analytics'
                ? 'Dashboard Overview'
                : activeTab === 'profile'
                ? 'My Profile'
                : 'Task Upload'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hidden md:block"></div>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center text-black font-bold text-lg md:text-xl"></div>
          </div>
        </header>

        {/* Analytics Tab Content */}
        {activeTab === 'analytics' && (
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
                    analyticsData.stats.targetClicks -
                    analyticsData.stats.totalClicks
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
                          <span className="font-medium text-lg">
                            {platform.name}
                          </span>
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
        )}

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-8 pb-8 border-b border-white/10">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center text-4xl font-bold text-black flex-shrink-0">
                  John
                </div>
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    John Doe
                  </h2>
                  <p className="text-gray-400 text-lg mb-4">
                    johndoe@gmail.com
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-bold uppercase">
                    <CheckCircle size={16} />
                    approved
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
                    Account ID
                  </label>
                  <div className="p-4 bg-white/5 rounded-2xl text-white font-mono text-sm border border-white/10">
                    03234234
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
                    Join Date
                  </label>
                  <div className="p-4 bg-white/5 rounded-2xl text-white text-sm border border-white/10"></div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
                    Country
                  </label>
                  <div className="p-4 bg-white/5 rounded-2xl text-white text-sm border border-white/10">
                    Nepal
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
                    Phone
                  </label>
                  <div className="p-4 bg-white/5 rounded-2xl text-white text-sm border border-white/10">
                    9843434343
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Task Upload Tab Content */}
        {activeTab === 'taskuploading' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 relative z-10"
          >
            {/* Package Limits Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Post Tasks
                    </h3>
                    <p className="text-sm text-gray-400">
                      Facebook, Instagram Posts
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#e1ba73]">
                      {packageLimits.posts.used}/{packageLimits.posts.total}
                    </div>
                    <p className="text-xs text-gray-500">Used/Total</p>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        (packageLimits.posts.used / packageLimits.posts.total) *
                        100
                      }%`,
                    }}
                    className="h-full bg-gradient-to-r from-[#b68938] to-[#e1ba73]"
                  />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Video Tasks
                    </h3>
                    <p className="text-sm text-gray-400">
                      YouTube, TikTok Videos
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#e1ba73]">
                      {packageLimits.videos.used}/{packageLimits.videos.total}
                    </div>
                    <p className="text-xs text-gray-500">Used/Total</p>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        (packageLimits.videos.used /
                          packageLimits.videos.total) *
                        100
                      }%`,
                    }}
                    className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Task Type Selector */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setTaskType('post')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    taskType === 'post'
                      ? 'bg-[#b68938] text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Share2 className="inline mr-2" size={20} />
                  Watch & Post/Share
                </button>
                <button
                  onClick={() => setTaskType('video')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    taskType === 'video'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Youtube className="inline mr-2" size={20} />
                  Watch Video
                </button>
              </div>

              {/* Add Task Form */}
              {taskType === 'post' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Post URL
                    </label>
                    <input
                      type="url"
                      value={postUrl}
                      onChange={(e) => setPostUrl(e.target.value)}
                      placeholder="https://facebook.com/post/..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#b68938] transition-all"
                    />
                  </div>
                  <button
                    onClick={handleAddTask}
                    disabled={
                      packageLimits.posts.used >= packageLimits.posts.total
                    }
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                      packageLimits.posts.used >= packageLimits.posts.total
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-[#b68938] text-white hover:bg-[#e1ba73] shadow-lg hover:shadow-[0_0_30px_rgba(182,137,56,0.4)]'
                    }`}
                  >
                    {packageLimits.posts.used >= packageLimits.posts.total
                      ? 'Post Limit Reached'
                      : 'Add Post Task'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleAddTask}
                    disabled={
                      packageLimits.videos.used >= packageLimits.videos.total
                    }
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                      packageLimits.videos.used >= packageLimits.videos.total
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                    }`}
                  >
                    {packageLimits.videos.used >= packageLimits.videos.total
                      ? 'Video Limit Reached'
                      : 'Add Video Task'}
                  </button>
                </div>
              )}
            </div>

            {/* Task Lists */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Posts List */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Share2 size={20} className="text-[#b68938]" />
                  Your Post Tasks ({userTasks.posts.length})
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {userTasks.posts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Share2 size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No post tasks yet. Add your first one!</p>
                    </div>
                  ) : (
                    userTasks.posts.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#b68938]/30 transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-[#b68938]">
                            POST #{index + 1}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                            {task.status}
                          </span>
                        </div>
                        <p className="text-sm text-white mb-2 break-all">
                          {task.url}
                        </p>
                        <p className="text-xs text-gray-500">
                          Added: {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SocialMediaGrow;
