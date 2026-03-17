import { ArrowLeft, ArrowRight, ArrowDown, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../store/useAuth";
import { bankApi } from "../../utils/api/bank/bank.api";
import moment from "moment";
import { Spinner } from "@nextui-org/react";

type TStatementEntry = {
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

export default function SendMoneyHistoryPage() {
  const { userDetails } = useAuthStore();

  const { data: statementRaw, isLoading } = useQuery<TStatementEntry[]>({
    queryKey: ["bank-statement-send-receive", userDetails?._id],
    queryFn: async () => {
      const res = await bankApi.getBankStatementOfUser(userDetails?._id || "");
      return res.data;
    },
    enabled: !!userDetails?._id,
  });

  // Show send + receive transactions
  const transfers = (statementRaw ?? []).filter(
    (s) => s.type === "send" || s.type === "receive"
  );

  const isSend = (type: string) => type === "send";

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center gap-2 text-gray-400 hover:text-[#b68938] transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" />
            <Link to="/dashboard" className="text-sm font-medium">Back to Dashboard</Link>
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#b68938]/10 text-[#b68938]">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Transfer History</h1>
              <p className="text-gray-400 text-sm mt-0.5">All send & receive transactions between SRK Bank accounts</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#111] border border-red-500/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">Total Sent</p>
            <p className="text-2xl font-black text-red-400">
              Nrs. {transfers.filter(t => t.type === "send").reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">{transfers.filter(t => t.type === "send").length} transactions</p>
          </div>
          <div className="bg-[#111] border border-green-500/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">Total Received</p>
            <p className="text-2xl font-black text-green-400">
              Nrs. {transfers.filter(t => t.type === "receive").reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">{transfers.filter(t => t.type === "receive").length} transactions</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-[#111] border border-white/5 rounded-3xl p-6 shadow-2xl">
          {isLoading ? (
            <div className="p-16 flex justify-center"><Spinner color="warning" size="lg" /></div>
          ) : transfers.length === 0 ? (
            <div className="p-16 text-center">
              <Send className="w-12 h-12 mx-auto mb-4 opacity-10" />
              <p className="text-gray-500 font-medium">No transfer history yet.</p>
              <p className="text-gray-600 text-sm mt-1">Send money to another SRK Bank account to see transactions here.</p>
              <Link
                to="/dashboard/send-money"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-[#b68938]/10 text-[#b68938] border border-[#b68938]/20 hover:bg-[#b68938]/20 transition-all font-bold text-sm"
              >
                <Send className="w-4 h-4" /> Send Money Now
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {transfers.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isSend(t.type) ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                      {isSend(t.type) ? <ArrowRight className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">
                        {isSend(t.type) ? "Money Sent" : "Money Received"}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">{moment(t.createdAt).format("MMM DD, YYYY · h:mm A")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black ${isSend(t.type) ? "text-red-400" : "text-green-400"}`}>
                      {isSend(t.type) ? "−" : "+"} Nrs. {t.amount.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs">Balance: Nrs. {t.currentAmount?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
