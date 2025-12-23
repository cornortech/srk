import { ToastType } from '../../../lib/types/dashboard';
import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GOLD_ACCENT, GOLD_PRIMARY } from '../constants';
import { CheckCircleIcon, CopyIcon } from 'lucide-react';
import {
  copyTextToClipboard,
  formatRupees,
} from '../../../lib/utils/formatters';
import { PackageDataTypes } from '../../../lib/types/package';

interface ReferralViewProps {
  data: PackageDataTypes[];
  showToast: (message: string, type?: ToastType) => void;
}

const userId = 123456;

export const ReferralView: React.FC<ReferralViewProps> = ({
  data = [],
  showToast,
}) => {
  const [copiedPackage, setCopiedPackage] = useState<string | null>(null);

  const handleCopy = async (
    referralLink: string,
    packageId: string
  ): Promise<void> => {
    const success = await copyTextToClipboard(referralLink);
    if (success) {
      setCopiedPackage(packageId);
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopiedPackage(null), 2000);
    } else {
      showToast('Failed to copy link', 'error');
    }
  };

  const generateReferralLink = (packageId: string, promoCode: string): string => {
    return `http://localhost:4500/package-flow?ref=${promoCode}&package=${packageId}`;
  };

  return (
    <div className="space-y-6">
      {/* Referral Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <GlassCard variant="gold" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: GOLD_PRIMARY }}>
              3
            </div>
            <p className="text-xs text-gray-400 mt-1">Active Packages</p>
          </div>
        </GlassCard>

        <GlassCard variant="violet" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold text-violet-400">20%</div>
            <p className="text-xs text-gray-400 mt-1">Max Commission</p>
          </div>
        </GlassCard>

        <GlassCard variant="emerald" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">
              {formatRupees(12500)}
            </div>
            <p className="text-xs text-gray-400 mt-1">Total Earned</p>
          </div>
        </GlassCard>

        <GlassCard variant="blue" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">42</div>
            <p className="text-xs text-gray-400 mt-1">Total Referrals</p>
          </div>
        </GlassCard>
      </div>

      {/* Package Cards in Compact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((pkg: PackageDataTypes) => {
          const promoCode = "12345678";
          const referralLink: string = generateReferralLink(pkg._id, promoCode);

          const getPackageStyles = () => {
            switch (pkg.variant) {
              case 'violet':
                return {
                  bg: 'bg-violet-500/10',
                  border: 'border-violet-500/30',
                  text: 'text-violet-300',
                  button:
                    'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700',
                  iconBg: 'bg-violet-500/20',
                };
              case 'gold':
                return {
                  bg: `bg-[${GOLD_PRIMARY}]/10`,
                  border: `border-[${GOLD_PRIMARY}]/30`,
                  text: `text-[${GOLD_PRIMARY}]`,
                  button: `bg-gradient-to-r from-[${GOLD_ACCENT}] to-[${GOLD_PRIMARY}] hover:from-[${GOLD_PRIMARY}] hover:to-[${GOLD_ACCENT}]`,
                  iconBg: `bg-[${GOLD_PRIMARY}]/20`,
                };
              default: // blue
                return {
                  bg: 'bg-blue-500/10',
                  border: 'border-blue-500/30',
                  text: 'text-blue-300',
                  button:
                    'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
                  iconBg: 'bg-blue-500/20',
                };
            }
          };

          const styles = getPackageStyles();

          return (
            <GlassCard
              key={pkg._id}
              variant={pkg.variant}
              className="min-h-[300px]"
            >
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">
                        {pkg.name}
                      </h4>
                      {/* <p className={`text-sm font-medium ${styles.text}`}>
                        {pkg.commission} Commission
                      </p> */}
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-lg ${styles.bg} ${styles.border} border text-sm font-bold text-white`}
                    >
                      {formatRupees(pkg.amount)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    {pkg.description}
                  </p>

                  <div className="space-y-2">
                    {pkg.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${styles.iconBg}`}
                        >
                          <CheckCircleIcon
                            className="w-3 h-3"
                            style={{ color: styles.text }}
                          />
                        </div>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <div>
                    <input
                      readOnly
                      value={referralLink}
                      className="w-full text-sm bg-black/30 border border-white/10 rounded-lg p-2 text-white font-mono truncate"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                  </div>

                  <button
                    onClick={() => handleCopy(referralLink, pkg._id)}
                    className={`relative overflow-h_idden group w-full py-2.5 rounded-lg font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                      styles.button
                    } ${copiedPackage === pkg._id ? 'scale-95' : ''}`}
                  >
                    {copiedPackage === pkg._id ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  </button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
