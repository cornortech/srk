import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { THEME } from '../constants/theme';
import { StatusBadge } from '../components/ui/StatusBadge';
import { mockQueueData } from '../../../data/adminMock';

export const PayoutQueueView: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleProcess = useCallback((id: string) => {
    alert(`Processing payout ${id}...`);
  }, []);

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelected(mockQueueData.payoutQueue.map((p) => p.id));
      } else {
        setSelected([]);
      }
    },
    []
  );

  const handleSelect = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelected((prev) => [...prev, id]);
    } else {
      setSelected((prev) => prev.filter((itemId) => itemId !== id));
    }
  }, []);

  const handleBulkProcess = useCallback(() => {
    alert(`Processing ${selected.length} payouts...`);
    setSelected([]);
  }, [selected.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            <GradientText>Payout Queue</GradientText>
          </h1>
          <p className="text-gray-400 mt-2">
            Process affiliate payout requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            Total:{' '}
            <span className="text-white font-bold">
              ₹
              {mockQueueData.payoutQueue
                .reduce((sum, p) => sum + p.amount, 0)
                .toFixed(2)}
            </span>
          </span>
        </div>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-black/30 checked:bg-[#b68938]"
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Request ID
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    User ID
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Amount (₹)
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockQueueData.payoutQueue.map((payout, index) => (
                  <motion.tr
                    key={payout.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selected.includes(payout.id)}
                        onChange={(e) =>
                          handleSelect(payout.id, e.target.checked)
                        }
                        className="rounded border-white/20 bg-black/30 checked:bg-[#b68938]"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <code className="text-sm font-mono text-white group-hover:text-[#e1ba73] transition-colors">
                        {payout.id}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white">{payout.userId}</span>
                    </td>
                    <td className="py-4 px-6">
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="text-2xl font-bold"
                        style={{ color: THEME.colors.goldAccent }}
                      >
                        ₹{payout.amount.toFixed(2)}
                      </motion.span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">{payout.date}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={payout.status} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleProcess(payout.id)}
                          className="px-4 py-2 bg-emerald-600/20 text-emerald-300 rounded-lg hover:bg-emerald-600/30 transition-colors text-sm"
                        >
                          Process
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center"
            >
              <span className="text-gray-400">{selected.length} selected</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBulkProcess}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Bulk Process Selected
              </motion.button>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};
