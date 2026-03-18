import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle } from 'lucide-react';
import { GoldButton } from '../ui/GoldButton';

interface BulkApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  isProcessing: boolean;
}

export const BulkApprovalModal: React.FC<BulkApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  count,
  isProcessing,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-[#111111] border border-[#E1BA73]/20 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Bulk Approval</h3>
                  <p className="text-sm text-gray-400">Action confirmation</p>
                </div>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    You are about to approve <span className="text-emerald-400 font-bold">{count}</span> task submissions.
                    This will credit coins to all respective users immediately.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-bold hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <GoldButton
                  onClick={onConfirm}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 text-sm uppercase"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Approval'}
                </GoldButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
