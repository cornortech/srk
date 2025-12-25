import { mockQueueData } from '../../../data/adminMock';
import { DashboardData } from '../../../lib/types/admin';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { THEME } from '../constants/theme';

interface GlobalOverviewViewProps {
  data: DashboardData;
}

export const GlobalOverviewView: React.FC<GlobalOverviewViewProps> = ({
  data,
}) => {
  const stats = useMemo(
    () => [
      {
        label: 'Total Revenue',
        value: `₹${data.totalRevenue.toLocaleString()}`,
        trend: '+12.5%',
        description: 'Monthly growth',
        icon: '💰',
      },
      {
        label: 'Total Liability',
        value: `₹${data.totalLiability.toLocaleString()}`,
        trend: '-3.2%',
        description: 'Outstanding balance',
        icon: '📊',
      },
      {
        label: 'Active Affiliates',
        value: data.affiliateCount.toString(),
        trend: '+8',
        description: 'Active this month',
        icon: '👥',
      },
      {
        label: 'Pending Payouts',
        value: mockQueueData.payoutQueue.length.toString(),
        trend: '3 New',
        description: 'Awaiting processing',
        icon: '⏳',
      },
    ],
    [data.totalRevenue, data.totalLiability, data.affiliateCount]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white"
          >
            <GradientText>Global Overview</GradientText>
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 mt-2"
          >
            Real-time monitoring of platform performance
          </motion.p>
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-2 text-sm text-gray-400"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-emerald-500"
          />
          <span>Live Data</span>
          <span className="text-gray-500">•</span>
          <span>Updated just now</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <GlassCard key={stat.label} hover delay={index}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">
                    {stat.label}
                  </p>
                  <motion.p
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="text-3xl font-bold text-white"
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-[#b68938]/20 to-transparent"
                >
                  <span className="text-xl">{stat.icon}</span>
                </motion.div>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <span className="text-sm text-gray-500">
                  {stat.description}
                </span>
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    stat.trend.startsWith('+')
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {stat.trend}
                </motion.span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Performance Trends
                </h2>
                <p className="text-gray-400 text-sm">Revenue & User Growth</p>
              </div>
              <div className="relative">
                <select className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm appearance-none pr-8">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                  <option>All time</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-gray-400">▼</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {data.trends.slice(-6).map((trend, index) => (
                <motion.div
                  key={trend.month}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-16 text-right">
                    <span className="text-sm font-medium text-white">
                      {trend.month}
                    </span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400 font-medium">
                        Revenue: ₹{trend.revenue}K
                      </span>
                      <span className="text-white font-bold">
                        +{(trend.revenue / 10).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(trend.revenue / 420) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: THEME.colors.goldGradient }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-400 font-medium">
                        Users: {trend.users}
                      </span>
                      <span className="text-white font-bold">
                        +{(trend.users / 2).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(trend.users / 200) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 + 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: THEME.colors.blueInfo }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
