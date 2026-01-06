import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GOLD_PRIMARY, SUCCESS } from '../constants';
import { formatRupees } from '../../../lib/utils/formatters';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  isSubmitting: boolean;
  currentBalance: number;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  currentBalance,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (withdrawAmount > currentBalance) {
      setError('Insufficient balance');
      return;
    }

    setError(null);
    onSubmit(withdrawAmount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    if (error) setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full rounded-3xl bg-gradient-to-br from-[#1a1410] to-[#0a0705] border border-white/10 p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Withdraw Funds
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Balance Card */}
              <div
                className="rounded-2xl p-6 border border-white/5 relative overflow-hidden"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <div className="relative z-10">
                  <p className="text-sm text-gray-400 mb-1">
                    Available Balance
                  </p>
                  <p className="text-3xl font-bold text-[#E1BA73]">
                    {formatRupees(currentBalance)}
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg
                    className="w-12 h-12 text-[#E1BA73]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.89 10 8V16C10 17.11 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" />
                  </svg>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">
                    Withdrawal Amount
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 group-focus-within:text-[#E1BA73] transition-colors">
                        ₹
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      autoFocus
                      className={`w-full bg-white/5 border ${
                        error ? 'border-red-500/50' : 'border-white/10'
                      } rounded-2xl pl-8 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E1BA73]/20 focus:border-[#E1BA73]/50 transition-all font-medium text-lg`}
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-400 ml-1 animate-pulse">
                      {error}
                    </p>
                  )}
                </div>

                <p className="text-[11px] text-gray-500 px-1 leading-relaxed">
                  * Funds will be transferred to your registered bank account
                  after admin approval. Payouts might take up to 24-48 working
                  hours.
                </p>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={!amount || isSubmitting || currentBalance <= 0}
                    className="w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-[#E1BA73]/10 hover:shadow-[#E1BA73]/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${GOLD_PRIMARY}, #9a7434)`,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      'Confirm Withdrawal'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 text-sm font-medium text-gray-500 hover:text-white transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
