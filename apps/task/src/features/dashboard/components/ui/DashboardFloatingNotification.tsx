import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import React from 'react';

const FloatingNotification: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  const configs = {
    success: {
      border: 'border-emerald-500/30',
      icon: <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />,
      dot: 'bg-emerald-400',
    },
    error: {
      border: 'border-red-500/30',
      icon: <AlertTriangle size={15} className="text-red-400 flex-shrink-0" />,
      dot: 'bg-red-400',
    },
    info: {
      border: 'border-white/[0.12]',
      icon: <Info size={15} className="text-white/50 flex-shrink-0" />,
      dot: 'bg-white/40',
    },
  };

  const c = configs[type];

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 border ${c.border} bg-bgPrimary min-w-[280px] max-w-sm`}
    >
      {c.icon}
      <p className="text-sm text-white/80 flex-1 leading-snug">{message}</p>
      <button
        onClick={onClose}
        className="p-0.5 text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default FloatingNotification;
