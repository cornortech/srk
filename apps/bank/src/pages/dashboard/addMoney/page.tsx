import { useState } from "react";
import { ArrowLeft, Plus} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
// import { createBalancePayoutApi, getEarningDetailsofUserApi } from "../../../../../lib/apiClient";
import {useSRKAlert} from "@srk/shared/hooks";
import { AxiosError } from "axios";
import useAuthStore from "../../../store/useAuth";
import { bankApi } from "../../../utils/api/bank/bank.api";
import { TEarningDetails } from "../../../utils/types/bank.type";

export default function AddMoneyPage() {
  const [amount, setAmount] = useState("");
  const { userDetails } = useAuthStore()
  const navigate = useNavigate()
  const { show } = useSRKAlert();


  const { mutate, isPending } = useMutation({
    mutationKey: ["payout"],
    mutationFn: async ({
      userId,
      withDrawalAmount,
    }: {
      userId: string;
      withDrawalAmount: number;
    }) => {
      await bankApi.createBalancePayoutApi(userId, withDrawalAmount);
    },
    onSuccess: () => {
      show("Payout request successful", "success");
      navigate("/affiliate/bank");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data?.message || "Payout request failed", "error");
    },
  });

  const { data: userBalance } = useQuery<TEarningDetails | null>({
    queryKey: ["getUserBalance"],
    queryFn: async () => {
      return bankApi.getEarningDetailsofUserApi(userDetails!._id)
    },
    enabled: !!userDetails?._id
  })



  const calculateTDS = (amount: number) => {
    const tdsRate = 0.15; // 15% TDS
    return amount - amount * tdsRate;
  };

  const handleSubmit = async () => {
    const userId = userDetails?._id;
    if (!userId || !userBalance) return;

    if (userBalance.walletBalance === undefined) {
      show("Unable to fetch user balance", "error");
      return;
    }

    if (+amount > userBalance.walletBalance) {
      show("Insufficient balance", "error");
      return;
    }

    mutate({
      userId,
      withDrawalAmount: +amount,
    })

  };

  if (!userBalance) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen  bg-black pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            <Link to="/bank/dashboard"><span className="text-sm font-medium">Back to Dashboard</span></Link>
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Add Money 💰</h2>
          <p className="text-gray-400">Top up your SRK Bank account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-8">
            {/* Balance Card */}
            <div
              className="rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden mb-6"
              style={{
                background:
                  "linear-gradient(135deg, #1a1410 0%, #2a2520 50%, #1a1410 100%)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32"
                style={{
                  background:
                    "radial-gradient(circle, rgba(182, 137, 56, 0.15) 0%, transparent 70%)",
                }}
              ></div>
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background:
                    "linear-gradient(90deg, #e1ba73, #b68938, #e1ba73)",
                }}
              ></div>

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm mb-2" style={{ color: "#b68938" }}>
                    Current Balance
                  </p>
                  <h3 className="text-4xl font-bold text-white">
                    Nrs.{userBalance.walletBalance.toFixed(2)}
                  </h3>
                </div>
                <div
                  className="p-3 rounded-2xl backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(182, 137, 56, 0.2)" }}
                >
                  <Plus className="w-6 h-6" style={{ color: "#b68938" }} />
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-[#1a1a1a] rounded-3xl border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10">
              <div
                className="p-6"
                style={{ borderBottom: "1px solid rgba(182, 137, 56, 0.2)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgba(182, 137, 56, 0.1)" }}
                  >
                    <Plus className="w-5 h-5" style={{ color: "#b68938" }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Top Up Account
                    </h3>
                    <p className="text-sm text-gray-400">
                      Add funds to your srk bank account
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">


                <b className="text-red-500">15% TDS applied on withdrawal.</b>
                {/* Amount Input */}
                <div className="space-y-3">
                  <label htmlFor="amount" className="text-white font-medium block">
                    Amount to Add *
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold"
                      style={{ color: "#b68938" }}
                    >
                      Nrs.
                    </span>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-black/50 border border-[#b68938]/40 rounded-2xl px-4 pl-16 py-4 text-white text-2xl font-bold focus:outline-none focus:border-[#b68938] transition-colors placeholder:text-gray-600"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[50, 100, 200, 500].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset.toString())}
                        className="flex-1 py-2 px-4 rounded-xl bg-black/50 border border-[#b68938]/40 text-white hover:bg-[#b68938]/10 hover:border-[#b68938]/60 transition-all text-sm font-medium"
                      >
                        Nrs.{preset}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label htmlFor="amount" className="text-white font-medium block">
                    Amount after TDS Deduction
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold"
                      style={{ color: "#b68938" }}
                    >
                      Nrs.
                    </span>
                    <input
                      disabled
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={amount ? calculateTDS(Number.parseFloat(amount)).toFixed(2) : ""}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-black/50 border border-[#b68938]/40 rounded-2xl px-4 pl-16 py-4 text-white text-2xl font-bold focus:outline-none focus:border-[#b68938] transition-colors placeholder:text-gray-600"
                      placeholder="0.00"
                    />
                  </div>

                </div>

                {/* Payment Method */}
                {/* <div className="space-y-3">
                  <label className="text-white font-medium block">
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      return (
                        <div
                          key={method.id}
                          className={`p-5 rounded-2xl cursor-pointer transition-all relative overflow-hidden ${paymentMethod === method.id
                            ? "bg-[#b68938]/10 border-2 border-[#b68938] shadow-lg shadow-[#b68938]/20"
                            : "bg-black/50 border-2 border-[#b68938]/40 hover:border-[#b68938]/60"
                            }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          {paymentMethod === method.id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-[#b68938]/5 via-transparent to-[#b68938]/5"></div>
                          )}
                          <div className="flex items-center gap-4 relative z-10">
                            <div
                              className={`w-14 h-14 rounded-xl flex items-center justify-center p-2 flex-shrink-0 transition-all ${paymentMethod === method.id ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'
                                }`}
                            >
                              <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-semibold text-lg mb-1">
                                {method.name}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {method.description}
                              </p>
                            </div>
                            {paymentMethod === method.id && (
                              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: '#b68938' }}>
                                <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            {!paymentMethod || paymentMethod !== method.id ? (
                              <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div> */}

                {/* Demo Notice */}


                {/* Submit Button */}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleSubmit}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#b68938]/20"
                  style={{
                    background: isPending
                      ? "#666"
                      : "linear-gradient(135deg, #e1ba73, #b68938)",
                  }}
                >
                  {isPending
                    ? "Processing Payment..."
                    : `Add Nrs.${amount || "0.00"} to Srk Bank`}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Recent Deposits */}
            {/* <div className="bg-[#1a1a1a] rounded-3xl border border-[#b68938]/40 p-6">
              <h3 className="font-bold text-white mb-4">Recent Deposits</h3>
              <div className="space-y-3">
                {[
                  { amount: 500, date: "Oct 14, 2025", method: "eSewa" },
                  { amount: 250, date: "Oct 10, 2025", method: "Khalti" },
                  { amount: 1000, date: "Oct 5, 2025", method: "Card" },
                ].map((deposit, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-black/50 border border-[#b68938]/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">
                        +${deposit.amount}
                      </span>
                      <span className="text-xs" style={{ color: "#b68938" }}>
                        {deposit.method}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{deposit.date}</p>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Info Card */}
            <div
              className="rounded-3xl p-6 text-white relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #2a2520, #1a1410)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16"
                style={{
                  background:
                    "radial-gradient(circle, rgba(182, 137, 56, 0.2) 0%, transparent 70%)",
                }}
              ></div>
              <h3 className="text-lg font-bold mb-3 relative z-10">
                💡 Quick Tips
              </h3>
              <ul className="space-y-2 relative z-10">
                <li className="text-sm text-gray-300">
                  • Instant deposits with digital wallets
                </li>
                <li className="text-sm text-gray-300">
                  • Secure payment processing
                </li>
                <li className="text-sm text-gray-300">
                  • No hidden fees
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}