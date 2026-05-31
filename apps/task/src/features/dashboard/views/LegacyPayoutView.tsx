import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { DashboardView } from '../types';

interface LegacyPayoutViewProps {
  setDashView: (view: DashboardView) => void;
}

export const LegacyPayoutView: React.FC<LegacyPayoutViewProps> = ({ setDashView }) => (
  <div className="space-y-6">

    <div>
      <p className="text-xs font-medium uppercase tracking-widest text-white/30 mb-2">
        Deprecated
      </p>
      <h1 className="text-2xl font-semibold text-white tracking-tight">
        Legacy Payout
      </h1>
    </div>

    <div className="border border-amber-500/25 bg-amber-500/[0.04] max-w-2xl">
      <div className="flex items-start gap-4 px-6 py-5 border-b border-amber-500/15">
        <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white mb-0.5">System deprecated</p>
          <p className="text-sm text-white/40">
            This payout system has been replaced by Coin Exchange.
          </p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        <p className="text-sm text-white/55 leading-relaxed">
          The legacy payout system has been replaced by the new{' '}
          <span className="text-primary">Coin Exchange</span> feature. All payout
          functionality has moved to the new system with improved rates and faster
          processing.
        </p>

        <ul className="space-y-2 text-sm text-white/40">
          <li className="flex items-start gap-2">
            <span className="text-white/25 flex-shrink-0">·</span>
            Legacy payouts discontinued on March 31, 2024
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white/25 flex-shrink-0">·</span>
            All existing balances migrated to Coin Exchange
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white/25 flex-shrink-0">·</span>
            TDS certificates now generated automatically
          </li>
        </ul>

        <button
          onClick={() => setDashView('coinExchange')}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black text-sm font-semibold hover:bg-primary/90 transition-colors mt-2"
        >
          Go to Coin Exchange
          <ArrowRight size={15} />
        </button>
      </div>
    </div>

  </div>
);
