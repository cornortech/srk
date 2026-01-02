import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Receipt,
} from 'lucide-react';
import { DashboardGlassCard } from '../components/ui/DashboardGlassCard';
import DashboardGradientText from '../components/ui/DashboardGradientText';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';

export const FinanceHistoryView: React.FC = () => {
  const { taskUserID } = useTaskAuthStore();
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');

  const { data: financeRes, isLoading } =
    api.srkTask.getAllSrkTaskUserFinanceStatement.useQuery(
      ['srk-task-finance', taskUserID, page, filter],
      {
        params: { userId: taskUserID || '' },
        query: {
          page: page.toString(),
          limit: LIMIT.toString(),
          type: filter === 'all' ? undefined : filter,
        },
      }
    );

  const transactions = financeRes?.status === 200 ? financeRes.body.data : [];
  // Assuming API doesn't return total pages yet, we check if we got a full page
  const hasNextPage = transactions.length === LIMIT;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <DashboardGradientText>Financial Statement</DashboardGradientText>
          </h1>
          <p className="text-zinc-400">
            Track your coin earnings and withdrawals
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
          {(['all', 'credit', 'debit'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilter(type);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === type
                  ? 'bg-amber-500 text-black shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <DashboardGlassCard>
        <div className="p-6">
          {isLoading && transactions.length === 0 ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-amber-400" size={32} />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <Receipt size={24} className="text-zinc-500" />
              </div>
              <p className="text-zinc-400 font-medium">No transactions found</p>
              <p className="text-sm text-zinc-600 mt-1">
                Your earning and spending history will appear here
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="pb-4 text-zinc-400 font-medium pl-4">
                        Type
                      </th>
                      <th className="pb-4 text-zinc-400 font-medium">
                        Description
                      </th>
                      <th className="pb-4 text-zinc-400 font-medium">Date</th>
                      <th className="pb-4 text-zinc-400 font-medium text-right pr-4">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map((tx, idx) => (
                      <motion.tr
                        key={tx._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                tx.type === 'credit'
                                  ? 'bg-green-500/10 text-green-400'
                                  : 'bg-red-500/10 text-red-400'
                              }`}
                            >
                              {tx.type === 'credit' ? (
                                <ArrowDownLeft size={18} />
                              ) : (
                                <ArrowUpRight size={18} />
                              )}
                            </div>
                            <span className="capitalize text-sm font-medium text-white hidden sm:block">
                              {tx.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-zinc-300 text-sm font-medium">
                          {tx.description}
                        </td>
                        <td className="py-4 text-zinc-500 text-sm">
                          {format(new Date(tx.createdAt), 'MMM dd, yyyy HH:mm')}
                        </td>
                        <td
                          className={`py-4 pr-4 text-right font-bold text-lg ${
                            tx.type === 'credit'
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {tx.type === 'credit' ? '+' : '-'}
                          {tx.coin}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                <p className="text-sm text-zinc-500">Page {page}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNextPage || isLoading}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </DashboardGlassCard>
    </div>
  );
};
