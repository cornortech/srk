import {
  CardVariant,
  DashboardData,
  ToastType,
} from 'apps/grow/src/lib/types/dashboard';
import { SparklesIcon, TrendingUpIcon, WalletIcon } from 'lucide-react';
import { GOLD_ACCENT, GOLD_PRIMARY, INFO, SUCCESS } from '../constants';
import { WithdrawIcon } from '../components/ui/DashboardIcons';
import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { formatRupees } from '../../../lib/utils/formatters';
import { api } from '../../../lib/api';

interface DashboardViewProps {
  userID: string;
  data: DashboardData;
  showToast: (message: string, type?: ToastType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userID,
  data,
  showToast,
}) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const { data: getAffiliateUserDashboardStats, isLoading } =
    api.growAffiliate.getGrowAffiliateUserComissionEarningsDashboard.useQuery(
      ['affiliatedUserDashboardStats', userID],
      {
        params: {
          affiliateUserId: userID,
        },
      }
    );

  const balance = getAffiliateUserDashboardStats?.body.currentBalance || 0;

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    // Simulate API call to SRK Bank
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast('Withdrawal request sent to SRK Bank!', 'success');
    } catch (error) {
      showToast('Withdrawal failed. Please try again.', 'error');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const consistencyDays = getAffiliateUserDashboardStats?.body.activeDaysStreak ?? 0;

  const stats = [
    {
      label: 'Today',
      value: formatRupees(
        getAffiliateUserDashboardStats?.body.todayEarnings?.totalEarnings ?? 0
      ),
      variant: 'gold' as CardVariant,
      change: `+${getAffiliateUserDashboardStats?.body.todayEarnings?.growthPercentage ??
        0
        }%`,
      icon: <SparklesIcon className="w-4 h-4" />,
      description: 'Earnings today',
    },
    {
      label: 'Wallet',
      value: formatRupees(
        getAffiliateUserDashboardStats?.body.currentBalance ?? 0
      ),
      variant: 'emerald' as CardVariant,
      info: balance > 10 ? 'Available for withdrawal' : 'No funds',
      icon: <WalletIcon className="w-4 h-4" />,
      description: 'Current balance',
    },
    {
      label: '7 Days',
      value: formatRupees(
        getAffiliateUserDashboardStats?.body.last7DaysEarnings?.totalEarnings ??
        0
      ),
      variant: 'violet' as CardVariant,
      change: `+${getAffiliateUserDashboardStats?.body.last7DaysEarnings
        ?.growthPercentage ?? 0
        }%`,
      icon: <TrendingUpIcon className="w-4 h-4" />,
      description: 'Weekly earnings',
    },
    {
      label: 'All Time',
      value: formatRupees(
        getAffiliateUserDashboardStats?.body.allTimeEarnings ?? 0
      ),
      variant: 'gold' as CardVariant,
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      description: 'Total earnings',
    },
    {
      label: '28 Days',
      value: formatRupees(
        getAffiliateUserDashboardStats?.body.last28DaysEarnings
          ?.totalEarnings ?? 0
      ),
      variant: 'blue' as CardVariant,
      change: `+${getAffiliateUserDashboardStats?.body.last28DaysEarnings
        ?.growthPercentage ?? 0
        }%`,
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="21"></line>
        </svg>
      ),
      description: 'Monthly earnings',
    },
    {
      label: 'Consistency',
      value: `${consistencyDays
        } Days`,
      variant: 'emerald' as CardVariant,
      info: 'Active streak',
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      description: 'Daily activity streak',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Withdraw Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm">
            Your earnings and performance at a glance
          </p>
        </div>
        <button
          onClick={handleWithdraw}
          disabled={isWithdrawing || data.wallet <= 0}
          className={`
            relative overflow-hidden group
            px-6 py-3 rounded-xl
            font-bold text-sm
            transition-all duration-300
            flex items-center justify-center gap-2
            ${data.wallet <= 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-105'
            }
          `}
          style={{
            background: `linear-gradient(135deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
            boxShadow: `0 4px 20px ${GOLD_PRIMARY}40`,
          }}
        >
          {isWithdrawing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <WithdrawIcon className="w-4 h-4" />
              Withdraw {formatRupees(data.wallet)}
            </>
          )}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
        </button>
      </div>

      {/* Small Tile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, index) => (
          <GlassCard
            key={index}
            variant={stat.variant}
            padding="sm"
            className="min-h-[140px]"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {stat.description}
                  </p>
                </div>
                <div
                  className="p-1.5 rounded-lg"
                  style={{
                    background:
                      stat.variant === 'gold'
                        ? `${GOLD_PRIMARY}20`
                        : stat.variant === 'emerald'
                          ? `${SUCCESS}20`
                          : stat.variant === 'violet'
                            ? `rgba(139, 92, 246, 0.2)`
                            : stat.variant === 'blue'
                              ? `${INFO}20`
                              : 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {React.cloneElement(stat.icon, {
                    className: `${stat.icon.props.className} ${stat.variant === 'gold'
                      ? `text-[${GOLD_PRIMARY}]`
                      : stat.variant === 'emerald'
                        ? `text-[${SUCCESS}]`
                        : stat.variant === 'violet'
                          ? 'text-[#8B5CF6]'
                          : stat.variant === 'blue'
                            ? `text-[${INFO}]`
                            : 'text-gray-400'
                      }`,
                  })}
                </div>
              </div>

              <div className="mt-auto">
                <div
                  className={`text-xl font-bold ${stat.variant === 'gold'
                    ? 'text-[#E1BA73]'
                    : stat.variant === 'emerald'
                      ? 'text-emerald-400'
                      : stat.variant === 'violet'
                        ? 'text-violet-400'
                        : stat.variant === 'blue'
                          ? 'text-blue-400'
                          : 'text-white'
                    }`}
                >
                  {stat.value}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  {stat.change && (
                    <span
                      className={`text-xs font-medium ${stat.change.startsWith('+')
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                        }`}
                    >
                      {stat.change}
                    </span>
                  )}
                  {stat.info && (
                    <span className="text-xs text-gray-500">{stat.info}</span>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard colSpan={2} variant="neutral">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Performance Trends
              </h3>
              <p className="text-xs text-gray-500">Last 7 days earnings</p>
            </div>
            <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
              ↑ 18% this month
            </span>
          </div>
          <div className="h-40 flex items-end gap-2">
            {[40, 65, 80, 60, 75, 90, 85].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div
                  className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                  style={{
                    height: `${height}%`,
                    background: `linear-gradient(to top, ${GOLD_PRIMARY}40, ${GOLD_ACCENT}60)`,
                    border: `1px solid ${GOLD_PRIMARY}50`,
                    borderBottom: 'none',
                    boxShadow: `0 -4px 12px ${GOLD_PRIMARY}30`,
                  }}
                />
                <div className="mt-2">
                  <span className="text-xs text-gray-500">Day {i + 1}</span>
                  <div className="text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{Math.round(height * 1250)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard variant="gold">
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E1BA73] to-[#B68938] rounded-full blur-lg opacity-50"></div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
                style={{
                  background: `linear-gradient(135deg, ${GOLD_PRIMARY}30, ${GOLD_ACCENT}50)`,
                  border: `2px solid ${GOLD_PRIMARY}40`,
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: GOLD_PRIMARY }}
                >
                  {consistencyDays}
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-white">Day Streak</p>
            <p className="text-xs text-gray-400 mt-1">Keep going!</p>
            <div className="mt-6 w-full">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Start</span>
                <span>Goal: 30 days</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(
                      (consistencyDays / 30) * 100,
                      100
                    )}%`,
                    background: `linear-gradient(90deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
                    boxShadow: `0 0 20px ${GOLD_PRIMARY}40`,
                  }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
