import React, { useState, useCallback } from 'react';
import { GoldButton } from '../components/ui/GoldButton';
import { CARD_BG, GOLD_PRIMARY } from '../constants/theme';
import { api } from '../../../lib/api';
import { Loader2 } from 'lucide-react';


export const PayoutRequestsContent: React.FC = React.memo(() => {
  const [page, setPage] = useState(1);

  const { data: payoutData, isLoading, error: queryError, refetch } =
    api.srkTask.getAllSrkTaskEarningPayoutsByAdmin.useQuery(
      ['getAllSrkTaskEarningPayoutsByAdmin', page],
      {
        query: {
          page: page.toString(),
          limit: '10',
          status: 'pending',
        },
      }
    );

  const handlePayout = useCallback(async (payoutId: string) => {
    console.log(`Processing payout for ID: ${payoutId}`);
    // TODO: Implement approve payout API call
    // After success, refetch the data
    await refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-[#E1BA73]" />
        <span className="ml-3 text-gray-400">Loading payout requests...</span>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="text-center p-10 text-red-500">
        An error occurred while fetching payout requests
      </div>
    );
  }

  if (!payoutData?.body?.data || payoutData.body.data.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        No pending payout requests requiring action.
      </div>
    );
  }

  const pendingRequests = payoutData.body.data;
  const totalPages = payoutData.body.totalPages;

  return (
    <div>
      <div className="space-y-4">
        {pendingRequests.map((payout) => (
          <div
            key={payout._id}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 rounded-xl border border-gray-700/50"
            style={{ background: CARD_BG }}
          >
            <div className="flex-1 min-w-0 mb-3 lg:mb-0 space-y-1">
              <p className="text-white font-semibold text-lg truncate">
                {payout.taskUserId.fullName}
              </p>
              <p className="text-gray-400 text-sm truncate">
                {payout.taskUserId.email}
              </p>
              <p className="text-gray-400 text-xs">
                User ID: <span className="text-white">{payout.taskUserId._id}</span>
              </p>
              <p className="text-gray-400 text-sm">
                Requested on:{' '}
                <span className="text-white">
                  {new Date(payout.createdAt).toLocaleDateString()}
                </span>
              </p>
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase ${payout.status === 'pending'
                  ? 'bg-yellow-600/20 text-yellow-400'
                  : payout.status === 'approved'
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-red-600/20 text-red-400'
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
                  ₹{payout.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {payout.coinsUsed.toLocaleString()} Coins
                </p>
                <p className="text-xs text-gray-400">
                  TDS: ₹{payout.tds.toFixed(2)}
                </p>
              </div>

              {payout.transactionId && (
                <div className="text-left">
                  <p className="text-sm font-medium text-white">
                    {payout.transactionId}
                  </p>
                  <p className="text-xs text-gray-500">Transaction ID</p>
                </div>
              )}

              <GoldButton
                onClick={() => handlePayout(payout._id)}
                className="h-10 text-sm px-5 w-full sm:w-auto"
              >
                Process Payout
              </GoldButton>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
});
