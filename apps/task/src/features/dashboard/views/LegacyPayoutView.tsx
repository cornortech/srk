import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

import { DashboardView } from '../types';
import DashboardGradientText from '../components/ui/DashboardGradientText';
import { DashboardGlassCard } from '../components/ui/DashboardGlassCard';
import MagneticButton from '../components/ui/DashboardMagneticButton';

interface LegacyPayoutViewProps {
  setDashView: (view: DashboardView) => void;
}

export const LegacyPayoutView: React.FC<LegacyPayoutViewProps> = ({
  setDashView,
}) => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold text-white mb-2">
        <DashboardGradientText>Legacy Payout</DashboardGradientText>
      </h1>
      <p className="text-zinc-400">
        This system is deprecated. Please use the new Coin Exchange.
      </p>
    </div>

    <DashboardGlassCard className="max-w-3xl">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-div-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
            <AlertTriangle size={28} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">System Deprecated</h3>
            <p className="text-zinc-400">
              This payout system is no longer in use.
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-zinc-300">
            The legacy payout system has been replaced by the new{' '}
            <span className="text-amber-400">Coin Exchange</span> feature. All
            payout functionality has been moved to the new system with improved
            rates and faster processing.
          </p>

          <div className="p-4 bg-div-to-r from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-500/20">
            <h4 className="font-bold text-amber-400 mb-2">Important Notice</h4>
            <ul className="text-sm text-zinc-300 space-y-1">
              <li>• Legacy payouts will be discontinued on March 31, 2024</li>
              <li>
                • All existing balances have been migrated to Coin Exchange
              </li>
              <li>
                • New features include better rates and instant processing
              </li>
              <li>• TDS certificates are now automatically generated</li>
            </ul>
          </div>
        </div>

        <MagneticButton
          onClick={() => setDashView('coinExchange')}
          className="w-full"
        >
          <span className="flex items-center justify-center gap-2">
            <ArrowRight size={16} /> Go to Coin Exchange
          </span>
        </MagneticButton>
      </div>
    </DashboardGlassCard>
  </div>
);
