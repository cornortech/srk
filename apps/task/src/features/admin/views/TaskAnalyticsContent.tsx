import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { CARD_BG, GOLD_PRIMARY, GOLD_ACCENT } from '../constants/theme';
import { api } from '../../../lib/api';

type TimeRange = 'today' | 'last7Days' | 'last30Days' | 'total';

const TIME_RANGE_TABS: { key: TimeRange; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'last7Days', label: '7 Days' },
  { key: 'last30Days', label: '30 Days' },
  { key: 'total', label: 'All Time' },
];

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  bgColorClass: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  colorClass,
  bgColorClass,
  delay,
}) => (
  <motion.div
    className="flex flex-col gap-3 p-5 rounded-xl border border-gray-700/50"
    style={{ background: CARD_BG }}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
  >
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColorClass}`}>
        {icon}
      </div>
    </div>
    <p className={`text-4xl font-extrabold ${colorClass}`}>
      {value.toLocaleString()}
    </p>
  </motion.div>
);

export const TaskAnalyticsContent: React.FC = React.memo(() => {
  const [activeRange, setActiveRange] = useState<TimeRange>('today');

  const { data, isLoading, error, refetch, isFetching } =
    api.srkTask.getSrkTaskSubmissionAnalyticsForAdmin.useQuery(
      ['srkTaskSubmissionAnalytics'],
      {}
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E1BA73]" />
        <span className="ml-3 text-gray-400">Loading analytics...</span>
      </div>
    );
  }

  if (error || !data?.body?.data) {
    return (
      <div className="text-center p-10 text-red-400">
        Failed to load analytics. Please try again.
      </div>
    );
  }

  const analytics = data.body.data;
  const counts = analytics[activeRange];
  const approvalRate =
    counts.all > 0 ? Math.round((counts.approved / counts.all) * 100) : 0;
  const rejectionRate =
    counts.all > 0 ? Math.round((counts.rejected / counts.all) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E1BA73]/30 pb-4">
        <div className="flex items-center gap-3">
          <BarChart3 size={28} style={{ color: GOLD_PRIMARY }} />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Task Submission Analytics
            </h2>
            <p className="text-sm text-gray-400">
              Overview of approved, rejected and pending submissions
            </p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm transition-colors"
        >
          <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Time Range Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl border border-gray-700/50 w-full sm:w-fit"
        style={{ background: CARD_BG }}
      >
        {TIME_RANGE_TABS.map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveRange(tab.key)}
            className={`flex-1 px-4 py-2 rounded-lg font-bold uppercase text-sm transition-colors ${
              activeRange === tab.key
                ? 'text-black'
                : 'text-gray-400 hover:text-white'
            }`}
            style={
              activeRange === tab.key
                ? { background: `linear-gradient(45deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})` }
                : {}
            }
            whileHover={{ scale: 1.02 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Approved"
          value={counts.approved}
          icon={<CheckCircle2 size={20} className="text-green-400" />}
          colorClass="text-green-400"
          bgColorClass="bg-green-500/10"
          delay={0}
        />
        <StatCard
          label="Rejected"
          value={counts.rejected}
          icon={<XCircle size={20} className="text-red-400" />}
          colorClass="text-red-400"
          bgColorClass="bg-red-500/10"
          delay={0.05}
        />
        <StatCard
          label="Pending"
          value={counts.pending}
          icon={<Clock size={20} className="text-yellow-400" />}
          colorClass="text-yellow-400"
          bgColorClass="bg-yellow-500/10"
          delay={0.1}
        />
        <StatCard
          label="Total Submissions"
          value={counts.all}
          icon={<Layers size={20} style={{ color: GOLD_PRIMARY }} />}
          colorClass=""
          bgColorClass="bg-yellow-900/20"
          delay={0.15}
        />
      </div>

      {/* Breakdown Bar */}
      {counts.all > 0 && (
        <motion.div
          className="p-5 rounded-xl border border-gray-700/50 space-y-4"
          style={{ background: CARD_BG }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Submission Breakdown
          </h3>

          {/* Stacked bar */}
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-gray-800">
            {counts.approved > 0 && (
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${approvalRate}%` }}
                title={`Approved: ${approvalRate}%`}
              />
            )}
            {counts.rejected > 0 && (
              <div
                className="h-full bg-red-500 transition-all duration-500"
                style={{ width: `${rejectionRate}%` }}
                title={`Rejected: ${rejectionRate}%`}
              />
            )}
            {counts.pending > 0 && (
              <div
                className="h-full bg-yellow-500 transition-all duration-500 flex-1"
                title="Pending"
              />
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-300">
                Approved <span className="font-bold text-green-400">{approvalRate}%</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-300">
                Rejected <span className="font-bold text-red-400">{rejectionRate}%</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-gray-300">
                Pending{' '}
                <span className="font-bold text-yellow-400">
                  {counts.all > 0
                    ? Math.round((counts.pending / counts.all) * 100)
                    : 0}
                  %
                </span>
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* All-time summary row */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
      >
        {(
          [
            {
              period: 'Today',
              data: analytics.today,
              accent: 'border-l-4 border-l-blue-500',
            },
            {
              period: 'Last 7 Days',
              data: analytics.last7Days,
              accent: 'border-l-4 border-l-purple-500',
            },
            {
              period: 'Last 30 Days',
              data: analytics.last30Days,
              accent: 'border-l-4 border-l-orange-500',
            },
          ] as const
        ).map(({ period, data: d, accent }) => (
          <div
            key={period}
            className={`p-4 rounded-xl border border-gray-700/50 ${accent}`}
            style={{ background: CARD_BG }}
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {period}
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Approved</span>
                <span className="font-bold text-green-400">
                  {d.approved.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rejected</span>
                <span className="font-bold text-red-400">
                  {d.rejected.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pending</span>
                <span className="font-bold text-yellow-400">
                  {d.pending.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-700/50 pt-1.5 mt-1.5">
                <span className="text-gray-300 font-semibold">Total</span>
                <span className="font-bold" style={{ color: GOLD_PRIMARY }}>
                  {d.all.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
});
