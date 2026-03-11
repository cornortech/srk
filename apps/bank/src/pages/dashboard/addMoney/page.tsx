import { useState } from "react";
import { ArrowLeft, Wallet, Info, History, ShieldCheck, Zap, Coins } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSRKAlert } from "@srk/shared/hooks";
import { AxiosError } from "axios";
import useAuthStore from "../../../store/useAuth";
import { bankApi } from "../../../utils/api/bank/bank.api";
import { TEarningDetails, TTaskEarningDetails } from "../../../utils/types/bank.type";
import { Spinner } from "@nextui-org/react";

// Exchange rate: 100 coins = 1 Rupee
const COIN_TO_RUPEE = 100;
const TDS_RATE = 0.15;
const MIN_TASK_COINS = 20000;

type Source = "university" | "task";

export default function AddMoneyPage() {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<Source>("university");
  const { userDetails } = useAuthStore();
  const navigate = useNavigate();
  const { show } = useSRKAlert();

  // University (Affiliate) Balance
  const { data: userBalance, isLoading: isUniLoading } = useQuery<TEarningDetails | null>({
    queryKey: ["getUserBalance", userDetails?._id],
    queryFn: async () => bankApi.getEarningDetailsofUserApi(userDetails!._id),
    enabled: !!userDetails?._id,
  });

  // Task App Coins/Balance
  const { data: taskBalance, isLoading: isTaskLoading } = useQuery<TTaskEarningDetails | null>({
    queryKey: ["getTaskBalance", userDetails?._id],
    queryFn: async () => bankApi.getTaskEarningDetailsApi(userDetails!._id),
    enabled: !!userDetails?._id,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["payout"],
    mutationFn: async ({ userId, targetSource }: { userId: string; targetSource: Source }) => {
      if (targetSource === "task") {
        // For task: `amount` is in COINS. Send coins directly; backend converts.
        await bankApi.createTaskBalancePayoutApi(userId, +amount);
      } else {
        // For university: `amount` is in Rupees.
        await bankApi.createBalancePayoutApi(userId, +amount);
      }
    },
    onSuccess: () => {
      show("Payout request successful. Funds are being moved to your SRK Bank.", "success");
      navigate("/dashboard");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data?.message || "Payout request failed", "error");
    },
  });

  // --- Calculations ---
  const isTaskSource = source === "task";
  const numAmount = +amount || 0;

  // For university: amount is rupees already.
  // For task: amount is coins → convert to rupees first.
  const grossRupees = isTaskSource ? numAmount / COIN_TO_RUPEE : numAmount;
  const tdsDeduction = grossRupees * TDS_RATE;
  const netDeposit = grossRupees - tdsDeduction;

  const currentBalance = isTaskSource
    ? (taskBalance?.currentCoins || 0)
    : (userBalance?.walletBalance || 0);

  const meetsMinimum = isTaskSource ? numAmount >= MIN_TASK_COINS : numAmount > 0;
  const isOverBalance = numAmount > currentBalance;

  const handleSubmit = () => {
    const userId = userDetails?._id;
    if (!userId) return;
    if (numAmount <= 0) { show("Please enter a valid amount", "error"); return; }
    if (!meetsMinimum && isTaskSource) {
      show(`Minimum withdrawal is ${MIN_TASK_COINS.toLocaleString()} coins`, "error"); return;
    }
    if (isOverBalance) {
      show(`Insufficient balance in ${isTaskSource ? "Task App" : "University"} account`, "error"); return;
    }
    mutate({ userId, targetSource: source });
  };

  if (isUniLoading || isTaskLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner color="warning" size="lg" />
      </div>
    );
  }

  const taskPresets = [20000, 50000, 75000, 100000];
  const uniPresets = [100, 500, 1000, 5000];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <Link to="/dashboard"><span className="text-sm font-medium">Back to Dashboard</span></Link>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                Add Money <span className="inline-block animate-bounce-slow">💰</span>
              </h1>
              <p className="text-gray-400 mt-1">Move your earnings to your SRK Bank account.</p>
            </div>
            <Link
              to="/dashboard/account/payouts"
              className="px-6 py-2 rounded-2xl bg-[#b68938]/10 text-[#b68938] border border-[#b68938]/20 hover:bg-[#b68938]/20 transition-all text-sm font-bold flex items-center gap-2 w-fit"
            >
              <History className="w-4 h-4" />
              Payout History
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">

            {/* Source Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* University */}
              <button
                onClick={() => { setSource("university"); setAmount(""); }}
                className={`group relative p-6 rounded-3xl border transition-all overflow-hidden text-left ${source === "university"
                  ? "bg-[#b68938]/10 border-[#b68938] shadow-[0_0_20px_rgba(182,137,56,0.1)]"
                  : "bg-[#111] border-white/5 hover:border-[#b68938]/30"}`}
              >
                {source === "university" && (
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 rounded-full bg-[#b68938] animate-pulse" />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${source === "university" ? "bg-[#b68938] text-black" : "bg-white/5 text-gray-400"}`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest ${source === "university" ? "text-[#b68938]" : "text-gray-500"}`}>University</p>
                    <h3 className="text-base font-bold text-white">Affiliate Earnings</h3>
                    <p className="text-xl font-black mt-1 text-white">Nrs. {userBalance?.walletBalance?.toLocaleString() ?? "0"}</p>
                  </div>
                </div>
              </button>

              {/* Task App */}
              <button
                onClick={() => { setSource("task"); setAmount(""); }}
                className={`group relative p-6 rounded-3xl border transition-all overflow-hidden text-left ${source === "task"
                  ? "bg-[#b68938]/10 border-[#b68938] shadow-[0_0_20px_rgba(182,137,56,0.1)]"
                  : "bg-[#111] border-white/5 hover:border-[#b68938]/30"}`}
              >
                {source === "task" && (
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 rounded-full bg-[#b68938] animate-pulse" />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${source === "task" ? "bg-[#b68938] text-black" : "bg-white/5 text-gray-400"}`}>
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest ${source === "task" ? "text-[#b68938]" : "text-gray-500"}`}>Task App</p>
                    <h3 className="text-base font-bold text-white">Task Coins</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <p className="text-xl font-black text-white">{taskBalance?.currentCoins?.toLocaleString() ?? "0"}</p>
                      <span className="text-xs text-gray-400">coins</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">≈ Nrs. {((taskBalance?.currentCoins || 0) / COIN_TO_RUPEE).toFixed(2)}</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Task notice */}
            {isTaskSource && (
              <div className="flex items-start gap-3 text-amber-400 bg-amber-400/5 p-4 rounded-2xl border border-amber-400/10">
                <Coins className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">
                  Enter the number of <strong>coins</strong> to exchange. Min: {MIN_TASK_COINS.toLocaleString()} coins. Rate: 100 coins = Nrs. 1
                </p>
              </div>
            )}

            {/* Input Card */}
            <div className="bg-[#111] border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#b68938]/5 rounded-full -mr-48 -mt-48 blur-3xl" />
              <div className="relative z-10 space-y-8">

                {/* TDS notice */}
                <div className="flex items-center gap-3 text-red-400 bg-red-400/5 p-4 rounded-2xl border border-red-400/10">
                  <Info className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">A 15% TDS will be deducted from your withdrawal {isTaskSource ? "(applied to rupee value)" : "amount"}.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-[#b68938]">
                    {isTaskSource ? "Enter Coins to Exchange" : "Enter Amount (Nrs.)"}
                  </label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-[#b68938]">
                      {isTaskSource ? <Coins className="w-8 h-8" /> : "Nrs."}
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      min={0}
                      max={currentBalance}
                      className="w-full bg-black/40 border-2 border-white/5 rounded-3xl px-8 pl-24 py-7 text-4xl font-black text-white focus:outline-none focus:border-[#b68938] transition-all placeholder:text-white/10"
                    />
                  </div>

                  {/* Quick presets */}
                  <div className="flex gap-2 flex-wrap">
                    {(isTaskSource ? taskPresets : uniPresets).map(preset => (
                      <button
                        key={preset}
                        onClick={() => setAmount(preset.toString())}
                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-[#b68938] hover:text-black transition-all font-bold text-sm min-w-[70px]"
                      >
                        {isTaskSource ? `${(preset / 1000).toFixed(0)}K` : `+${preset}`}
                      </button>
                    ))}
                    <button
                      onClick={() => setAmount(currentBalance.toString())}
                      className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-[#b68938] hover:text-black transition-all font-bold text-sm min-w-[60px]"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {/* Breakdown */}
                {numAmount > 0 && (
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                    {isTaskSource && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Coins Selected</span>
                        <span className="text-white font-bold">{numAmount.toLocaleString()} coins</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Gross Amount</span>
                      <span className="text-white font-bold">Nrs. {grossRupees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">TDS Deduction (15%)</span>
                      <span className="text-red-400 font-bold">− Nrs. {tdsDeduction.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex justify-between items-center text-xl">
                      <span className="text-white font-bold">Net Deposit</span>
                      <span className="text-[#b68938] font-black">Nrs. {netDeposit.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Validation warnings */}
                {isTaskSource && numAmount > 0 && !meetsMinimum && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <p className="text-yellow-400 text-sm">Minimum withdrawal is {MIN_TASK_COINS.toLocaleString()} coins.</p>
                  </div>
                )}
                {isOverBalance && numAmount > 0 && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 text-sm">
                      Cannot exceed available {isTaskSource ? "coins" : "balance"}: {currentBalance.toLocaleString()}
                    </p>
                  </div>
                )}

                <button
                  disabled={isPending || !amount || numAmount <= 0 || isOverBalance || (isTaskSource && !meetsMinimum)}
                  onClick={handleSubmit}
                  className="w-full relative group overflow-hidden py-7 rounded-[28px] font-black text-2xl transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#e1ba73] to-[#b68938] group-hover:scale-105 transition-transform duration-500" />
                  <span className="relative z-10 text-black flex items-center justify-center gap-3">
                    {isPending ? (
                      <><Spinner size="sm" color="default" />Processing...</>
                    ) : (
                      <><Wallet className="w-7 h-7" />Deposit Funds</>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Guide */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-black border border-white/5 rounded-[40px] p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Quick Guide</h3>
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#b68938]/20 flex items-center justify-center shrink-0 font-bold text-[#b68938]">1</div>
                  <p className="text-sm text-gray-400">Select <strong className="text-white">University</strong> for affiliate earnings (Rupees) or <strong className="text-white">Task App</strong> for coins.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#b68938]/20 flex items-center justify-center shrink-0 font-bold text-[#b68938]">2</div>
                  <p className="text-sm text-gray-400">Task coins are converted at <strong className="text-white">100 coins = Nrs. 1</strong>. Min. 20,000 coins required.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#b68938]/20 flex items-center justify-center shrink-0 font-bold text-[#b68938]">3</div>
                  <p className="text-sm text-gray-400">A <strong className="text-white">15% TDS</strong> is deducted from your gross amount before deposit.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#b68938]/20 flex items-center justify-center shrink-0 font-bold text-[#b68938]">4</div>
                  <p className="text-sm text-gray-400">Funds appear in your SRK Bank balance immediately.</p>
                </li>
              </ul>
            </div>

            {/* Balance Summary */}
            <div className="bg-[#111] border border-white/5 rounded-[32px] p-6">
              <h4 className="font-bold text-white mb-4">Your Balances</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4" />University</span>
                  <span className="text-white font-bold">Nrs. {userBalance?.walletBalance?.toLocaleString() ?? "0"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm flex items-center gap-2"><Coins className="w-4 h-4" />Task Coins</span>
                  <span className="text-white font-bold">{taskBalance?.currentCoins?.toLocaleString() ?? "0"}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-3">
                  <span className="text-gray-400 text-sm">Task ≈ Rupees</span>
                  <span className="text-[#b68938] font-bold">Nrs. {((taskBalance?.currentCoins || 0) / COIN_TO_RUPEE).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
          50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }
      `}</style>
    </div>
  );
}