import React, { useState } from 'react';
import { Activity, Award, Calendar, TrendingUp, Wallet } from 'lucide-react';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';

const TIME_RANGES = ['day', 'week', 'month', 'all'] as const;
type TimeRange = typeof TIME_RANGES[number];

interface StatCardProps {
  title: string;
  value: number | undefined;
  icon: React.FC<{ size?: number; className?: string }>;
  change?: number | null;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change }) => (
  <div className="bg-[#111008] rounded-xl border border-white/[0.07] p-5 hover:border-[#b68938]/20 transition-colors duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="p-2 rounded-lg bg-[#b68938]/10 border border-[#b68938]/15">
        <Icon size={15} className="text-[#e1ba73]" />
      </div>
      {change != null && (
        <span className={`text-xs font-semibold tabular-nums px-2 py-0.5 rounded-full ${
          change >= 0
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-red-500/10 text-red-400'
        }`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
    <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1.5">{title}</p>
    <p className="text-2xl font-bold text-white tabular-nums">
      {value != null ? value.toLocaleString() : '—'}
    </p>
    <p className="text-xs text-white/25 mt-0.5">coins</p>
  </div>
);

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const { taskUserID } = useTaskAuthStore();

  const { data: analyticsDataRes } = api.srkTask.getSrkTaskUserAnalytics.useQuery(
    ['getSrkTaskUserAnalytics', taskUserID],
    { params: { userId: taskUserID || '' } },
    { enabled: !!taskUserID, queryKey: ['getSrkTaskUserAnalytics', taskUserID || ''] }
  );

  const coins = analyticsDataRes?.body?.coinsData;
  const tasks = analyticsDataRes?.body?.tasksData;

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-white/40 mt-0.5">Track your coins and activity</p>
        </div>
        <div className="flex items-center gap-1 bg-[#111008] rounded-lg border border-white/[0.07] p-1">
          {TIME_RANGES.map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md capitalize transition-all duration-150 ${
                timeRange === range
                  ? 'bg-[#b68938]/20 text-[#e1ba73] shadow-[inset_0_0_0_1px_rgba(182,137,56,0.25)]'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {range === 'all' ? 'All time' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-2">
          <StatCard title="Wallet Balance" value={coins?.walletCoins} icon={Wallet} />
        </div>
        <StatCard title="Today" value={coins?.today} icon={Activity} change={coins?.todayChange} />
        <StatCard title="Last 7 Days" value={coins?.last7Days} icon={TrendingUp} change={coins?.last7DaysChange} />
        <div className="col-span-2">
          <StatCard title="Last 28 Days" value={coins?.last28Days} icon={Calendar} change={coins?.last28DaysChange} />
        </div>
        <div className="col-span-2">
          <StatCard title="All Time" value={coins?.allTimeCoins} icon={Award} />
        </div>
      </div>

      {/* Quick stats */}
      <div className="bg-[#111008] rounded-xl border border-white/[0.07]">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white">Quick Stats</h2>
        </div>
        <div className="divide-y divide-white/[0.04]">

          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-white/50">Completion rate</span>
            <div className="flex items-center gap-3">
              <div className="w-24 h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] rounded-full"
                  style={{ width: `${tasks?.taskCompletionRate ?? 0}%` }}
                />
              </div>
              <span className="text-sm font-bold text-white tabular-nums w-10 text-right">
                {tasks?.taskCompletionRate ?? 0}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-white/50">Average daily</span>
            <span className="text-sm font-bold text-[#e1ba73] tabular-nums">
              {tasks?.averageDailyCoins ?? 0} <span className="text-white/30 font-normal text-xs">coins</span>
            </span>
          </div>

          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-white/50">Peak day</span>
            <span className="text-sm font-bold text-white tabular-nums">
              {tasks?.peakDayCoins ?? 0} <span className="text-white/30 font-normal text-xs">coins</span>
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
