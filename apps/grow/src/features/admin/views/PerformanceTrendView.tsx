import { DashboardData } from 'apps/grow/src/lib/types/admin';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { THEME } from '../constants/theme';

interface PerformanceTrendViewProps {
  data: DashboardData;
}

export const PerformanceTrendView: React.FC<PerformanceTrendViewProps> = ({
  data,
}) => {
  const maxRevenue = useMemo(
    () => Math.max(...data.trends.map((t) => t.revenue)),
    [data.trends]
  );

  const maxUsers = useMemo(
    () => Math.max(...data.trends.map((t) => t.users)),
    [data.trends]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>Performance Trends</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">Platform growth analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">
              Revenue Growth
            </h3>
            <div className="space-y-6">
              {data.trends.slice(-6).map((trend, index) => {
                const width = (trend.revenue / maxRevenue) * 100;

                return (
                  <motion.div
                    key={trend.month}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-16 text-right">
                      <span className="text-sm font-medium text-white">
                        {trend.month}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-emerald-400 font-medium">
                          ₹{trend.revenue}K
                        </span>
                        <span className="text-white font-bold">
                          +{(trend.revenue / 10).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ background: THEME.colors.goldGradient }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">User Growth</h3>
            <div className="space-y-6">
              {data.trends.slice(-6).map((trend, index) => {
                const width = (trend.users / maxUsers) * 100;

                return (
                  <motion.div
                    key={trend.month}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-16 text-right">
                      <span className="text-sm font-medium text-white">
                        {trend.month}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-blue-400 font-medium">
                          {trend.users} users
                        </span>
                        <span className="text-white font-bold">
                          +{(trend.users / 2).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: THEME.colors.blueInfo }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};
