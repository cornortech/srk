import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Receipt,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';

const TABS = ['statement', 'payouts'] as const;
type Tab = (typeof TABS)[number];

const STATUS_STYLES: Record<string, string> = {
  approved: 'border-emerald-500/25 text-emerald-400',
  rejected: 'border-red-500/25 text-red-400',
  pending: 'border-amber-500/25 text-amber-400',
};

export const FinanceHistoryView: React.FC = () => {
  const { taskUserID } = useTaskAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('statement');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const LIMIT = 10;

  const { data: financeRes, isLoading: isStatementLoading } =
    api.srkTask.getAllSrkTaskUserFinanceStatement.useQuery(
      ['srk-task-finance', taskUserID, page, filter],
      {
        params: { userId: taskUserID || '' },
        query: {
          page: page.toString(),
          limit: LIMIT.toString(),
          type: filter === 'all' ? undefined : filter,
        },
      },
      {
        enabled: !!taskUserID && activeTab === 'statement',
        queryKey: ['srk-task-finance'],
      }
    );

  const { data: payoutsRes, isLoading: isPayoutsLoading } =
    api.srkTask.getSrkTaskUserEarningsPayoutsByUser.useQuery(
      ['srk-task-payouts', taskUserID, page],
      {
        params: { userId: taskUserID || '' },
        query: { page: page.toString(), limit: LIMIT.toString() },
      },
      {
        enabled: !!taskUserID && activeTab === 'payouts',
        queryKey: ['srk-task-payouts'],
      }
    );

  const transactions = financeRes?.status === 200 ? financeRes.body.data : [];
  const payouts = payoutsRes?.status === 200 ? payoutsRes.body.data : [];
  const isLoading = activeTab === 'statement' ? isStatementLoading : isPayoutsLoading;
  const currentData = activeTab === 'statement' ? transactions : payouts;
  const hasNextPage = currentData.length === LIMIT;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-2">
          Finance
        </p>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Financial History
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Track your earnings, spending, and withdrawals
        </p>
      </div>

      {/* Tab + filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.06] pb-0">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize transition-colors duration-150 border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-primary text-white'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              {tab === 'payouts' ? 'Withdrawals' : 'Statement'}
            </button>
          ))}
        </div>

        {activeTab === 'statement' && (
          <div className="flex border border-white/[0.08] self-start sm:self-auto">
            {(['all', 'credit', 'debit'] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setFilter(type); setPage(1); }}
                className={`px-4 py-2 text-xs font-medium capitalize transition-colors duration-150 border-r border-white/[0.08] last:border-r-0 ${
                  filter === type
                    ? 'bg-primary/10 text-primary'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border border-white/[0.08]">
        {isLoading && currentData.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={20} className="animate-spin text-white/30" />
          </div>
        ) : currentData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Receipt size={20} className="text-white/15" />
            <p className="text-sm text-white/25">No records found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              {activeTab === 'statement' ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['Type', 'Description', 'Date', 'Amount'].map((h) => (
                        <th
                          key={h}
                          className={`py-3 px-5 text-[10px] font-medium uppercase tracking-widest text-white/30 ${
                            h === 'Amount' ? 'text-right' : 'text-left'
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {transactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors duration-100">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 border flex items-center justify-center flex-shrink-0 ${
                                tx.type === 'credit'
                                  ? 'border-emerald-500/25 text-emerald-400'
                                  : 'border-red-500/25 text-red-400'
                              }`}
                            >
                              {tx.type === 'credit'
                                ? <ArrowDownLeft size={13} />
                                : <ArrowUpRight size={13} />}
                            </div>
                            <span className="text-xs font-medium capitalize text-white/60 hidden sm:block">
                              {tx.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-sm text-white/70">
                          {tx.description}
                        </td>
                        <td className="py-3.5 px-5 text-xs text-white/35 tabular-nums whitespace-nowrap">
                          {format(new Date(tx.createdAt), 'MMM dd, yyyy · HH:mm')}
                        </td>
                        <td className={`py-3.5 px-5 text-right text-sm font-semibold tabular-nums ${
                          tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {tx.type === 'credit' ? '+' : '−'}{tx.coin}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['Date', 'Status', 'Coins used', 'Gross', 'TDS', 'Net', 'Details'].map((h) => (
                        <th
                          key={h}
                          className="py-3 px-5 text-[10px] font-medium uppercase tracking-widest text-white/30 text-left"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {payouts.map((po) => (
                      <tr key={po._id} className="hover:bg-white/[0.02] transition-colors duration-100">
                        <td className="py-3.5 px-5 text-xs text-white/35 tabular-nums whitespace-nowrap">
                          {format(new Date(po.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center border px-2.5 py-1 text-xs font-medium capitalize ${
                            STATUS_STYLES[po.status] ?? 'border-white/[0.1] text-white/40'
                          }`}>
                            {po.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-sm text-white/60 tabular-nums">{po.coinsUsed}</td>
                        <td className="py-3.5 px-5 text-sm font-medium text-white tabular-nums">₹{po.amount}</td>
                        <td className="py-3.5 px-5 text-sm text-red-400/80 tabular-nums">₹{po.tds}</td>
                        <td className="py-3.5 px-5 text-sm font-semibold text-emerald-400 tabular-nums">₹{po.amount - po.tds}</td>
                        <td className="py-3.5 px-5 text-xs text-white/30 max-w-[160px]">
                          {po.rejectionReason && (
                            <span className="text-red-400 block">Reason: {po.rejectionReason}</span>
                          )}
                          {po.transactionId && (
                            <span className="text-white/25 block truncate" title={po.transactionId}>
                              TX: {po.transactionId}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/[0.06]">
              <span className="text-xs text-white/25 tabular-nums">Page {page}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                  className="p-1.5 border border-white/[0.08] text-white/45 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNextPage || isLoading}
                  className="p-1.5 border border-white/[0.08] text-white/45 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};
