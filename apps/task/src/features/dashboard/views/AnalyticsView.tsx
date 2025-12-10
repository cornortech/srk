import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Award, Calendar, TrendingUp, Wallet } from 'lucide-react';
import { DashboardGlassCard } from './../../../components/ui/dashboard/DashboardGlassCard';
import DashboardGradientText from './../../../components/ui/dashboard/DashboardGradientText';
import { analyticsData } from '../../../data/dashboard';

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'all'>(
    'week'
  );
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

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
          <div
            className={`flex items-center gap-1 text-sm ${
              change >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </div>
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
            value={analyticsData.totalCoins}
            icon={Wallet}
            change={12.5}
            gradient="gold"
          />
        </div>
        <div>
          <StatCard
            title="Today"
            value={analyticsData.today}
            icon={Activity}
            change={8.2}
            gradient="blue"
          />
        </div>
        <div>
          <StatCard
            title="7 Days"
            value={analyticsData.last7Days}
            icon={TrendingUp}
            change={15.3}
            gradient="green"
          />
        </div>
        <div className="md:col-span-2">
          <StatCard
            title="28 Days"
            value={analyticsData.last28Days}
            icon={Calendar}
            change={22.7}
            gradient="purple"
          />
        </div>
        <div className="md:col-span-2">
          <StatCard
            title="All Time"
            value={analyticsData.allTime}
            icon={Award}
            change={45.8}
            gradient="gold"
          />
        </div>
      </div>

      {/* Detailed Analytics Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Activity Graph */}
        <DashboardGlassCard className="lg:col-span-2">
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
                  </div>

                  {/* Tooltip on hover */}
                  {hoveredBar === index && (
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
        </DashboardGlassCard>

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
                          width: `${analyticsData.completionRate}%`,
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                    <span className="text-white font-medium">
                      {analyticsData.completionRate}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Average Daily</span>
                  <span className="text-white font-medium">
                    {analyticsData.averageDaily} Coins
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Peak Day</span>
                  <span className="text-amber-400 font-medium">
                    {analyticsData.peakDay.coins} Coins
                  </span>
                </div>
              </div>
            </div>
          </DashboardGlassCard>

          <DashboardGlassCard>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">
                Recent History
              </h3>
              <div className="space-y-4 max-h-48 overflow-y-auto">
                {analyticsData.history.map((day, index) => (
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
          </DashboardGlassCard>
        </div>
      </div>
    </div>
  );
};
