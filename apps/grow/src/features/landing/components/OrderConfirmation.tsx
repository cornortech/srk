import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { OrderDetails } from '../../../lib/types/types';

interface OrderConfirmationProps {
  orderDetails: OrderDetails;
  onBack: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ 
  orderDetails, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-[#0a0705] text-white pt-32 px-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center backdrop-blur-xl bg-white/5 border border-[#b68938]/30 rounded-3xl p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-[#b68938] to-[#e1ba73] rounded-full flex items-center justify-center text-black text-3xl font-bold shadow-2xl"
        >
          <CheckCircle size={48} />
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#b68938] to-[#e1ba73] bg-clip-text text-transparent">
          Order Confirmed!
        </h2>
        
        <p className="text-gray-400 mb-12 text-lg max-w-md mx-auto leading-relaxed">
          Your order for <strong>{orderDetails.packageType}</strong> package has been received. 
          You'll receive dashboard access and campaign updates within 24 hours.
        </p>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-12 max-w-md mx-auto">
          <h3 className="font-bold text-xl mb-6 text-[#b68938]">Order Details</h3>
          <div className="space-y-3 text-left text-sm">
            <div className="flex justify-between py-2 border-b border-white/10">
              <span>Transaction ID:</span>
              <span className="font-mono font-bold">{orderDetails.transactionId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span>Amount:</span>
              <span className="text-2xl font-bold text-[#b68938]">{orderDetails.amount}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Placed on:</span>
              <span>{new Date(orderDetails.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-4 rounded-3xl bg-white/10 hover:bg-white/20 border border-white/20 font-bold text-lg backdrop-blur-sm transition-all"
        >
          Back to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
};