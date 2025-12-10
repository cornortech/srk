import { MOCK_AFFILIATE_VERIFICATION_DATA } from '../../../data/adminMock';
import { DashboardData, VerificationItem } from '../../../lib/types/admin';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DocumentViewerModal } from '../Modals/DocumentViewerModal';
import { RejectionModal } from '../Modals/RejectionModal';

interface AffiliateVerificationViewProps {
  data: DashboardData;
}

export const AffiliateVerificationView: React.FC<
  AffiliateVerificationViewProps
> = () => {
  const [affiliateData, setAffiliateData] = useState<VerificationItem[]>(
    MOCK_AFFILIATE_VERIFICATION_DATA
  );
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    url?: string;
    photo?: string;
    title: string;
  } | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleApprove = (id: string) => {
    setAffiliateData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'approved' as const,
              reviewedAt: new Date().toISOString().split('T')[0],
            }
          : item
      )
    );
    alert(`Affiliate ${id} approved successfully!`);
  };

  const handleReject = (id: string) => {
    setSelectedItemId(id);
    setRejectionModalOpen(true);
  };

  const handleRejectionSubmit = (reason: string) => {
    if (selectedItemId) {
      setAffiliateData((prev) =>
        prev.map((item) =>
          item.id === selectedItemId
            ? {
                ...item,
                status: 'rejected' as const,
                rejectionReason: reason,
                reviewedAt: new Date().toISOString().split('T')[0],
              }
            : item
        )
      );
      alert(`Affiliate ${selectedItemId} rejected with reason: ${reason}`);
      setSelectedItemId(null);
    }
  };

  const handleViewDocuments = (item: VerificationItem) => {
    setSelectedDocument({
      url: item.kycDocument,
      photo: item.profilePhoto,
      title: `${item.name}'s KYC Documents`,
    });
    setDocumentViewerOpen(true);
  };

  const filteredData = affiliateData.filter(
    (item) => filterStatus === 'all' || item.status === filterStatus
  );

  const pendingCount = affiliateData.filter(
    (item) => item.status === 'pending'
  ).length;
  const approvedCount = affiliateData.filter(
    (item) => item.status === 'approved'
  ).length;
  const rejectedCount = affiliateData.filter(
    (item) => item.status === 'rejected'
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
          <GradientText>Affiliate Verification</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">
          Review and verify affiliate applications from SRK Portal
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Review</p>
                <p className="text-3xl font-bold text-amber-400">
                  {pendingCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Approved</p>
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
                <p className="text-sm text-gray-400">Rejected</p>
                <p className="text-3xl font-bold text-rose-400">
                  {rejectedCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center">
                <span className="text-2xl">❌</span>
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
                Affiliate Applications
              </h3>
              <p className="text-gray-400 text-sm">
                {filteredData.length} applications found
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
                    Affiliate ID
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Name & Email
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Referer Name
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Submitted Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Documents
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
                        {item.userId}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {item.profilePhoto && (
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                            <img
                              src={item.profilePhoto}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="text-sm text-gray-400">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white">
                        {item.refererName || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white">{item.submittedAt}</p>
                        {item.reviewedAt && (
                          <p className="text-xs text-gray-400">
                            Reviewed: {item.reviewedAt}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleViewDocuments(item)}
                        className="flex items-center gap-2 px-3 py-1 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <span>👁️</span>
                        View Documents
                      </button>
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
        {documentViewerOpen && selectedDocument && (
          <DocumentViewerModal
            isOpen={documentViewerOpen}
            onClose={() => setDocumentViewerOpen(false)}
            title={selectedDocument.title}
            documentUrl={selectedDocument.url}
            profilePhoto={selectedDocument.photo}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectionModalOpen && (
          <RejectionModal
            isOpen={rejectionModalOpen}
            onClose={() => setRejectionModalOpen(false)}
            onSubmit={handleRejectionSubmit}
            title="Reject Affiliate Application"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
