import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

const FloatingNotification: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500/30',
          icon: <CheckCircle className="text-emerald-400" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-500/20',
          border: 'border-rose-500/30',
          icon: <AlertTriangle className="text-rose-400" />,
        };
      default:
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30',
          icon: <Info className="text-blue-400" />,
        };
    }
  };

  const config = getConfig();

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`fixed top-6 right-6 ${config.bg} border ${config.border} backdrop-blur-lg rounded-xl p-4 min-w-[300px] z-50`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5">{config.icon}</div>
        <p className="text-sm text-white flex-1">{message}</p>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default FloatingNotification;
