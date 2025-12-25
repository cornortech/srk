import React, { useMemo } from 'react';
import { Payout } from '../types';
import { GoldButton } from '../components/ui/GoldButton';
import { CARD_BG, GOLD_PRIMARY } from '../constants/theme';

interface PayoutRequestsContentProps {
  initialData: Payout[];
  onPayout: (id: number) => void;
}

export const PayoutRequestsContent: React.FC<PayoutRequestsContentProps> =
  React.memo(({ initialData, onPayout }) => {
    const pendingRequests = useMemo<Payout[]>(
      () => initialData.filter((p) => p.status !== 'Paid'),
      [initialData]
    );

    if (pendingRequests.length === 0) {
      return (
        <div className="text-center p-10 text-gray-500">
          No pending payout requests requiring action.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {pendingRequests.map((payout) => (
          <div
            key={payout.id}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 rounded-xl border border-gray-700/50"
            style={{ background: CARD_BG }}
          >
            <div className="flex-1 min-w-0 mb-3 lg:mb-0 space-y-1">
              <p className="text-white font-semibold text-lg truncate">
                {payout.username} ({payout.userId})
              </p>
              <p className="text-gray-400 text-sm">
                Requested on:{' '}
                <span className="text-white">{payout.requestedAt}</span>
              </p>
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase ${
                  payout.status === 'Requested'
                    ? 'bg-yellow-600/20 text-yellow-400'
                    : 'bg-blue-600/20 text-blue-400'
                }`}
              >
                {payout.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8 w-full lg:w-auto">
              <div className="text-left">
                <p
                  className="text-xl font-extrabold"
                  style={{ color: GOLD_PRIMARY }}
                >
                  ${payout.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {payout.points.toLocaleString()} Points
                </p>
              </div>

              <div className="text-left">
                <p className="text-sm font-medium text-white">
                  {payout.method}
                </p>
                <p className="text-xs text-gray-500">Payment Method</p>
              </div>

              <GoldButton
                onClick={() => onPayout(payout.id)}
                className="h-10 text-sm px-5 w-full sm:w-auto"
              >
                Payout
              </GoldButton>
            </div>
          </div>
        ))}
      </div>
    );
  });
