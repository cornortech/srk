import { Customer, SalesData } from 'apps/grow/src/lib/types/dashboard';
import { useState } from 'react';
import { GOLD_ACCENT, GOLD_PRIMARY } from '../constants';
import { ChevronDownIcon } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { formatRupees } from '../../../lib/utils/formatters';

interface MySalesViewProps {
  salesData: SalesData[];
}

export const MySalesView: React.FC<MySalesViewProps> = ({ salesData }) => {
  const [detailsOpen, setDetailsOpen] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Sales Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <GlassCard variant="gold" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: GOLD_PRIMARY }}>
              {salesData.reduce((sum, p) => sum + p.salesCount, 0)}
            </div>
            <p className="text-xs text-gray-400 mt-1">Total Sales</p>
          </div>
        </GlassCard>

        <GlassCard variant="emerald" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">
              {formatRupees(
                salesData.reduce((sum, p) => sum + p.salesCount * p.price, 0)
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Total Revenue</p>
          </div>
        </GlassCard>

        <GlassCard variant="violet" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold text-violet-400">
              {salesData.length}
            </div>
            <p className="text-xs text-gray-400 mt-1">Active Packages</p>
          </div>
        </GlassCard>

        <GlassCard variant="blue" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {salesData.reduce((sum, p) => sum + p.customers.length, 0)}
            </div>
            <p className="text-xs text-gray-400 mt-1">Total Customers</p>
          </div>
        </GlassCard>
      </div>

      {/* Sales Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {salesData.map((pkg: SalesData) => (
          <GlassCard key={pkg.id} variant="neutral" className="min-h-[200px]">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">
                    {pkg.packageName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Price:{' '}
                    <span className="text-violet-300 font-medium">
                      {formatRupees(pkg.price)}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    {pkg.salesCount}
                  </div>
                  <p className="text-xs text-gray-500">Sales</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Revenue</span>
                  <span className="font-bold text-white">
                    {formatRupees(pkg.salesCount * pkg.price)}
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min((pkg.salesCount / 100) * 100, 100)}%`,
                      background: `linear-gradient(90deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
                      boxShadow: `0 0 10px ${GOLD_PRIMARY}40`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-white/5">
                <button
                  onClick={() =>
                    setDetailsOpen(detailsOpen === pkg.id ? null : pkg.id)
                  }
                  className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 group"
                >
                  {detailsOpen === pkg.id ? 'Hide' : 'Show'} Customers
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${
                      detailsOpen === pkg.id ? 'rotate-180' : ''
                    } group-hover:scale-110`}
                  />
                </button>
              </div>

              {detailsOpen === pkg.id && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="space-y-2">
                    {pkg.customers.map((customer: Customer, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center text-violet-300 font-bold text-xs">
                            {customer.avatar}
                          </div>
                          <span className="text-sm text-gray-300">
                            {customer.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">
                          {customer.userId}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
