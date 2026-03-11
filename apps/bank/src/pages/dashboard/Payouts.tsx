import { useState } from "react";
import { ArrowLeft, History, ExternalLink, ShieldCheck, Zap, AlertCircle, Coins, ArrowDownToLine } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../store/useAuth";
import { bankApi } from "../../utils/api/bank/bank.api";
import { TTaskPayout } from "../../utils/types/bank.type";
import moment from "moment";
import { Spinner } from "@nextui-org/react";

type Tab = "university" | "task";

// Bank statement entry type
type TBankStatementEntry = {
  _id: string;
  username: string;
  profilePicture: string;
  amount: number;
  bankId: string;
  description: string;
  currentAmount: number;
  type: string;
  createdAt: string;
  updatedAt: string;
};

export function BankPayout() {
  const [activeTab, setActiveTab] = useState<Tab>("university");
  const { userDetails } = useAuthStore();

  // University payouts: use bank statement, filtered to deposit type
  const { data: bankStatementRaw, isLoading: isUniLoading } = useQuery<TBankStatementEntry[]>({
    queryKey: ["bank-statement-deposits", userDetails?._id],
    queryFn: async () => {
      const res = await bankApi.getBankStatementOfUser(userDetails?._id || "");
      return res.data;
    },
    enabled: !!userDetails?._id,
  });

  // Filter to only deposits (from addMoney), exclude send/receive
  const universityDeposits = (bankStatementRaw ?? []).filter(
    (s) => s.type === "deposit" && s.description?.toLowerCase().includes("balance deposit")
  );

  const taskDeposits = (bankStatementRaw ?? []).filter(
    (s) => s.type === "deposit" && s.description?.toLowerCase().includes("coins")
  );

  // Task payouts from srkTasksEarningsPayoutModel
  const { data: taskPayouts, isLoading: isTaskLoading } = useQuery<{ data: TTaskPayout[] }>({
    queryKey: ["task-payouts", userDetails?._id],
    queryFn: async () => {
      // We need taskUserId for this — try fetching from verification or fall back to bank statement coins
      const res = await bankApi.getSrkTaskAffiliateVerificationRequestApi(userDetails?._id || "");
      return res;
    },
    enabled: false, // will rely on bank statement coins deposits instead for now
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      completed: "bg-green-500/10 text-green-400 border-green-500/20",
      approved: "bg-green-500/10 text-green-400 border-green-500/20",
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      rejected: "bg-red-500/10 text-red-400 border-red-500/20",
      failed: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return map[status?.toLowerCase()] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const renderEmpty = (label: string) => (
    <div className="p-16 text-center">
      <History className="w-12 h-12 mx-auto mb-4 opacity-10" />
      <p className="text-gray-500 font-medium">No {label} payout history found.</p>
      <p className="text-gray-600 text-sm mt-1">Transactions will appear here after you add money.</p>
    </div>
  );

  const renderUniversityTab = () => {
    if (isUniLoading) return <div className="p-8 flex justify-center"><Spinner color="warning" /></div>;
    if (!universityDeposits.length) return renderEmpty("university");
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
              <th className="pb-4 pr-4 font-medium">Date</th>
              <th className="pb-4 pr-4 font-medium">Description</th>
              <th className="pb-4 pr-4 font-medium">Amount (Nrs)</th>
              <th className="pb-4 pr-4 font-medium">Balance After</th>
              <th className="pb-4 font-medium">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {universityDeposits.map((s) => (
              <tr key={s._id} className="text-white hover:bg-white/[0.02] transition-colors">
                <td className="py-4 pr-4 text-sm text-gray-400">{moment(s.createdAt).format("MMM DD, YYYY h:mm A")}</td>
                <td className="py-4 pr-4 text-sm">{s.description}</td>
                <td className="py-4 pr-4">
                  <span className="text-green-400 font-bold">+ Nrs. {s.amount.toLocaleString()}</span>
                </td>
                <td className="py-4 pr-4 text-sm text-gray-400">Nrs. {s.currentAmount?.toLocaleString()}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge("completed")}`}>
                    COMPLETED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTaskTab = () => {
    if (isUniLoading) return <div className="p-8 flex justify-center"><Spinner color="warning" /></div>;
    if (!taskDeposits.length) return renderEmpty("task app");
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
              <th className="pb-4 pr-4 font-medium">Date</th>
              <th className="pb-4 pr-4 font-medium">Description</th>
              <th className="pb-4 pr-4 font-medium">Amount Deposited</th>
              <th className="pb-4 pr-4 font-medium">Balance After</th>
              <th className="pb-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {taskDeposits.map((s) => (
              <tr key={s._id} className="text-white hover:bg-white/[0.02] transition-colors">
                <td className="py-4 pr-4 text-sm text-gray-400">{moment(s.createdAt).format("MMM DD, YYYY h:mm A")}</td>
                <td className="py-4 pr-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Coins className="w-3 h-3 text-amber-400 shrink-0" />
                    {s.description}
                  </div>
                </td>
                <td className="py-4 pr-4">
                  <span className="text-green-400 font-bold">+ Nrs. {s.amount.toLocaleString()}</span>
                </td>
                <td className="py-4 pr-4 text-sm text-gray-400">Nrs. {s.currentAmount?.toLocaleString()}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge("completed")}`}>
                    COMPLETED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button className="flex items-center gap-2 text-gray-400 hover:text-[#b68938] transition-colors mb-2">
              <ArrowLeft className="w-4 h-4" />
              <Link to="/dashboard" className="text-sm font-medium">Back to Dashboard</Link>
            </button>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ArrowDownToLine className="w-7 h-7 text-[#b68938]" />
              Payout History
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Track your earnings deposits to SRK Bank</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[#1a1a1a] p-1 rounded-2xl border border-[#b68938]/20 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("university")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "university"
                ? "bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black shadow-lg"
                : "text-gray-400 hover:text-white"}`}
            >
              <ShieldCheck className="w-4 h-4" />
              University
              {universityDeposits.length > 0 && (
                <span className="ml-1 bg-black/20 px-1.5 py-0.5 rounded-lg text-[10px]">{universityDeposits.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("task")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "task"
                ? "bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black shadow-lg"
                : "text-gray-400 hover:text-white"}`}
            >
              <Zap className="w-4 h-4" />
              Task App
              {taskDeposits.length > 0 && (
                <span className="ml-1 bg-black/20 px-1.5 py-0.5 rounded-lg text-[10px]">{taskDeposits.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[#1a1a1a] border border-[#b68938]/20 rounded-3xl p-5 mb-6 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-[#b68938]/10 text-[#b68938] shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">About Payouts</h3>
            <p className="text-gray-400 text-sm mt-0.5">
              All deposits include a 15% TDS deduction. University deposits are instant.
              Task coin conversions (100 coins = Nrs. 1) are processed immediately after approval.
            </p>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-[#111] border border-[#b68938]/10 rounded-3xl p-6 shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b68938]/30 to-transparent rounded-t-3xl" />
          {activeTab === "university" ? renderUniversityTab() : renderTaskTab()}
        </div>

        {/* <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Questions about your payouts?{" "}
            <a href="#" className="text-[#b68938] hover:underline inline-flex items-center gap-1">
              Contact Support <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
}
