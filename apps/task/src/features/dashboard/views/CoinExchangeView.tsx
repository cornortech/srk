import React, { useMemo, useState } from 'react';
import DashboardGradientText from '../components/ui/DashboardGradientText';
import { DashboardGlassCard } from '../components/ui/DashboardGlassCard';
import MagneticButton from '../components/ui/DashboardMagneticButton';
import { CheckCircle, Coins, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';

interface CoinExchangeViewProps {
  eligible: number;
  balance: number;
  payoutRequested?: boolean;
  setPayoutRequested?: (requested: boolean) => void;
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void;
  onPayoutSuccess?: () => void;
}

export const CoinExchangeView: React.FC<CoinExchangeViewProps> = ({
  eligible,
  balance,
  onPayoutSuccess,
  addNotification,
}) => {
  const { taskUserID } = useTaskAuthStore();

  const EXCHANGE_RATE = 100;
  const TDS_RATE = 0.15;
  const MIN_WITHDRAWAL = 20000;

  const [exchangeAmount, setExchangeAmount] = useState(0);

  // 1. Fetch Existing Payout Requests (To check if one is pending)
  const { data: payoutsData, refetch: refetchPayouts } =
    api.srkTask.getSrkTaskUserEarningsPayoutsByUser.useQuery(
      ['srk-task-payouts', taskUserID],
      {
        params: { userId: taskUserID || '' },
        query: { limit: '1' }, // We just need to know if the latest is pending
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

  // 2. Mutation for requesting payout
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

  const rupeeRate = 1 / EXCHANGE_RATE;
  const grossAmount = exchangeAmount * rupeeRate;
  const tdsAmount = grossAmount * TDS_RATE;
  const netAmount = grossAmount - tdsAmount;

  // Check if user already has a pending payout from backend data
  const isPayoutPending = useMemo(() => {
    if (!payoutsData?.body?.data) return false;
    return payoutsData.body.data.some((p: any) => p.status === 'pending');
  }, [payoutsData]);

  const approvedPaymentDetails = paymentDetailsData?.body?.approvedDetails;
  const canUsePaymentDetails =
    !!approvedPaymentDetails && approvedPaymentDetails.isActive === true;

  const sliderMax = eligible;

  const isValidAmount = exchangeAmount > 0 && exchangeAmount <= eligible;
  const meetsMinimum = exchangeAmount >= MIN_WITHDRAWAL;

  const canRequest =
    isValidAmount &&
    meetsMinimum &&
    canUsePaymentDetails &&
    !isPayoutPending &&
    !isSubmitting;

  const handleMaxClick = () => {
    setExchangeAmount(sliderMax);
  };

  const handleRequestPayout = () => {
    if (!canRequest || !taskUserID) return;
    requestPayout({
      body: {
        srkTaskUserId: taskUserID,
        coins: exchangeAmount,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          <DashboardGradientText>Coin Exchange</DashboardGradientText>
        </h1>
        <p className="text-zinc-400">
          Convert your coins to cash and request payout
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <DashboardGlassCard>
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Exchange Calculator
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-zinc-400">
                      Coins to Exchange (Max: {eligible.toLocaleString()} Coins)
                    </label>
                    <button
                      onClick={handleMaxClick}
                      className="text-sm text-amber-400 hover:text-amber-300"
                    >
                      Use Max
                    </button>
                  </div>

                  <div className="relative mb-2">
                    <input
                      type="range"
                      min="0"
                      max={sliderMax}
                      value={
                        exchangeAmount > sliderMax ? sliderMax : exchangeAmount
                      }
                      onChange={(e) =>
                        setExchangeAmount(parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
                    />
                    <div className="flex justify-between text-xs text-zinc-500 mt-2">
                      <span>0</span>
                      <span>{sliderMax.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <input
                      type="number"
                      value={exchangeAmount}
                      onChange={(e) =>
                        setExchangeAmount(parseInt(e.target.value) || 0)
                      }
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                {/* Exchange Info Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <DashboardGlassCard className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-zinc-400 mb-1">
                        Exchange Rate
                      </p>
                      <p className="text-lg font-bold text-white">100 : 1</p>
                      <p className="text-xs text-zinc-500">Coins : Rupees</p>
                    </div>
                  </DashboardGlassCard>
                  <DashboardGlassCard className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-zinc-400 mb-1">
                        Min Withdrawal
                      </p>
                      <p className="text-lg font-bold text-white">
                        {MIN_WITHDRAWAL}
                      </p>
                      <p className="text-xs text-zinc-500">Coins</p>
                    </div>
                  </DashboardGlassCard>
                  <DashboardGlassCard className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-zinc-400 mb-1">TDS Rate</p>
                      <p className="text-lg font-bold text-white">15%</p>
                      <p className="text-xs text-zinc-500">Deduction</p>
                    </div>
                  </DashboardGlassCard>
                </div>

                {/* Calculation Breakdown */}
                <DashboardGlassCard className="p-6">
                  <h4 className="font-bold text-white mb-4">
                    Calculation Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Selected Coins:</span>
                      <span className="text-white font-medium">
                        {exchangeAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Gross Amount:</span>
                      <span className="text-white font-bold">
                        Rs. {grossAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-red-400">
                      <span>TDS Deduction (15%):</span>
                      <span>- Rs. {tdsAmount.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-white/10 my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Net Amount:</span>
                      <span className="text-green-400">
                        Rs. {netAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </DashboardGlassCard>

                {/* Submit Button */}
                <MagneticButton
                  onClick={
                    // setPayoutRequested(true);
                    // addNotification(
                    //   `Payout request submitted for Rs. ${netAmount.toFixed(
                    //     2
                    //   )}`,
                    //   'success'
                    // );
                    handleRequestPayout
                  }
                  disabled={!canRequest}
                  className="w-full"
                >
                  {isSubmitting && (
                    <Loader2 className="animate-spin" size={18} />
                  )}
                  {!canUsePaymentDetails
                    ? 'Payment details not approved'
                    : isPayoutPending
                      ? 'Request Submitted ✓'
                      : canRequest
                        ? `Request Rs. ${netAmount.toFixed(2)} Payout`
                        : 'Cannot Request Payout'}
                </MagneticButton>

                {/* Validation Messages */}
                {exchangeAmount > 0 && !meetsMinimum && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      Minimum withdrawal is {MIN_WITHDRAWAL.toLocaleString()} coins
                    </p>
                  </div>
                )}

                {exchangeAmount > eligible && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">
                      Cannot exceed eligible balance of {eligible.toLocaleString()} coins
                    </p>
                  </div>
                )}

                {!canUsePaymentDetails && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">
                      Payout requests are disabled until your payment details are approved and active.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DashboardGlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Balance Card */}
          <DashboardGlassCard>
            <div className="p-6">
              <h4 className="text-lg font-bold text-white mb-4">
                Your Balance
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Wallet Coins:</span>
                  <div className="flex items-center gap-2">
                    <Coins size={16} className="text-amber-400" />
                    <span className="text-white font-bold">
                      {balance.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Eligible:</span>
                  <span className="text-green-400 font-bold">
                    {eligible.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Locked:</span>
                  <span className="text-amber-400 font-bold">
                    {(balance - eligible).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-zinc-400 mb-1">
                  <span>Withdrawal Progress</span>
                  <span>
                    {balance > 0
                      ? Math.min(100, Math.round((eligible / balance) * 100))
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                    style={{
                      width: `${balance > 0 ? (eligible / balance) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </DashboardGlassCard>

          {/* Recent Transactions */}
          <DashboardGlassCard>
            <div className="p-6">
              <h4 className="text-lg font-bold text-white mb-4">
                Recent Transactions
              </h4>
              <div className="space-y-3">
                {[
                  {
                    date: 'Today',
                    coins: '+470',
                    type: 'Task Completion',
                    status: 'completed',
                  },
                  {
                    date: 'Yesterday',
                    coins: '+320',
                    type: 'Video Watch',
                    status: 'completed',
                  },
                  {
                    date: '2 days ago',
                    coins: '+280',
                    type: 'Follow Task',
                    status: 'completed',
                  },
                  {
                    date: '3 days ago',
                    coins: '-500',
                    type: 'Withdrawal',
                    status: 'pending',
                  },
                ].map((tx, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-white">{tx.type}</p>
                      <p className="text-xs text-zinc-500">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${tx.coins.startsWith('+')
                          ? 'text-green-400'
                          : 'text-red-400'
                          }`}
                      >
                        {tx.coins}
                      </p>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${tx.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                      >
                        {tx.status}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </DashboardGlassCard>

          {/* Payout Status */}
          {isPayoutPending && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DashboardGlassCard gradient="green">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle size={24} className="text-green-400" />
                    <h4 className="text-lg font-bold text-white">
                      Payout Requested
                    </h4>
                  </div>
                  <p className="text-sm text-zinc-300 mb-4">
                    Your payout request for Rs. {netAmount.toFixed(2)} has been
                    submitted successfully.
                  </p>
                  <div className="text-xs text-zinc-400">
                    <p>• Processing time: 24-48 hours</p>
                    <p>• Payment method: Bank Transfer</p>
                    <p>• TDS certificate will be provided</p>
                  </div>
                </div>
              </DashboardGlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
