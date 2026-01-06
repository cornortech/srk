import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CARD_BG, GOLD_PRIMARY, GOLD_ACCENT } from '../constants/theme';
import { api } from '../../../lib/api';
import { Loader2 } from 'lucide-react';

type TabType = 'pending' | 'approved' | 'rejected' | 'all';

export const TransactionsContent: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [page, setPage] = useState(1);

  const { data: transactionsData, isLoading, error: queryError } =
    api.srkTask.getAllSrkTaskEarningPayoutsByAdmin.useQuery(
      ['getAllSrkTaskEarningPayoutsByAdmin', activeTab, page],
      {
        query: {
          page: page.toString(),
          limit: "10",
          status: activeTab === 'all' ? undefined : activeTab,
        },
      }
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-[#E1BA73]" />
        <span className="ml-3 text-gray-400">Loading transactions...</span>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="text-center p-10 text-red-500">
        An error occurred while fetching transactions
      </div>
    );
  }

  const filteredData = transactionsData?.body?.data || [];
  const totalPages = transactionsData?.body?.totalPages || 1;

  return (
    <div>
      <div
        className="flex gap-1 mb-8 p-1 rounded-xl border border-gray-700/50 w-full sm:w-fit"
        style={{ background: CARD_BG }}
      >
        {([
          { key: 'pending', label: 'Pending' },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' },
          { key: 'all', label: 'All' },
        ] as { key: TabType; label: string }[]).map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className={`flex-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold uppercase text-sm transition-colors ${activeTab === tab.key
              ? 'text-black'
              : 'text-gray-400 hover:text-white'
              }`}
            style={
              activeTab === tab.key
                ? {
                  background: `linear-gradient(45deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
                }
                : {}
            }
            whileHover={{ scale: 1.02 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((transaction) => (
            <div
              key={transaction._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-gray-700/50"
              style={{ background: CARD_BG }}
            >
              <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                <p className="text-white font-semibold text-base truncate">
                  {transaction.taskUserId.fullName}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {transaction.taskUserId.email}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {transaction.status === 'approved'
                    ? `Approved on: ${new Date(transaction.updatedAt).toLocaleDateString()}`
                    : `Requested on: ${new Date(transaction.createdAt).toLocaleDateString()}`}
                </p>
                {transaction.transactionId && (
                  <p className="text-xs sm:text-sm mt-1 flex items-center gap-1 text-gray-500">
                    Transaction ID:{' '}
                    <span className="text-white font-medium">
                      {transaction.transactionId}
                    </span>
                  </p>
                )}
                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full uppercase ${transaction.status === 'pending'
                    ? 'bg-yellow-600/20 text-yellow-400'
                    : transaction.status === 'approved'
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-red-600/20 text-red-400'
                    }`}
                >
                  {transaction.status}
                </span>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <div className="text-right">
                  <p
                    className="text-lg font-extrabold"
                    style={{ color: GOLD_PRIMARY }}
                  >
                    ₹{transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.coinsUsed.toLocaleString()} Coins
                  </p>
                  <p className="text-xs text-gray-400">
                    TDS: ₹{transaction.tds.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-10 text-gray-500">
            No transactions found
          </div>
        )}
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
