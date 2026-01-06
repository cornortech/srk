import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { THEME } from '../constants/theme';
import { api } from '../../../lib/api';
import { useSRKAlert } from '@srk/shared/hooks';

const platformIcons: Record<string, string> = {
  Facebook: '📘',
  YouTube: '📺',
  Instagram: '📷',
  Twitter: '🐦',
  TikTok: '🎵',
};

export const TaskMonitoringView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const { show } = useSRKAlert();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: taskMonitoringResponse, isLoading, refetch } = api.grow.getTaskMonitoring.useQuery(
    ['taskMonitoring', debouncedSearch],
    {
      query: debouncedSearch ? { search: debouncedSearch } : undefined,
    }
  );

  const taskMonitoringData = taskMonitoringResponse?.status === 200 ? taskMonitoringResponse.body : [];

  // Toggle enrollment active status mutation
  const toggleEnrollmentMutation = api.grow.toggleEnrollmentActiveStatus.useMutation({
    onSuccess: (response) => {
      if (response.status === 200) {
        show(response.body.message, 'success');
        refetch(); // Refresh the data
      } else {
        show(response.body.message || 'Failed to toggle enrollment status', 'error');
      }
    },
    onError: (error: any) => {
      show(error?.message || 'Failed to toggle enrollment status', 'error');
    },
  });

  const handleTimeout = useCallback((enrollmentId: string) => {
    if (window.confirm('Are you sure you want to toggle the enrollment status?')) {
      toggleEnrollmentMutation.mutate({
        params: { enrollmentId },
        body: {},
      });
    }
  }, [toggleEnrollmentMutation]);

  // Auto-select first user
  useEffect(() => {
    if (taskMonitoringData.length > 0 && !selectedUserId) {
      setSelectedUserId(taskMonitoringData[0]._id);
    }
  }, [taskMonitoringData, selectedUserId]);

  // Reset selection if current user not found after search
  useEffect(() => {
    if (selectedUserId && !taskMonitoringData.find(u => u._id === selectedUserId)) {
      setSelectedUserId(taskMonitoringData.length > 0 ? taskMonitoringData[0]._id : null);
    }
  }, [taskMonitoringData, selectedUserId]);

  const currentUser = useMemo(() => {
    return taskMonitoringData.find(u => u._id === selectedUserId);
  }, [taskMonitoringData, selectedUserId]);

  const handleUserSelect = useCallback((userId: string) => {
    setSelectedUserId(userId);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'portalActivated':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'verificationPending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'portalDeactivated':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'portalActivated':
        return 'Active';
      case 'verificationPending':
        return 'Pending';
      case 'portalDeactivated':
        return 'Deactivated';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-6"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>Task Monitoring</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">
          Track and manage grow user's task completion
        </p>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - User List */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Search Grow Users
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <span className="text-gray-500">🔍</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Select Grow User ({taskMonitoringData.length})
                  </label>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400">Loading users...</p>
                      </div>
                    ) : taskMonitoringData.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No users found</p>
                      </div>
                    ) : (
                      taskMonitoringData.map((user, index) => (
                        <motion.button
                          key={user._id}
                          onClick={() => handleUserSelect(user._id)}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                            selectedUserId === user._id
                              ? 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-lg'
                              : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white truncate">
                                {user.fullName}
                              </p>
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                            <div className="text-right ml-2">
                              <div className="text-xl font-bold text-white">
                                {user.overallCompletionPercentage}%
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${user.overallCompletionPercentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-2 rounded-full"
                              style={{ background: THEME.colors.goldGradient }}
                            />
                          </div>
                        </motion.button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - User Details */}
            <div className="lg:col-span-2">
              {!currentUser ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-400">
                    Select a grow user to view task details
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* User Header */}
                  <div>
                    <motion.h2
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-2xl font-bold text-white"
                    >
                      {currentUser.fullName}
                    </motion.h2>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(
                          currentUser.status
                        )}`}
                      >
                        {getStatusLabel(currentUser.status)}
                      </span>
                      <span className="text-gray-400 text-sm">{currentUser.packageName}</span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">{currentUser.packageSubTypeName}</span>
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="text-white font-bold bg-gradient-to-r from-[#b68938]/20 to-[#e1ba73]/20 px-3 py-1 rounded-full text-sm"
                      >
                        {currentUser.overallCompletionPercentage}% Complete
                      </motion.span>
                    </div>
                  </div>

                  {/* User Actions */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTimeout(currentUser.enrollmentId)}
                      disabled={toggleEnrollmentMutation.isPending}
                      className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                        currentUser.isActive
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                          : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {toggleEnrollmentMutation.isPending ? (
                        <span>Processing...</span>
                      ) : (
                        <span>{currentUser.isActive ? '⏸️ Timeout (Deactivate)' : '▶️ Activate'}</span>
                      )}
                    </motion.button>
                  </div>

                  {/* Platform Badge */}
                  <div className="flex items-center gap-2 p-4 bg-white/5 rounded-xl">
                    <span className="text-3xl">{platformIcons[currentUser.platform]}</span>
                    <div>
                      <p className="text-sm text-gray-400">Platform</p>
                      <p className="text-white font-semibold">{currentUser.platform}</p>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="space-y-4">
                    {/* Follow Tasks Overview */}
                    {currentUser.tasks.follow.total > 0 && (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">👥</span>
                            <h3 className="text-lg font-bold text-white">Follow Tasks Overview</h3>
                          </div>
                          <span className="text-2xl font-bold text-white">
                            {currentUser.tasks.follow.percentage}%
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Total Progress</span>
                            <span className="text-white font-medium">
                              {currentUser.tasks.follow.completed} / {currentUser.tasks.follow.total}
                            </span>
                          </div>

                          <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${currentUser.tasks.follow.percentage}%` }}
                              transition={{ duration: 1 }}
                              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Individual Profile Cards for Follow */}
                    {currentUser.tasks.profiles && currentUser.tasks.profiles.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-300 px-2">Profiles to Follow ({currentUser.tasks.profiles.length})</h4>
                        {currentUser.tasks.profiles.map((profile, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-600/5 border border-blue-500/20"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-xl">👤</span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-bold text-white mb-1">Profile {index + 1}</h4>
                                  {profile.profileUrl && (
                                    <a
                                      href={profile.profileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-400 hover:text-blue-300 truncate block"
                                    >
                                      {profile.profileUrl}
                                    </a>
                                  )}
                                </div>
                              </div>
                              <span className="text-lg font-bold text-white ml-2">
                                {profile.percentage}%
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Followers</span>
                                <span className="text-white font-medium">
                                  {profile.followCounts} / {profile.totalRequired}
                                </span>
                              </div>

                              <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${profile.percentage}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                />
                              </div>

                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Remaining</span>
                                <span className="text-gray-400">
                                  {profile.totalRequired - profile.followCounts}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Overall Like Task Summary */}
                    {currentUser.tasks.like.total > 0 && (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">❤️</span>
                            <h3 className="text-lg font-bold text-white">Like Tasks Overview</h3>
                          </div>
                          <span className="text-2xl font-bold text-white">
                            {currentUser.tasks.like.percentage}%
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Total Progress</span>
                            <span className="text-white font-medium">
                              {currentUser.tasks.like.completed} / {currentUser.tasks.like.total}
                            </span>
                          </div>

                          <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${currentUser.tasks.like.percentage}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-pink-600"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Individual Video Cards */}
                    {currentUser.tasks.videos && currentUser.tasks.videos.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-300 px-2">Individual Videos ({currentUser.tasks.videos.length})</h4>
                        {currentUser.tasks.videos.map((video, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                            className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-xl">🎬</span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-bold text-white mb-1">Video {index + 1}</h4>
                                  {video.postUrl && (
                                    <a
                                      href={video.postUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-400 hover:text-blue-300 truncate block mb-1"
                                      title="Post URL"
                                    >
                                      📄 {video.postUrl}
                                    </a>
                                  )}
                                  {video.profileUrl && (
                                    <a
                                      href={video.profileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-purple-400 hover:text-purple-300 truncate block"
                                      title="Profile URL"
                                    >
                                      👤 {video.profileUrl}
                                    </a>
                                  )}
                                </div>
                              </div>
                              <span className="text-lg font-bold text-white ml-2">
                                {video.percentage}%
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Likes</span>
                                <span className="text-white font-medium">
                                  {video.likeCounts} / {video.totalRequired}
                                </span>
                              </div>

                              <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${video.percentage}%` }}
                                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                />
                              </div>

                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Remaining</span>
                                <span className="text-gray-400">
                                  {video.totalRequired - video.likeCounts}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Overall Progress Card */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-[#b68938]/10 to-[#e1ba73]/5 border border-[#b68938]/20"
                  >
                    <h3 className="text-lg font-bold text-white mb-4">Overall Progress</h3>
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Total Completion</p>
                        <p className="text-4xl font-bold text-white">
                          {currentUser.overallCompletionPercentage}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Enrollment Status</p>
                        <p className={`text-sm font-semibold ${currentUser.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                          {currentUser.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800/50 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${currentUser.overallCompletionPercentage}%` }}
                        transition={{ duration: 1.5 }}
                        className="h-4 rounded-full"
                        style={{ background: THEME.colors.goldGradient }}
                      />
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default TaskMonitoringView;
