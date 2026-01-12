import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Crown,
  Edit2,
  Loader2,
  Save,
  Shield,
  Star,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { AnalyticsData, DashboardView, UserProfile } from '../types';
import { DashboardGlassCard } from '../components/ui/DashboardGlassCard';
import MagneticButton from '../components/ui/DashboardMagneticButton';
import DashboardGradientText from '../components/ui/DashboardGradientText';
import DashboardStatusBadge from '../components/ui/DashboardStatusBadge';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';
import { Toaster } from 'sonner';
import { useToast } from '../../../lib/contexts/ToastContext';
import { useQueryClient } from '@tanstack/react-query';

interface ProfileViewProps {
  isApproved: boolean;
  setDashView: (view: DashboardView) => void;
  profile: Omit<
    UserProfile,
    'avatar' | 'level' | 'xp' | 'nextLevelXP' | 'socialLinks'
  > | null;
  hasPurchased: boolean;
  completed: string[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  isApproved,
  setDashView,
  profile,
  hasPurchased,
  completed,
}) => {
  const { taskUserID } = useTaskAuthStore();
  const { showToast } = useToast();

  const queryClient = useQueryClient();

  const { data: analyticsDataRes } =
    api.srkTask.getSrkTaskUserAnalytics.useQuery(
      ['getSrkTaskUserAnalytics', taskUserID],
      { params: { userId: taskUserID || '' } },
      { enabled: !!taskUserID, queryKey: ['getSrkTaskUserAnalytics'] }
    );

  const { data: userProfileData, isLoading: isProfileLoading } =
    api.srkTask.getSrkTaskUserProfile.useQuery(
      ['getSrkTaskUserProfile', taskUserID],
      { params: { userId: taskUserID || '' } },
      { enabled: !!taskUserID, queryKey: ['getSrkTaskUserProfile'] }
    );

  const updateProfileMutation = api.srkTask.updateProfile.useMutation({
    onSuccess: () => {
      showToast('Profile updated successfully', 'success');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['getSrkTaskUserProfile'] });
    },
    onError: (error: any) => {
      showToast(error.body?.message || 'Failed to update profile', 'error');
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (userProfileData?.body?.userData) {
      setFormData({
        fullName: userProfileData?.body?.userData?.fullName,
        email: userProfileData?.body?.userData?.email,
        phone: userProfileData?.body?.userData?.phone,
      });
    }
  }, [userProfileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!taskUserID) return;
    updateProfileMutation.mutate({
      params: { userId: taskUserID },
      body: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userProfileData?.body?.userData) {
      setFormData({
        fullName: userProfileData.body.userData.fullName || '',
        email: userProfileData.body.userData.email || '',
        phone: userProfileData.body.userData.phone || '',
      });
    }
  };

  if (!isApproved) {
    return (
      <DashboardGlassCard className="p-6 sm:p-12 text-center">
        <Shield size={48} className="text-yellow-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-3">
          Verification Required
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 mb-8">
          Complete identity verification to access profile features
        </p>
        <MagneticButton onClick={() => setDashView('verification')}>
          Go to Verification
        </MagneticButton>
      </DashboardGlassCard>
    );
  }

  // const [socialLinks, _setSocialLinks] = useState(profile?.socialLinks);

  const displayData = userProfileData?.body?.userData || {
    fullName: profile?.name,
    email: profile?.email,
    phone: profile?.phone,
    createdAt: profile?.joinDate,
  };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
            <DashboardGradientText>Profile Settings</DashboardGradientText>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            Manage your profile, social links, and preferences
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-white/10 transition-colors"
          >
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info Card */}
          <DashboardGlassCard>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-4 sm:p-6 mb-6 sm:mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative flex-shrink-0 mx-auto sm:mx-0"
                >
                  <img
                    //TODO: kyc Image URL
                    // src={profile?.avatar}
                    src={`https://ui-avatars.com/api/?name=${displayData.fullName}&background=random`}
                    alt={profile?.name}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-white/10"
                  />
                  {/* <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-div-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                    <span className="text-black font-bold">
                      {profile?.level}
                    </span>
                  </div> */}
                </motion.div>
                <div className="flex-1 w-full">
                  {isEditing ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-zinc-500 mb-1 block">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-zinc-500 mb-1 block">
                            Phone
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleSave}
                          disabled={updateProfileMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {updateProfileMutation.isPending ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Save size={16} />
                          )}
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={updateProfileMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">
                        {displayData.fullName}
                      </h3>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                        <DashboardStatusBadge
                          status={isApproved ? 'Verified' : 'Pending'}
                        />
                        {hasPurchased && (
                          <DashboardStatusBadge status="SRK Grow" pulse />
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-zinc-400 justify-center sm:justify-start">
                        <span>{displayData.email}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{displayData.phone}</span>
                      </div>

                      <p className="text-xs text-zinc-500 mt-2">
                        Member since{' '}
                        {new Date(
                          displayData.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DashboardGlassCard>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <DashboardGlassCard>
            <div className="p-4 sm:p-6">
              <h4 className="text-lg font-bold text-white mb-4">
                Account Stats
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-zinc-400">
                    Tasks Completed:
                  </span>
                  <span className="text-white font-bold">
                    {completed.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-zinc-400">
                    Success Rate:
                  </span>
                  <span className="text-green-400 font-bold">
                    {Math.round(userProfileData?.body?.taskData?.successRate!)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-zinc-400">
                    Avg Daily Earn:
                  </span>
                  <span className="text-amber-400 font-bold">
                    {analyticsDataRes?.body?.tasksData?.averageDailyCoins}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-zinc-400">
                    Total Earned:
                  </span>
                  <span className="text-purple-400 font-bold">
                    {analyticsDataRes?.body?.coinsData?.allTimeCoins} Coins
                  </span>
                </div>
              </div>
            </div>
          </DashboardGlassCard>

          <DashboardGlassCard>
            <div className="p-4 sm:p-6">
              <h4 className="text-lg font-bold text-white mb-4">
                Achievements
              </h4>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { icon: Trophy, label: 'First Task', achieved: true },
                  { icon: Zap, label: '7 Day Streak', achieved: true },
                  { icon: Crown, label: 'Top 10', achieved: false },
                  { icon: Star, label: 'Perfect Week', achieved: true },
                ].map((achievement, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                        achievement.achieved
                          ? 'bg-div-to-r from-amber-500/20 to-yellow-500/20'
                          : 'bg-zinc-800/50'
                      }`}
                    >
                      <achievement.icon
                        size={16}
                        className={`size-[18px] ${
                          achievement.achieved
                            ? 'text-amber-400'
                            : 'text-zinc-600'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {achievement.label}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {achievement.achieved ? 'Achieved' : 'Locked'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardGlassCard>

          {hasPurchased && (
            <DashboardGlassCard gradient="purple">
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Crown size={20} className="text-purple-400" />
                  <h4 className="text-lg font-bold text-white">
                    SRK Grow Benefits
                  </h4>
                </div>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-purple-400" />
                    Priority task approval
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-purple-400" />
                    Higher coin rewards
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-purple-400" />
                    Custom task requests
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-purple-400" />
                    Advanced analytics
                  </li>
                </ul>
              </div>
            </DashboardGlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
