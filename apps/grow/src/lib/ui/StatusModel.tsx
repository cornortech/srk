import React, { useRef, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { StatusModalProps } from '../types/types';

const StatusModal: React.FC<StatusModalProps> = ({ 
  status, 
  userName, 
  onClose, 
  onSuccess 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      if (status?.type === 'success') onSuccess();
      else onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick as any}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className={`max-w-md w-full rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl ${
          status?.type === 'success'
            ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30'
            : 'bg-gradient-to-br from-red-900/30 to-rose-900/30 border border-red-500/30'
        }`}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              status?.type === 'success'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-red-500 to-rose-500'
            }`}
          >
            {status?.type === 'success' ? (
              <CheckCircle size={40} className="text-white" />
            ) : (
              <X size={40} className="text-white" />
            )}
          </motion.div>
          
          <motion.div>
            <h2 className="text-3xl font-bold mb-4">
              {status?.type === 'success' ? 'Request Received!' : 'Payment Failed'}
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              {status?.type === 'success'
                ? `Dear ${userName}, your payment request has been submitted successfully. You'll receive dashboard access after system verification.`
                : 'There was an issue processing your payment. Please try again or contact support.'}
            </p>
          </motion.div>

          <div className="flex gap-4 justify-center">
            {status?.type === 'error' && (
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-sm uppercase tracking-widest transition-all"
              >
                Try Again
              </button>
            )}
            <button
              onClick={status?.type === 'success' ? onSuccess : onClose}
              className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${
                status?.type === 'success'
                  ? 'bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_30px_30px_rgba(182,137,56,0.5)]'
                  : 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-[0_30px_30px_rgba(239,68,68,0.5)]'
              }`}
            >
              {status?.type === 'success' ? 'Continue' : 'Back to Packages'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatusModal;