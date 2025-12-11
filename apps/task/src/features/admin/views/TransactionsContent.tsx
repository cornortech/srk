import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Payout } from '../types';
import { CARD_BG, GOLD_PRIMARY, GOLD_ACCENT } from '../constants/theme';

interface TransactionsContentProps {
  initialData: Payout[];
}

export const TransactionsContent: React.FC<TransactionsContentProps> =
  React.memo(({ initialData }) => {
    type TabType = 'Unpaid' | 'Paid' | 'All';
    const [activeTab, setActiveTab] = useState<TabType>('Unpaid');

    const filteredData = useMemo<Payout[]>(() => {
      switch (activeTab) {
        case 'Paid':
          return initialData
            .filter((p) => p.status === 'Paid')
            .sort(
              (a, b) =>
                new Date(b.paidAt!).getTime() - new Date(a.paidAt!).getTime()
            );
        case 'Unpaid':
          return initialData
            .filter((p) => p.status !== 'Paid')
            .sort(
              (a, b) =>
                new Date(a.requestedAt).getTime() -
                new Date(b.requestedAt).getTime()
            );
        default:
          return initialData.sort(
            (a, b) =>
              new Date(b.requestedAt).getTime() -
              new Date(a.requestedAt).getTime()
          );
      }
    }, [initialData, activeTab]);

    return (
      <div>
        <div
          className="flex gap-1 mb-8 p-1 rounded-xl border border-gray-700/50 w-full sm:w-fit"
          style={{ background: CARD_BG }}
        >
          {(['Unpaid', 'Paid', 'All'] as TabType[]).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold uppercase text-sm transition-colors ${
                activeTab === tab
                  ? 'text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={
                activeTab === tab
                  ? {
                      background: `linear-gradient(45deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
                    }
                  : {}
              }
              whileHover={{ scale: 1.02 }}
            >
              {tab}{' '}
              {tab === 'Unpaid' &&
                `(${initialData.filter((p) => p.status !== 'Paid').length})`}
            </motion.button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-gray-700/50"
                style={{ background: CARD_BG }}
              >
                <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                  <p className="text-white font-semibold text-base truncate">
                    {transaction.username} ({transaction.userId})
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {transaction.status === 'Paid'
                      ? `Paid on: ${transaction.paidAt}`
                      : `Requested on: ${transaction.requestedAt}`}
                  </p>
                  <p className="text-xs sm:text-sm mt-1 flex items-center gap-1 text-gray-500">
                    Method:{' '}
                    <span className="text-white font-medium">
                      {transaction.method}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                  <div className="text-right">
                    <p
                      className="text-lg font-extrabold"
                      style={{ color: GOLD_PRIMARY }}
                    >
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.points.toLocaleString()} Points
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-10 text-gray-500">
              No transactions recorded for the "{activeTab}" category.
            </div>
          )}
        </div>
      </div>
    );
  });
