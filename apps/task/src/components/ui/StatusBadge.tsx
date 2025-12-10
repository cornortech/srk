import { AlertCircle, Camera, CheckCircle, Loader2 } from 'lucide-react';
import React from 'react';
import { CaptureStatus } from '../../lib/types';

interface StatusBadgeProps {
  status: CaptureStatus;
  message?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, message }) => {
  const config = {
    idle: {
      icon: Camera,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      label: 'Ready',
    },
    capturing: {
      icon: Camera,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      label: 'Capturing',
    },
    uploading: {
      icon: Loader2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      label: 'Uploading',
    },
    success: {
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      label: 'Verified',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      label: 'Failed',
    },
  }[status];

  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} border border-white/10`}
    >
      {status === 'uploading' ? (
        <Loader2 size={14} className={`${config.color} animate-spin`} />
      ) : (
        <Icon size={14} className={config.color} />
      )}
      <span className={`text-sm font-medium ${config.color}`}>
        {message || config.label}
      </span>
    </div>
  );
};

export default StatusBadge;
