import React from 'react';
import { Check, Crown, Shield, Star, Trophy, Zap } from 'lucide-react';
import { AnalyticsData, DashboardView, UserProfile } from '../types';
import DashboardStatusBadge from '../components/ui/DashboardStatusBadge';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';

interface ProfileViewProps {
  isApproved: boolean;
  setDashView: (view: DashboardView) => void;
  profile: Omit<UserProfile, 'avatar' | 'level' | 'xp' | 'nextLevelXP' | 'socialLinks'> | null;
  hasPurchased: boolean;
  completed: string[];
}

const achievements = [
  { icon: Trophy, label: 'First task', achieved: true },
  { icon: Zap, label: '7-day streak', achieved: true },
  { icon: Crown, label: 'Top 10', achieved: false },
  { icon: Star, label: 'Perfect week', achieved: true },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  isApproved,
  setDashView,
  profile,
  hasPurchased,
  completed,
}) => {
  const { taskUserID } = useTaskAuthStore();

  const { data: analyticsDataRes } = api.srkTask.getSrkTaskUserAnalytics.useQuery(
    ['getSrkTaskUserAnalytics', taskUserID],
    { params: { userId: taskUserID || '' } }
  );

  const { data: userProfileData } = api.srkTask.getSrkTaskUserProfile.useQuery(
    ['getSrkTaskUserProfile', taskUserID],
    { params: { userId: taskUserID || '' } }
  );

  if (!isApproved) {
    return (
      <div className="border border-white/[0.08] p-12 text-center max-w-lg">
        <div className="w-10 h-10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5">
          <Shield size={18} className="text-amber-400" />
        </div>
        <h3 className="text-base font-semibold text-white mb-2">
          Verification required
        </h3>
        <p className="text-sm text-white/40 mb-6">
          Complete identity verification to access profile features
        </p>
        <button
          onClick={() => setDashView('verification')}
          className="px-5 py-2.5 bg-primary text-black text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Go to verification
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-2">
          Account
        </p>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Profile
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">

          {/* Profile card */}
          <div className="border border-white/[0.08] bg-bgSecondary/40">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Profile info</h3>
            </div>
            <div className="p-6 flex items-start gap-5">
              <div className="w-14 h-14 border border-white/[0.1] bg-white/[0.04] flex items-center justify-center flex-shrink-0 text-xl font-semibold text-white/50">
                {profile?.name?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white mb-2 truncate">
                  {profile?.name ?? '—'}
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <DashboardStatusBadge status={isApproved ? 'Verified' : 'Pending'} />
                  {hasPurchased && <DashboardStatusBadge status="SRK Grow" />}
                </div>
                <p className="text-sm text-white/40">
                  {profile?.email}
                  {profile?.phone && ` · ${profile.phone}`}
                </p>
                {profile?.joinDate && (
                  <p className="text-xs text-white/25 mt-1">
                    Member since {profile.joinDate}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Account stats */}
          <div className="border border-white/[0.08] bg-bgSecondary/40">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h4 className="text-sm font-semibold text-white">Account stats</h4>
            </div>
            <div className="divide-y divide-white/[0.04]">
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-white/50">Tasks completed</span>
                <span className="text-sm font-semibold text-white tabular-nums">{completed.length}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-white/50">Success rate</span>
                <span className="text-sm font-semibold text-emerald-400 tabular-nums">
                  {Math.round(userProfileData?.body?.taskData?.successRate ?? 0)}%
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-white/50">Avg daily</span>
                <span className="text-sm font-semibold text-primary tabular-nums">
                  {analyticsDataRes?.body?.tasksData?.averageDailyCoins ?? 0}
                  <span className="text-white/30 font-normal ml-1 text-xs">coins</span>
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-white/50">All time</span>
                <span className="text-sm font-semibold text-white tabular-nums">
                  {analyticsDataRes?.body?.coinsData?.allTimeCoins?.toLocaleString() ?? 0}
                  <span className="text-white/30 font-normal ml-1 text-xs">coins</span>
                </span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="border border-white/[0.08] bg-bgSecondary/40">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h4 className="text-sm font-semibold text-white">Achievements</h4>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {achievements.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.label} className="flex items-center gap-3 px-5 py-3.5">
                    <div
                      className={`w-7 h-7 border flex items-center justify-center flex-shrink-0 ${
                        a.achieved ? 'border-primary/30 text-primary' : 'border-white/[0.06] text-white/20'
                      }`}
                    >
                      <Icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${a.achieved ? 'text-white/85' : 'text-white/30'}`}>
                        {a.label}
                      </p>
                    </div>
                    <span className={`text-xs ${a.achieved ? 'text-primary/60' : 'text-white/20'}`}>
                      {a.achieved ? 'Earned' : 'Locked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SRK Grow benefits */}
          {hasPurchased && (
            <div className="border border-primary/20 bg-primary/[0.04] p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <Crown size={15} className="text-primary flex-shrink-0" />
                <h4 className="text-sm font-semibold text-white">SRK Grow benefits</h4>
              </div>
              <ul className="space-y-2">
                {[
                  'Priority task approval',
                  'Higher coin rewards',
                  'Custom task requests',
                  'Advanced analytics',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2.5 text-sm text-white/55">
                    <Check size={12} className="text-primary/70 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
