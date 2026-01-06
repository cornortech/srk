import { motion } from 'framer-motion';
import { useState } from 'react';

interface PayoutApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transactionId: string, paymentUrl?: string) => void;
  isApproving: boolean;
  payoutAmount: number;
}

export const PayoutApprovalModal: React.FC<PayoutApprovalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isApproving,
  payoutAmount,
}) => {
  const [transactionId, setTransactionId] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  const handleSubmit = () => {
    if (transactionId.trim()) {
      onSubmit(transactionId, paymentUrl || undefined);
      setTransactionId('');
      setPaymentUrl('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full rounded-2xl bg-gradient-to-br from-[#1a1410] to-[#0a0705] border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Approve Payout</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="text-white">✕</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-emerald-600/10 border border-emerald-600/20 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-400 mb-1">Payout Amount</p>
            <p className="text-2xl font-bold text-emerald-400">
              ₹{payoutAmount.toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Transaction ID *
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Payment Screenshot URL (Optional)
            </label>
            <input
              type="text"
              value={paymentUrl}
              onChange={(e) => setPaymentUrl(e.target.value)}
              placeholder="Enter payment screenshot URL..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!transactionId.trim() || isApproving}
              className={`px-4 py-2 rounded-lg transition-colors ${
                transactionId.trim()
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isApproving ? 'Approving...' : 'Approve Payout'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
