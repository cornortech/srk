import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { RejectionModalProps } from '../../types';
import { CARD_BG } from '../../constants/theme';

export const RejectionModal: React.FC<RejectionModalProps> = React.memo(
  ({ isOpen, onClose, onConfirm, taskName, username }) => {
    const [rejectionReason, setRejectionReason] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showError, setShowError] = useState(false);

    const handleSubmit = useCallback(() => {
      if (!rejectionReason.trim()) {
        setShowError(true);
        return;
      }
      setShowError(false);

      setIsSubmitting(true);
      setTimeout(() => {
        onConfirm(rejectionReason);
        setIsSubmitting(false);
        setRejectionReason('');
      }, 500);
    }, [rejectionReason, onConfirm]);

    const handleClose = useCallback(() => {
      setRejectionReason('');
      setShowError(false);
      onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-md rounded-2xl border border-gray-700/50 shadow-2xl"
            style={{
              background: CARD_BG,
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-900/30">
                  <AlertCircle className="text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Reject Task Submission
                  </h3>
                  <p className="text-sm text-gray-400">
                    Provide a reason for rejection
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Task:</p>
                <p className="font-medium text-white bg-gray-800/30 p-3 rounded-lg">
                  {taskName}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">Submitted by:</p>
                <p className="font-medium text-[#E1BA73] bg-gray-800/30 p-3 rounded-lg">
                  {username}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">
                  Rejection Reason *
                  <span className="text-red-400 ml-1">(Required)</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (e.target.value.trim()) setShowError(false);
                  }}
                  placeholder="Please provide a clear reason for rejecting this task submission. This will be shown to the user."
                  className={`w-full h-32 p-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors resize-none ${
                    showError
                      ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500'
                      : 'border-gray-700 focus:border-[#E1BA73]/50 focus:ring-1 focus:ring-[#E1BA73]/30'
                  }`}
                />
                {showError && (
                  <p className="text-sm text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle size={16} /> Rejection reason is mandatory.
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  The user will receive this feedback. Be specific and
                  constructive.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  Quick select common reasons:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Incomplete proof',
                    "Proof doesn't match task requirements",
                    'Low quality submission',
                    'Violates community guidelines',
                    'Duplicate submission',
                    'Insufficient evidence',
                  ].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => {
                        setRejectionReason(reason);
                        setShowError(false);
                      }}
                      className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-700/50">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-red-700 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: !isSubmitting ? 1.02 : 1 }}
                whileTap={{ scale: !isSubmitting ? 0.98 : 1 }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <X size={16} />
                    Confirm Rejection
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }
);
