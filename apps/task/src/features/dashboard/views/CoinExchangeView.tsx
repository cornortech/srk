import React, { useMemo, useState } from 'react';
import { CheckCircle, Coins, Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';

interface CoinExchangeViewProps {
  eligible: number;
  balance: number;
  payoutRequested?: boolean;
  setPayoutRequested?: (requested: boolean) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  onPayoutSuccess?: () => void;
}

const EXCHANGE_RATE = 100;
const TDS_RATE = 0.15;
const MIN_WITHDRAWAL = 20000;

export const CoinExchangeView: React.FC<CoinExchangeViewProps> = ({
  eligible,
  balance,
  onPayoutSuccess,
  addNotification,
}) => {
  const { taskUserID } = useTaskAuthStore();
  const [exchangeAmount, setExchangeAmount] = useState(0);

  const { data: payoutsData, refetch: refetchPayouts } =
    api.srkTask.getSrkTaskUserEarningsPayoutsByUser.useQuery(
      ['srk-task-payouts', taskUserID],
      {
        params: { userId: taskUserID || '' },
        query: { limit: '1' },
      }
    );

  const { data: paymentDetailsData } = api.srkTask.getUserPaymentDetails.useQuery(
    ['getUserPaymentDetails', taskUserID],
    { params: { userId: taskUserID || '' } },
    {
      enabled: !!taskUserID,
      queryKey: ['getUserPaymentDetails', taskUserID || ''],
    }
  );

  const { mutate: requestPayout, isPending: isSubmitting } =
    api.srkTask.srkTaskEarningsPayoutRequest.useMutation({
      onSuccess: () => {
        addNotification('Payout request submitted successfully!', 'success');
        setExchangeAmount(0);
        refetchPayouts();
        if (onPayoutSuccess) onPayoutSuccess();
      },
      onError: (error) => {
        const msg = (error as any)?.body?.message || 'Failed to request payout';
        addNotification(msg, 'error');
      },
    });

  const grossAmount = (exchangeAmount / EXCHANGE_RATE);
  const tdsAmount = grossAmount * TDS_RATE;
  const netAmount = grossAmount - tdsAmount;

  const isPayoutPending = useMemo(() => {
    if (!payoutsData?.body?.data) return false;
    return payoutsData.body.data.some((p: any) => p.status === 'pending');
  }, [payoutsData]);

  const approvedPaymentDetails = paymentDetailsData?.body?.approvedDetails;
  const canUsePaymentDetails = !!approvedPaymentDetails && approvedPaymentDetails.isActive === true;

  const isValidAmount = exchangeAmount > 0 && exchangeAmount <= eligible;
  const meetsMinimum = exchangeAmount >= MIN_WITHDRAWAL;
  const canRequest = isValidAmount && meetsMinimum && canUsePaymentDetails && !isPayoutPending && !isSubmitting;

  const handleRequestPayout = () => {
    if (!canRequest || !taskUserID) return;
    requestPayout({ body: { srkTaskUserId: taskUserID, coins: exchangeAmount } });
  };

  const eligiblePct = balance > 0 ? Math.min(100, Math.round((eligible / balance) * 100)) : 0;

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-2">
          Wallet
        </p>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Coin Exchange
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Convert your coins to cash and request a payout
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* ── Main calculator ── */}
        <div className="md:col-span-2 space-y-4">

          {/* Input section */}
          <div className="border border-white/[0.08] bg-bgSecondary/40">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Exchange Calculator</h3>
            </div>
            <div className="p-6 space-y-5">

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-white/40 uppercase tracking-widest">
                    Coins to exchange
                  </label>
                  <button
                    onClick={() => setExchangeAmount(eligible)}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Use max ({eligible.toLocaleString()})
                  </button>
                </div>

                <input
                  type="number"
                  value={exchangeAmount || ''}
                  onChange={(e) => setExchangeAmount(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-transparent border border-white/[0.1] text-white text-xl font-semibold placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-colors text-right tabular-nums"
                />

                <input
                  type="range"
                  min="0"
                  max={eligible || 0}
                  value={Math.min(exchangeAmount, eligible)}
                  onChange={(e) => setExchangeAmount(parseInt(e.target.value))}
                  className="w-full mt-3 h-1 bg-white/[0.08] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/25 mt-1.5 tabular-nums">
                  <span>0</span>
                  <span>{eligible.toLocaleString()}</span>
                </div>
              </div>

              {/* Rate info row */}
              <div className="grid grid-cols-3 gap-px bg-white/[0.06] text-center">
                {[
                  { label: 'Exchange rate', value: '100 : 1', sub: 'Coins : ₹' },
                  { label: 'Min withdrawal', value: MIN_WITHDRAWAL.toLocaleString(), sub: 'coins' },
                  { label: 'TDS rate', value: '15%', sub: 'deducted' },
                ].map((info) => (
                  <div key={info.label} className="bg-bgPrimary px-4 py-3.5">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{info.label}</p>
                    <p className="text-sm font-semibold text-white">{info.value}</p>
                    <p className="text-[10px] text-white/30">{info.sub}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Calculation breakdown */}
          <div className="border border-white/[0.08] bg-bgSecondary/40">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Breakdown</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              <div className="flex items-center justify-between px-6 py-3.5">
                <span className="text-sm text-white/50">Selected coins</span>
                <span className="text-sm font-medium text-white tabular-nums">{exchangeAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-3.5">
                <span className="text-sm text-white/50">Gross amount</span>
                <span className="text-sm font-semibold text-white tabular-nums">₹ {grossAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-3.5">
                <span className="text-sm text-red-400/80">TDS deduction (15%)</span>
                <span className="text-sm font-medium text-red-400 tabular-nums">− ₹ {tdsAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02]">
                <span className="text-sm font-semibold text-white">Net payout</span>
                <span className="text-xl font-semibold text-emerald-400 tabular-nums">₹ {netAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Validation messages */}
          <div className="space-y-2">
            {exchangeAmount > 0 && !meetsMinimum && (
              <div className="px-4 py-3 border border-amber-500/25 text-amber-400 text-sm">
                Minimum withdrawal is {MIN_WITHDRAWAL.toLocaleString()} coins
              </div>
            )}
            {exchangeAmount > eligible && (
              <div className="px-4 py-3 border border-red-500/25 text-red-400 text-sm">
                Cannot exceed eligible balance of {eligible.toLocaleString()} coins
              </div>
            )}
            {!canUsePaymentDetails && (
              <div className="px-4 py-3 border border-red-500/25 text-red-400 text-sm">
                Payout requests are disabled until your payment details are approved and active.
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleRequestPayout}
            disabled={!canRequest}
            className="w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-black hover:bg-primary/90 disabled:bg-white/[0.08] disabled:text-white/40"
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {isSubmitting
              ? 'Submitting...'
              : !canUsePaymentDetails
              ? 'Payment details not approved'
              : isPayoutPending
              ? 'Request already submitted'
              : canRequest
              ? `Request payout — ₹ ${netAmount.toFixed(2)}`
              : 'Enter a valid amount'}
          </button>

        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">

          {/* Balance */}
          <div className="border border-white/[0.08] bg-bgSecondary/40">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h4 className="text-sm font-semibold text-white">Your balance</h4>
            </div>
            <div className="divide-y divide-white/[0.04]">
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-white/50">Wallet</span>
                <div className="flex items-center gap-1.5">
                  <Coins size={13} className="text-primary" />
                  <span className="text-sm font-semibold text-white tabular-nums">{balance.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-white/50">Eligible</span>
                <span className="text-sm font-semibold text-emerald-400 tabular-nums">{eligible.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-white/50">Locked</span>
                <span className="text-sm font-semibold text-white/40 tabular-nums">{Math.max(0, balance - eligible).toLocaleString()}</span>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-center justify-between text-xs text-white/30 mb-2">
                  <span>Eligible ratio</span>
                  <span className="tabular-nums">{eligiblePct}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${eligiblePct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payout pending state */}
          {isPayoutPending && (
            <div className="border border-emerald-500/25 bg-emerald-500/[0.04] px-5 py-4">
              <div className="flex items-center gap-2.5 mb-3">
                <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />
                <p className="text-sm font-semibold text-white">Payout requested</p>
              </div>
              <div className="space-y-1.5 text-xs text-white/40">
                <p>Processing time: 24–48 hours</p>
                <p>Payment method: Bank transfer</p>
                <p>TDS certificate will be provided</p>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
