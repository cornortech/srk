import {
  CheckCircleIcon,
  WalletIcon,
  XIcon,
  ArrowLeft,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { GOLD_ACCENT, GOLD_PRIMARY } from '../constants';
import { CardVariant, Payout, PayoutStatus } from 'apps/grow/src/lib/types/dashboard';
import { GlassCard } from '../components/ui/GlassCard';
import { ReactNode, useState, useMemo } from 'react';
import { formatRupees } from '../../../lib/utils/formatters';
import { api } from '../../../lib/api';
import { Button, Spinner } from '@nextui-org/react';

interface PayoutViewProps {
  userID: string;
}

export const PayoutView: React.FC<PayoutViewProps> = ({ userID }) => {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data: payoutRequestsRes, isLoading } =
    api.grow.getSrkGrowAffiliateEarningPayoutRequestByUser.useQuery(
      ['userPayoutRequests', userID, page],
      {
        params: { userId: userID },
        query: {
          page: String(page),
          perPage: String(perPage),
          limit: String(perPage),
        },
      },
      {
        enabled: !!userID,
      }
    );

  const payouts: Payout[] = useMemo(() => {
    if (!payoutRequestsRes?.body?.data) return [];

    return payoutRequestsRes.body.data.map((item) => {
      let status: PayoutStatus = 'Processing';
      if (item.status === 'approved') status = 'Completed';
      else if (item.status === 'rejected') status = 'Failed';

      return {
        id: item._id,
        amount: item.amount,
        status,
        date: new Date(item.createdAt),
      };
    });
  }, [payoutRequestsRes]);

  const getStatusStyle = (
    status: PayoutStatus
  ): { bg: string; text: string; icon: ReactNode } => {
    switch (status) {
      case 'Completed':
        return {
          bg: 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/5',
          text: 'text-emerald-400',
          icon: <CheckCircleIcon className="w-3 h-3" />,
        };
      case 'Processing':
        return {
          bg: 'bg-gradient-to-r from-blue-500/10 to-blue-600/5',
          text: 'text-blue-400',
          icon: <Clock className="w-3 h-3 animate-pulse" />,
        };
      case 'Failed':
        return {
          bg: 'bg-gradient-to-r from-rose-500/10 to-rose-600/5',
          text: 'text-rose-400',
          icon: <XIcon className="w-3 h-3" />,
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500/10 to-gray-600/5',
          text: 'text-gray-400',
          icon: null,
        };
    }
  };

  const totalPages = payoutRequestsRes?.body?.totalPages || 1;
  const totalRecords = payoutRequestsRes?.body?.totalRecords || 0;

  const stats = [
    {
      label: 'Total Requested',
      value: formatRupees(payouts.reduce((sum, p) => sum + p.amount, 0)),
      variant: 'gold' as CardVariant,
    },
    {
      label: 'Completed',
      value: formatRupees(
        payouts
          .filter((p) => p.status === 'Completed')
          .reduce((sum, p) => sum + p.amount, 0)
      ),
      variant: 'emerald' as CardVariant,
    },
    {
      label: 'Processing',
      value: formatRupees(
        payouts
          .filter((p) => p.status === 'Processing')
          .reduce((sum, p) => sum + p.amount, 0)
      ),
      variant: 'blue' as CardVariant,
    },
    {
      label: 'Transactions',
      value: totalRecords.toString(),
      variant: 'violet' as CardVariant,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Spinner size="lg" color="warning" />
        <p className="text-gray-400 animate-pulse">Fetching your payout history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <GlassCard key={index} variant={stat.variant} padding="sm">
            <div className="text-center">
              <div
                className={`text-lg font-bold ${stat.variant === 'gold'
                  ? 'text-[#E1BA73]'
                  : stat.variant === 'emerald'
                    ? 'text-emerald-400'
                    : stat.variant === 'blue'
                      ? 'text-blue-400'
                      : 'text-violet-400'
                  }`}
              >
                {stat.value}
              </div>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Payout History */}
      <GlassCard variant="neutral" blur="lg">
        <div className="space-y-3 min-h-[300px]">
          {payouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <WalletIcon className="w-12 h-12 mb-4 opacity-20" />
              <p>No payout requests found</p>
            </div>
          ) : (
            payouts.map((payout: Payout) => {
              const statusStyle = getStatusStyle(payout.status);
              return (
                <div key={payout.id} className="group relative">
                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent group-hover:border-white/10 text-sm md:text-base">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 rounded-xl blur-sm"></div>
                        <div
                          className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${GOLD_PRIMARY}20, ${GOLD_ACCENT}40)`,
                            border: `1px solid ${GOLD_PRIMARY}30`,
                          }}
                        >
                          <WalletIcon
                            className="w-4 h-4 md:w-5 md:h-5"
                            style={{ color: GOLD_PRIMARY }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {payout.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-500">
                          ID: {payout.id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-medium ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1.5 border border-white/5`}
                      >
                        {statusStyle.icon}
                        {payout.status}
                      </span>
                      <div className="text-right">
                        <div className="font-bold text-white text-sm md:text-base">
                          {formatRupees(payout.amount)}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500">Amount</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
            <p className="text-xs text-gray-500">
              Showing page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="bg-white/5 hover:bg-white/10 border border-white/5"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="bg-white/5 hover:bg-white/10 border border-white/5"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

