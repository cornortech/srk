import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Award, Calendar, TrendingUp, Wallet } from 'lucide-react';
import { DashboardGlassCard } from '../components/ui/DashboardGlassCard';
import DashboardGradientText from '../components/ui/DashboardGradientText';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'all'>(
    'week'
  );
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const { taskUserID } = useTaskAuthStore();

  const { data: analyticsDataRes } =
    api.srkTask.getSrkTaskUserAnalytics.useQuery(
      ['getSrkTaskUserAnalytics', taskUserID],
      { params: { userId: taskUserID || '' } }
    );

  const StatCard = ({ title, value, icon: Icon, change, gradient }: any) => (
    <DashboardGlassCard hover gradient={gradient}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="w-12 h-12 rounded-xl bg-div-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon size={24} className="text-amber-400" />
          </motion.div>
          {change && (
            <div
              className={`flex items-center gap-1 text-sm ${
                change >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </div>
          )}
        </div>
        <p className="text-sm text-zinc-400 mb-2">{title}</p>
        <motion.p
          key={value}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-bold text-white"
        >
          {value.toLocaleString()} Coins
        </motion.p>
      </div>
    </DashboardGlassCard>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <DashboardGradientText>Performance Analytics</DashboardGradientText>
          </h1>
          <p className="text-zinc-400">
            Track your earnings and activity in real-time
          </p>
        </div>
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-div-to-r from-amber-500/20 to-yellow-500/20 text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <StatCard
            title="Wallet Coins"
            value={analyticsDataRes?.body?.coinsData?.walletCoins}
            icon={Wallet}
            change={null}
            gradient="gold"
          />
        </div>
        <div>
          <StatCard
            title="Today"
            value={analyticsDataRes?.body?.coinsData?.today}
            icon={Activity}
            change={analyticsDataRes?.body?.coinsData?.todayChange}
            gradient="blue"
          />
        </div>
        <div>
          <StatCard
            title="7 Days"
            value={analyticsDataRes?.body?.coinsData?.last7Days}
            icon={TrendingUp}
            change={analyticsDataRes?.body?.coinsData?.last7DaysChange}
            gradient="green"
          />
        </div>
        <div className="md:col-span-2">
          <StatCard
            title="28 Days"
            value={analyticsDataRes?.body?.coinsData?.last28Days}
            icon={Calendar}
            change={analyticsDataRes?.body?.coinsData?.last28DaysChange}
            gradient="purple"
          />
        </div>
        <div className="md:col-span-2">
          <StatCard
            title="All Time"
            value={analyticsDataRes?.body?.coinsData?.allTimeCoins}
            icon={Award}
            change={null}
            gradient="gold"
          />
        </div>
      </div>

      {/* Detailed Analytics Grid */}
      {/* <div className="grid lg:grid-cols-3 gap-8"> */}
      {/* Activity Graph */}
      {/* <DashboardGlassCard className="lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">
              Activity Graph
            </h3>
            <div className="h-48 flex items-end justify-between gap-1">
              {analyticsData.activityGraph.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ duration: 1, delay: index * 0.05 }}
                  className="flex-1 relative group"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div
                    className={`w-full bg-div-to-t from-amber-500 to-yellow-500 rounded-t-lg transition-all duration-300 ${
                      hoveredBar === index ? 'opacity-100' : 'opacity-80'
                    }`}
                    style={{ height: `${value}%` }}
                  >
                    <div className="absolute inset-0 bg-div-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div> */}

      {/* Tooltip on hover */}
      {/* {hoveredBar === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 px-3 py-2 rounded-lg shadow-lg z-10"
                    >
                      <p className="text-xs text-white whitespace-nowrap">
                        Day {index + 1}: {value} Coins
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-zinc-500 mt-4">
              <span>Day 1</span>
              <span>Day 6</span>
              <span>Day 12</span>
            </div>
          </div>
        </DashboardGlassCard> */}

      {/* Stats & History */}
      <div className="space-y-6">
        <DashboardGlassCard>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Completion Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${analyticsDataRes?.body?.tasksData?.taskCompletionRate}%`,
                      }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-white font-medium">
                    {analyticsDataRes?.body?.tasksData?.taskCompletionRate}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Average Daily</span>
                <span className="text-white font-medium">
                  {analyticsDataRes?.body?.tasksData?.averageDailyCoins} Coins
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Peak Day</span>
                <span className="text-amber-400 font-medium">
                  {analyticsDataRes?.body?.tasksData?.peakDayCoins} Coins
                </span>
              </div>
            </div>
          </div>
        </DashboardGlassCard>

        {/* <DashboardGlassCard>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">
              Recent History
            </h3>
            <div className="space-y-4 max-h-48 overflow-y-auto">
              {analyticsDataRes?.body?.coinsData?.history.map((day, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-div-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                      <Calendar size={14} className="text-amber-400" />
                    </div>
                    <span className="text-zinc-400">{day.date}</span>
                  </div>
                  <span className="text-white font-medium">
                    +{day.coins} Coins
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </DashboardGlassCard> */}
      </div>
      {/* </div> */}
    </div>
  );
};
