import { CheckCircle, Clock, Crown, Info, X } from 'lucide-react';
import React from 'react';

const DashboardStatusBadge: React.FC<{
  status: string;
  small?: boolean;
  pulse?: boolean;
}> = ({ status, small = false }) => {
  const getConfig = () => {
    switch (status) {
      case 'Active': case 'Approved': case 'Completed': case 'Verified':
        return { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle size={small ? 10 : 11} /> };
      case 'Inactive': case 'Rejected':
        return { cls: 'bg-red-500/10 text-red-400 border-red-500/20', icon: <X size={small ? 10 : 11} /> };
      case 'Pending': case 'In Review': case 'Pending Verification': case 'Available':
        return { cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: <Clock size={small ? 10 : 11} /> };
      case 'Premium': case 'SRK Grow':
        return { cls: 'bg-[#b68938]/15 text-[#e1ba73] border-[#b68938]/25', icon: <Crown size={small ? 10 : 11} /> };
      default:
        return { cls: 'bg-white/[0.06] text-white/45 border-white/[0.1]', icon: <Info size={small ? 10 : 11} /> };
    }
  };

  const { cls, icon } = getConfig();

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${cls} ${small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}>
      {icon}
      {status}
    </span>
  );
};

export default DashboardStatusBadge;
