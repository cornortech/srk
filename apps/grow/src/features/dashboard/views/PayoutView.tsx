import { CheckCircleIcon, WalletIcon, XIcon } from 'lucide-react';
import { GOLD_ACCENT, GOLD_PRIMARY } from '../constants';
import {
  CardVariant,
  Payout,
  PayoutStatus,
} from 'apps/grow/src/lib/types/dashboard';
import { GlassCard } from '../components/ui/GlassCard';
import { ReactNode, useState } from 'react';
import { formatRupees } from '../../../lib/utils/formatters';
import { api } from '../../../lib/api';

interface PayoutViewProps {
  userID: string;
  payouts: Payout[];
}

export const PayoutView: React.FC<PayoutViewProps> = ({ userID, payouts }) => {
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
          icon: (
            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          ),
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

  const stats = [
    {
      label: 'Total Payouts',
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
      value: payouts.length.toString(),
      variant: 'violet' as CardVariant,
    },
  ];

    const [page, setPage] = useState("1");
  
    const { data: getAffiliateUserPayout, isLoading } =
      api.growAffiliate.getSrkAffiliateEarningPayoutForAdmin.useQuery(
      ['affiliatedUserPayout', page],
      {
        query: {
          limit: "10",
          page: page,
          perPage: "10",
          status: undefined,
        },
      });

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <GlassCard key={index} variant={stat.variant} padding="sm">
            <div className="text-center">
              <div
                className={`text-lg font-bold ${
                  stat.variant === 'gold'
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
        <div className="space-y-3">
          {payouts.map((payout: Payout) => {
            const statusStyle = getStatusStyle(payout.status);
            return (
              <div key={payout.id} className="group relative">
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent group-hover:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 rounded-xl blur-sm"></div>
                      <div
                        className="relative w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${GOLD_PRIMARY}20, ${GOLD_ACCENT}40)`,
                          border: `1px solid ${GOLD_PRIMARY}30`,
                        }}
                      >
                        <WalletIcon
                          className="w-5 h-5"
                          style={{ color: GOLD_PRIMARY }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {payout.date instanceof Date
                          ? payout.date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : String(payout.date)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Transaction #{payout.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        statusStyle.bg
                      } ${
                        statusStyle.text
                      } flex items-center gap-1.5 border ${statusStyle.text.replace(
                        'text-',
                        'border-'
                      )}/30`}
                    >
                      {statusStyle.icon}
                      {payout.status}
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-white">
                        {formatRupees(payout.amount)}
                      </div>
                      <div className="text-xs text-gray-500">Amount</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
