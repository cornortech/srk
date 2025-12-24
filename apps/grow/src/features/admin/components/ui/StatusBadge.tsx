import { useCallback } from 'react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getConfig = useCallback(() => {
    switch (status) {
      case 'Active':
      case 'Approved':
        return {
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          border: 'border-emerald-500/20',
        };
      case 'Inactive':
      case 'Rejected':
        return {
          bg: 'bg-rose-500/10',
          text: 'text-rose-400',
          border: 'border-rose-500/20',
        };
      case 'Pending':
      case 'In Review':
      case 'Pending Verification':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/20',
        };
      case 'Package Timed Out':
        return {
          bg: 'bg-rose-900/20',
          text: 'text-rose-300',
          border: 'border-rose-600/30',
        };
      default:
        return {
          bg: 'bg-zinc-500/10',
          text: 'text-zinc-400',
          border: 'border-zinc-500/20',
        };
    }
  }, [status]);

  const config = getConfig();

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border} backdrop-blur-sm`}
    >
      {status}
    </motion.span>
  );
};
