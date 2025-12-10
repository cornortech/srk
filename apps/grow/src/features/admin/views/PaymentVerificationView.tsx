import { MOCK_PAYMENT_VERIFICATION_DATA } from '../../../data/adminMock';
import {
  DashboardData,
  PaymentVerificationItem,
} from '../../../lib/types/admin';
import { useState } from 'react';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatePresence, motion } from 'framer-motion';
import { THEME } from '../constants/theme';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PostLinksModal } from '../Modals/PostLinksModal';
import { RejectionModal } from '../Modals/RejectionModal';

interface PaymentVerificationViewProps {
  data: DashboardData;
}

export const PaymentVerificationView: React.FC<
  PaymentVerificationViewProps
> = () => {
  const [paymentData, setPaymentData] = useState<PaymentVerificationItem[]>(
    MOCK_PAYMENT_VERIFICATION_DATA
  );
  const [postLinksModalOpen, setPostLinksModalOpen] = useState(false);
  const [selectedPostLinks, setSelectedPostLinks] = useState<string[]>([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleApprove = (id: string) => {
    setPaymentData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'approved' as const,
            }
          : item
      )
    );
    alert(`Payment ${id} approved successfully!`);
  };

  const handleReject = (id: string) => {
    setSelectedItemId(id);
    setRejectionModalOpen(true);
  };

  const handleRejectionSubmit = (reason: string) => {
    if (selectedItemId) {
      setPaymentData((prev) =>
        prev.map((item) =>
          item.id === selectedItemId
            ? {
                ...item,
                status: 'rejected' as const,
                rejectionReason: reason,
              }
            : item
        )
      );
      alert(`Payment ${selectedItemId} rejected with reason: ${reason}`);
      setSelectedItemId(null);
    }
  };

  const handleViewPostLinks = (item: PaymentVerificationItem) => {
    setSelectedPostLinks(item.postLinks || []);
    setSelectedUserName(item.fullName);
    setPostLinksModalOpen(true);
  };

  const filteredData = paymentData.filter(
    (item) => filterStatus === 'all' || item.status === filterStatus
  );

  const pendingAmount = paymentData
    .filter((item) => item.status === 'pending')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalAmount = paymentData.reduce((sum, item) => sum + item.amount, 0);

  const pendingCount = paymentData.filter(
    (item) => item.status === 'pending'
  ).length;
  const approvedCount = paymentData.filter(
    (item) => item.status === 'approved'
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>Payment Verification</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">
          Verify package purchase requests and post links
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Payments</p>
                <p className="text-3xl font-bold text-amber-400">
                  {pendingCount}
                </p>
                <p className="text-sm text-amber-300">
                  ₹{pendingAmount.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Approved Payments</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {approvedCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-3xl font-bold text-[#e1ba73]">
                  ₹{totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#b68938]/20 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">
                Package Purchase Requests
              </h3>
              <p className="text-gray-400 text-sm">
                {filteredData.length} requests found
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm appearance-none pr-8"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-gray-400 text-xs">▼</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Request ID
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    User Details
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Package Details
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Post Links
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <code className="text-sm font-mono text-white group-hover:text-[#e1ba73] transition-colors">
                        {item.id}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-white">
                          {item.fullName}
                        </p>
                        <p className="text-sm text-gray-400">
                          {item.userEmail}
                        </p>
                        <p className="text-xs text-gray-500">{item.userId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="px-3 py-2 bg-[#b68938]/10 text-[#e1ba73] rounded-lg">
                        <p className="font-medium">{item.packageType}</p>
                        <p className="text-xs text-gray-300">
                          Submitted: {item.submittedAt}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleViewPostLinks(item)}
                        className="flex items-center gap-2 px-3 py-1 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <span>👁️</span>
                        View Links ({item.postLinks?.length || 0})
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="text-2xl font-bold"
                        style={{ color: THEME.colors.goldAccent }}
                      >
                        ₹{item.amount.toFixed(2)}
                      </motion.span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={item.status} />
                      {item.rejectionReason && (
                        <p className="text-xs text-rose-400 mt-1 max-w-xs">
                          {item.rejectionReason}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {item.status === 'pending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApprove(item.id)}
                              className="px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-lg hover:bg-emerald-600/30 transition-colors text-sm"
                            >
                              Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReject(item.id)}
                              className="px-3 py-1 bg-rose-600/20 text-rose-300 rounded-lg hover:bg-rose-600/30 transition-colors text-sm"
                            >
                              Reject
                            </motion.button>
                          </>
                        )}
                        {item.status !== 'pending' && (
                          <span className="text-sm text-gray-400">
                            Reviewed
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>

      <AnimatePresence>
        {postLinksModalOpen && (
          <PostLinksModal
            isOpen={postLinksModalOpen}
            onClose={() => setPostLinksModalOpen(false)}
            postLinks={selectedPostLinks}
            userName={selectedUserName}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectionModalOpen && (
          <RejectionModal
            isOpen={rejectionModalOpen}
            onClose={() => setRejectionModalOpen(false)}
            onSubmit={handleRejectionSubmit}
            title="Reject Payment Verification"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
