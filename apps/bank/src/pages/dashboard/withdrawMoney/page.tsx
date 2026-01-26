import { ArrowLeft, Wallet, AlertCircle, Shield, Clock, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/useAuth';
import { useSRKAlert } from '@srk/shared/hooks';
import { bankApi } from '../../../utils/api/bank/bank.api';

export default function WithdrawMoneyPage() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  // const [selectedMethod, setSelectedMethod] = useState('');
  const { userDetails } = useAuthStore();

  const navigate = useNavigate();
  const { show } = useSRKAlert();

  // const paymentMethods = [
  //   { id: 'esewa', name: 'eSewa', logo: 'https://cdn.esewa.com.np/ui/images/logos/esewa_logo.png' },
  //   { id: 'khalti', name: 'Khalti', logo: 'https://blog.khalti.com/wp-content/uploads/2017/11/favicon-e1509629244768.png'},
  //   { id: 'bank', name: 'Bank Transfer', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' }
  // ];


  // const { data: earningDetails, refetch: refetchEarningDetails } = useQuery<
  //   TEarningDetails | undefined
  // >({
  //   queryKey: ["getEarningDetailsofUserApi", userDetails?._id],
  //   queryFn: () => {
  //     if (!userDetails?._id) return;
  //     return getEarningDetailsofUserApi(userDetails?._id);
  //   },
  //   enabled: !!userDetails?._id,
  // });


  const { mutate: srkBankPayoutMutation } = useMutation({
    mutationFn: async (data: { userId: string; amount: number }) => {
      await bankApi.srkBankPayoutRequestApi(data.userId, data.amount);
    },
    onSuccess: () => {
      // refetchEarningDetails();
      navigate("/affiliate/payout");
      show("Payout request successful", "success");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data?.message || "Payout request failed", "error");
    },
  });

  const handlePayout = (amount: number) => {
    if (amount < 500) {
      show("You can't payout less than Rs.500", "error");
      return;
    }
    if (userDetails?._id) {
      srkBankPayoutMutation({
        userId: userDetails?._id,
        amount: amount,
      });
    }
  };

  return (
    <div className="min-h-screen relative top-[15vh] bg-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:bg-[#b68938]/10"
            style={{ backgroundColor: 'rgba(182, 137, 56, 0.05)' }}>
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Request Withdrawal</h1>
          <p className="text-gray-400">Transfer funds to your preferred payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a1a] rounded-3xl border border-[#b68938]/40 p-8">
              {/* Withdrawal Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#b68938' }}>
                  <DollarSign className="w-4 h-4" />
                  Withdrawal Amount
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#b68938]/20 via-[#b68938]/5 to-[#b68938]/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity blur"></div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <span className="text-xl font-semibold" style={{ color: '#b68938' }}>₨</span>
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-black/50 border border-[#b68938]/30 rounded-2xl pl-12 pr-20 py-5 text-white text-2xl font-bold focus:outline-none focus:border-[#b68938] focus:bg-black/70 transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <span className="text-sm font-semibold px-3 py-1 rounded-lg" style={{ backgroundColor: 'rgba(182, 137, 56, 0.2)', color: '#b68938' }}>
                        NPR
                      </span>
                    </div>
                  </div>
                </div>
                {amount && parseFloat(amount) < 100 && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Minimum withdrawal amount is NPR 100
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: '#b68938' }}>
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a note for this withdrawal..."
                  rows={4}
                  className="w-full bg-black/50 border border-[#b68938]/30 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#b68938] transition-colors resize-none"
                />
              </div>

              {/* Payment Method */}
              {/* <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: '#b68938' }}>
                  Payment Method
                </label>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all group relative overflow-hidden ${
                        selectedMethod === method.id
                          ? 'border-[#b68938] bg-[#b68938]/10 shadow-lg shadow-[#b68938]/20'
                          : 'border-[#b68938]/30 bg-black/50 hover:border-[#b68938]/50 hover:bg-[#b68938]/5'
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#b68938]/5 via-transparent to-[#b68938]/5"></div>
                      )}
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center p-2 transition-all ${
                          selectedMethod === method.id ? 'bg-white/10' : 'bg-white/5 group-hover:bg-white/10'
                        }`}>
                          <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-white block">{method.name}</span>
                          <span className="text-xs text-gray-400">Instant transfer</span>
                        </div>
                      </div>
                      <div className="relative z-10 flex items-center gap-2">
                        {selectedMethod === method.id && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#b68938' }}>
                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <ChevronRight className={`w-5 h-5 transition-colors ${
                          selectedMethod === method.id ? 'text-[#b68938]' : 'text-gray-500'
                        }`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Submit Button */}
              <button
                onClick={() => handlePayout(parseFloat(amount))}
                disabled={!amount}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all relative overflow-hidden group ${amount
                  ? 'hover:shadow-xl hover:shadow-[#b68938]/30 hover:scale-[1.02]'
                  : 'opacity-50 cursor-not-allowed'
                  }`}
                style={{ background: 'linear-gradient(135deg, #e1ba73, #b68938, #8a6b2e)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Request Withdrawal
                </span>
              </button>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Limits & Fees */}
            <div className="bg-[#1a1a1a] rounded-3xl border border-[#b68938]/40 p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5" style={{ color: '#b68938' }} />
                Withdrawal Info
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-400">Minimum Amount</span>
                  <span className="text-sm font-semibold text-white">NPR 100</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-400">Daily Limit</span>
                  <span className="text-sm font-semibold text-white">NPR 50,000</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-400">Processing Fee</span>
                  <span className="text-sm font-semibold" style={{ color: '#b68938' }}>Free</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-400">Processing Time</span>
                  <span className="text-sm font-semibold text-white">24 Hours</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="rounded-3xl p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #2a2520, #1a1410)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16"
                style={{ background: 'radial-gradient(circle, rgba(182, 137, 56, 0.2) 0%, transparent 70%)' }}></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5" style={{ color: '#b68938' }} />
                  <h3 className="font-bold text-white">Security Notice</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#b68938' }} />
                    <p className="text-sm text-gray-300">
                      Always verify payment details before confirming
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#b68938' }} />
                    <p className="text-sm text-gray-300">
                      Withdrawals are processed within 24 hours
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#b68938' }} />
                    <p className="text-sm text-gray-300">
                      Your funds are protected with bank-level security
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#1a1a1a] rounded-3xl border border-[#b68938]/40 p-6">
              <h3 className="font-bold text-white mb-4">Today's Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Withdrawals</span>
                  <span className="text-sm font-semibold text-white">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Remaining Limit</span>
                  <span className="text-sm font-semibold" style={{ color: '#b68938' }}>NPR 50,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}