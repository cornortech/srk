import {
  User,
  FileText,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Wallet,
  QrCode,
  CreditCard,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { bankApi } from '../../utils/api/bank/bank.api';
import useAuthStore from '../../store/useAuth';
import { TBankStatement } from '../../utils/types/bank.type';
import { Spinner } from '@nextui-org/react';
import { useEffect } from 'react';
import { TAuthState } from '../../utils/types/auth/auth.type';

export default function ModernBankDashboard() {
  const { userDetails, srkBank } = useAuthStore();

  const { data: transactionData } = useQuery<{ data: TBankStatement[] }>({
    queryKey: ['srk-bank-transactions', userDetails?._id],
    queryFn: async () => {
      return bankApi.getBankStatementOfUser(userDetails?._id || '');
    },
    enabled: !!userDetails?._id,
  });

  const { data: BankDetails } = useQuery<{ data: any }>({
    queryKey: ['srk-bank-details', userDetails?._id],
    queryFn: async () => {
      return bankApi.getBankDetailsByUserId(userDetails?._id || '');
    },
    enabled: !!userDetails?._id,
  });

  useEffect(() => {
    const newAccountno = BankDetails?.data?.srkBankDetails?.accountNumber;
    if (newAccountno && newAccountno != srkBank?.accountNumber) {
      useAuthStore.setState((state) => ({
        srkBank: {
          ...state.srkBank,
          accountNumber: newAccountno,
        } as TAuthState['srkBank'],
      }));
    }
  }, [BankDetails]);

  const { data: balance } = useQuery<{ data: any }>({
    queryKey: ['srk-bank-balance', userDetails?._id],
    queryFn: async () => {
      return bankApi.getBankBalance(userDetails?._id || '');
    },
    enabled: !!userDetails?._id,
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'receive':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
      case 'payout_request':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'send':
        return <Send className="w-4 h-4" style={{ color: '#b68938' }} />;
      default:
        return <Wallet className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'receive':
        return 'text-green-500';
      case 'withdrawal':
      case 'payout_request':
      case 'send':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!transactionData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner color="warning" size="lg" />
          <p className="text-[#b68938] font-medium animate-pulse">
            Syncing your accounts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar with Gold Accent */}

      <div className="max-w-[91%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userDetails?.firstName}! 👋
          </h2>
          <p className="text-gray-400">
            Here's what's happening with your money today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Balance Card - Gold Gradient */}
            <div
              className="rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, #1a1410 0%, #2a2520 50%, #1a1410 100%)',
              }}
            >
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32"
                style={{
                  background:
                    'radial-gradient(circle, rgba(182, 137, 56, 0.15) 0%, transparent 70%)',
                }}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24"
                style={{
                  background:
                    'radial-gradient(circle, rgba(182, 137, 56, 0.1) 0%, transparent 70%)',
                }}
              ></div>

              {/* Top decorative line */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background:
                    'linear-gradient(90deg, #e1ba73, #b68938, #e1ba73)',
                }}
              ></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm mb-2" style={{ color: '#b68938' }}>
                      Total Balance
                    </p>
                    <h3 className="text-5xl font-bold text-white">
                      NRs.
                      {balance?.data?.balance?.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                    </h3>
                  </div>
                  <div
                    className="p-3 rounded-2xl backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.2)' }}
                  >
                    <Activity
                      className="w-6 h-6"
                      style={{ color: '#b68938' }}
                    />
                  </div>
                </div>

                <div
                  className="flex items-center justify-between pt-6"
                  style={{ borderTop: '1px solid rgba(182, 137, 56, 0.2)' }}
                >
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#b68938' }}>
                      Account Number
                    </p>
                    <p className="font-mono text-lg font-medium text-white">
                      {BankDetails?.data?.srkBankDetails?.accountNumber}
                    </p>
                  </div>
                  {/* <div className="flex gap-2">
                    <div
                      className="w-12 h-8 rounded backdrop-blur-sm"
                      style={{ backgroundColor: 'rgba(182, 137, 56, 0.2)' }}
                    ></div>
                    <div
                      className="w-12 h-8 rounded backdrop-blur-sm"
                      style={{ backgroundColor: 'rgba(182, 137, 56, 0.2)' }}
                    ></div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4">
              <Link to={'/dashboard/send-money'} className="w-full">
                <button className="w-full bg-[#1a1a1a] rounded-2xl p-6 hover:shadow-lg transition-all border border-[#b68938]/40 group hover:border-[#b68938]/60">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto transition-colors"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <Send className="w-5 h-5" style={{ color: '#b68938' }} />
                  </div>
                  <p className="font-semibold text-white mb-1 text-center">
                    Send
                  </p>
                  <p className="text-xs text-gray-400 text-center">
                    Transfer money
                  </p>
                </button>
              </Link>
              <Link to="/dashboard/withdraw-money">
                <button className="w-full bg-[#1a1a1a] rounded-2xl p-6 hover:shadow-lg transition-all border border-[#b68938]/40 group hover:border-[#b68938]/60">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto transition-colors"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <ArrowUpRight
                      className="w-5 h-5"
                      style={{ color: '#b68938' }}
                    />
                  </div>
                  <p className="font-semibold text-white mb-1 text-center">
                    Withdraw
                  </p>
                  <p className="text-xs text-gray-400 text-center">Cash out</p>
                </button>
              </Link>

              <Link to="/dashboard/addMoney">
                <button className="w-full bg-[#1a1a1a] rounded-2xl p-6 hover:shadow-lg transition-all border border-[#b68938]/40 group hover:border-[#b68938]/60">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto transition-colors"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <Plus className="w-5 h-5" style={{ color: '#b68938' }} />
                  </div>
                  <p className="font-semibold text-white mb-1 text-center">
                    Add Money
                  </p>
                  <p className="text-xs text-gray-400 text-center">
                    Deposit funds
                  </p>
                </button>
              </Link>

              <Link to="/dashboard/QRpay">
                <button className="w-full bg-[#1a1a1a] rounded-2xl p-6 hover:shadow-lg transition-all border border-[#b68938]/40 group hover:border-[#b68938]/60">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto transition-colors"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <QrCode className="w-5 h-5" style={{ color: '#b68938' }} />
                  </div>
                  <p className="font-semibold text-white mb-1 text-center">
                    QR Payment
                  </p>
                  <p className="text-xs text-gray-400 text-center">
                    Scan & pay
                  </p>
                </button>
              </Link>
            </div>

            {/* Transactions */}
            <div className="bg-[#1a1a1a] rounded-3xl border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10">
              <div
                className="p-6"
                style={{ borderBottom: '1px solid rgba(182, 137, 56, 0.2)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Recent Activity
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Your latest transactions
                    </p>
                  </div>
                  <Link to="/dashboard/account/statement">
                    <button
                      className="text-sm font-medium hover:opacity-80 flex items-center gap-1 transition-opacity"
                      style={{ color: '#b68938' }}
                    >
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              <div
                className="divide-y"
                style={{ borderColor: 'rgba(182, 137, 56, 0.1)' }}
              >
                {transactionData?.data?.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="p-6 hover:bg-[#2a2520]/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                        >
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-semibold text-white mb-1">
                            {transaction.description ||
                              'Something went wrong to fetch description'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {moment(transaction.createdAt).format(
                              'MMM D, YYYY h:mm A',
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-lg ${getTransactionColor(
                            transaction.type,
                          )}`}
                        >
                          {['send', 'withdrawal', 'payout_request'].includes(
                            transaction.type,
                          )
                            ? '-'
                            : '+'}
                          ${transaction.amount.toLocaleString()}
                        </p>
                        <span
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1"
                          style={{
                            backgroundColor: 'rgba(182, 137, 56, 0.2)',
                            color: '#b68938',
                          }}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stats */}
            {/* <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#b68938]/40">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: "rgba(182, 137, 56, 0.1)" }}
                >
                  <TrendingUp
                    className="w-5 h-5"
                    style={{ color: "#b68938" }}
                  />
                </div>
                <p className="text-sm text-gray-400 mb-1">Income</p>
                <p className="text-2xl font-bold text-white">$5,050</p>
                <p className="text-xs text-green-500 mt-2">+12% this month</p>
              </div>

              <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#b68938]/40">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: "rgba(182, 137, 56, 0.1)" }}
                >
                  <CreditCard
                    className="w-5 h-5"
                    style={{ color: "#b68938" }}
                  />
                </div>
                <p className="text-sm text-gray-400 mb-1">Expenses</p>
                <p className="text-2xl font-bold text-white">$1,234</p>
                <p className="text-xs text-red-500 mt-2">-8% this month</p>
              </div>
            </div> */}

            {/* Goals Card */}
            {/* <div
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
                Savings Goal
              </h3>
              <div className="mb-4 relative z-10">
                <div className="flex justify-between text-sm mb-2">
                  <span>Vacation Fund</span>
                  <span style={{ color: "#b68938" }}>75%</span>
                </div>
                <div className="w-full rounded-full h-2 bg-black/30">
                  <div
                    className="rounded-full h-2"
                    style={{
                      width: "75%",
                      background: "linear-gradient(90deg, #e1ba73, #b68938)",
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-300 relative z-10">
                $3,750 of $5,000
              </p>
            </div> */}

            {/* Quick Links */}
            <div className="bg-[#1a1a1a] rounded-3xl border border-[#b68938]/40 p-6">
              <h3 className="font-bold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  {
                    icon: User,
                    label: 'Account Settings',
                    url: '/dashboard/account/settings',
                  },
                  {
                    icon: FileText,
                    label: 'Statements',
                    url: '/dashboard/account/statement',
                  },
                  {
                    icon: CreditCard,
                    label: 'Payouts',
                    url: '/dashboard/account/payouts',
                  },
                  {
                    icon: Plus,
                    label: 'Add Money',
                    url: '/dashboard/addMoney',
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link to={item.url}>
                      <button
                        key={idx}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#2a2520]/50 transition-colors group"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{ color: '#b68938' }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                          {item.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                      </button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
