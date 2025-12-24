import { CheckCircle, Clock, Crown, Info, X } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

const DashboardStatusBadge: React.FC<{
  status: string;
  small?: boolean;
  pulse?: boolean;
}> = ({ status, small = false, pulse = false }) => {
  const getConfig = () => {
    switch (status) {
      case 'Active':
      case 'Approved':
      case 'Completed':
      case 'Verified':
        return {
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          border: 'border-emerald-500/20',
          icon: <CheckCircle size={small ? 10 : 12} />,
        };
      case 'Inactive':
      case 'Rejected':
        return {
          bg: 'bg-rose-500/10',
          text: 'text-rose-400',
          border: 'border-rose-500/20',
          icon: <X size={small ? 10 : 12} />,
        };
      case 'Pending':
      case 'In Review':
      case 'Pending Verification':
      case 'Available':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/20',
          icon: <Clock size={small ? 10 : 12} />,
        };
      case 'Premium':
      case 'SRK Grow':
        return {
          bg: 'bg-purple-500/10',
          text: 'text-purple-400',
          border: 'border-purple-500/20',
          icon: <Crown size={small ? 10 : 12} />,
        };
      default:
        return {
          bg: 'bg-zinc-500/10',
          text: 'text-zinc-400',
          border: 'border-zinc-500/20',
          icon: <Info size={small ? 10 : 12} />,
        };
    }
  };

  const config = getConfig();
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: pulse
          ? [
              '0 0 0 0 rgba(59, 130, 246, 0.7)',
              '0 0 0 10px rgba(59, 130, 246, 0)',
            ]
          : 'none',
      }}
      transition={{
        duration: 0.3,
        boxShadow: pulse ? { repeat: Infinity, duration: 1.5 } : {},
      }}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
        config.bg
      } ${config.text} border ${config.border} backdrop-blur-sm ${
        small ? 'px-2 py-0.5 text-xs' : ''
      }`}
    >
      {config.icon}
      {status}
    </motion.span>
  );
};

export default DashboardStatusBadge;
