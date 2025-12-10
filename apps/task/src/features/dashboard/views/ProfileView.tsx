import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Shield, Star, Trophy, Zap } from 'lucide-react';
import { DashboardView, UserProfile } from '../../../types/dashboard';
import { DashboardGlassCard } from './../../../components/ui/dashboard/DashboardGlassCard';
import MagneticButton from './../../../components/ui/dashboard/DashboardMagneticButton';
import DashboardGradientText from './../../../components/ui/dashboard/DashboardGradientText';
import DashboardStatusBadge from './../../../components/ui/dashboard/DashboardStatusBadge';

interface ProfileViewProps {
  isApproved: boolean;
  setDashView: (view: DashboardView) => void;
  profile: UserProfile;
  hasPurchased: boolean;
  completed: string[];
  analyticsData: any;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  isApproved,
  setDashView,
  profile,
  hasPurchased,
  completed,
  analyticsData,
}) => {
  if (!isApproved) {
    return (
      <DashboardGlassCard className="p-12 text-center">
        <Shield size={48} className="text-yellow-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-3">
          Verification Required
        </h3>
        <p className="text-zinc-400 mb-8">
          Complete identity verification to access profile features
        </p>
        <MagneticButton onClick={() => setDashView('verification')}>
          Go to Verification
        </MagneticButton>
      </DashboardGlassCard>
    );
  }

  const [socialLinks, _setSocialLinks] = useState(profile.socialLinks);
  console.log(socialLinks);
  const [isEditing, _setIsEditing] = useState(false);
  console.log(isEditing);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          <DashboardGradientText>Profile Settings</DashboardGradientText>
        </h1>
        <p className="text-zinc-400">
          Manage your profile, social links, and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info Card */}
          <DashboardGlassCard>
            <div className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full border-4 border-white/10"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-div-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                    <span className="text-black font-bold">
                      {profile.level}
                    </span>
                  </div>
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {profile.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <DashboardStatusBadge
                      status={isApproved ? 'Verified' : 'Pending'}
                    />
                    {hasPurchased && (
                      <DashboardStatusBadge status="SRK Grow" pulse />
                    )}
                    <DashboardStatusBadge status={`Level ${profile.level}`} />
                  </div>
                  <p className="text-zinc-400">
                    {profile.email} • {profile.phone}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    Member since {profile.joinDate}
                  </p>
                </div>
              </div>

              {/* XP Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Level Progress</span>
                  <span>
                    {profile.xp} / {profile.nextLevelXP} XP
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-div-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(profile.xp / profile.nextLevelXP) * 100}%`,
                    }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-xs text-zinc-500 text-center">
                  {profile.nextLevelXP - profile.xp} XP needed for Level{' '}
                  {profile.level + 1}
                </p>
              </div>
            </div>
          </DashboardGlassCard>
          {/* Social Media Links */}

          {/* Custom Task Request (SRK Grow Only) */}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <DashboardGlassCard>
            <div className="p-6">
              <h4 className="text-lg font-bold text-white mb-4">
                Account Stats
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Tasks Completed:</span>
                  <span className="text-white font-bold">
                    {completed.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Success Rate:</span>
                  <span className="text-green-400 font-bold">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Avg Daily Earn:</span>
                  <span className="text-amber-400 font-bold">
                    {analyticsData.averageDaily}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Earned:</span>
                  <span className="text-purple-400 font-bold">
                    {analyticsData.allTime} Coins
                  </span>
                </div>
              </div>
            </div>
          </DashboardGlassCard>

          <DashboardGlassCard>
            <div className="p-6">
              <h4 className="text-lg font-bold text-white mb-4">
                Achievements
              </h4>
              <div className="space-y-3">
                {[
                  { icon: Trophy, label: 'First Task', achieved: true },
                  { icon: Zap, label: '7 Day Streak', achieved: true },
                  { icon: Crown, label: 'Top 10', achieved: false },
                  { icon: Star, label: 'Perfect Week', achieved: true },
                ].map((achievement, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        achievement.achieved
                          ? 'bg-div-to-r from-amber-500/20 to-yellow-500/20'
                          : 'bg-zinc-800/50'
                      }`}
                    >
                      <achievement.icon
                        size={18}
                        className={
                          achievement.achieved
                            ? 'text-amber-400'
                            : 'text-zinc-600'
                        }
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
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Crown size={20} className="text-purple-400" />
                  <h4 className="text-lg font-bold text-white">
                    SRK Grow Benefits
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-zinc-300">
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
