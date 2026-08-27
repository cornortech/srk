import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Clock,
} from 'lucide-react';
import { api } from '../../../lib/api';
import type { TSrkTaskUserPaymentDetailsRequest } from '@srk/shared/contracts';
import { getTaskAssetUrl } from '../../../lib/cdn';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const PaymentDetailsVerificationContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('pending');
  const [selectedRequest, setSelectedRequest] = useState<TSrkTaskUserPaymentDetailsRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } =
    api.srkTask.getAllPaymentDetailsRequestsForAdmin.useQuery(
      ['getAllPaymentDetailsRequestsForAdmin', statusFilter, currentPage],
      {
        query: {
          page: currentPage.toString(),
          limit: limit.toString(),
          status: statusFilter === 'all' ? undefined : statusFilter,
        },
      },
      {
        queryKey: [
          'getAllPaymentDetailsRequestsForAdmin',
          statusFilter,
          currentPage,
        ],
      }
    );

  const reviewMutation = api.srkTask.reviewPaymentDetailsRequest.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedRequest(null);
      setActionType(null);
      setRejectionReason('');
    },
    onError: (error: unknown) => {
      console.error('Review error:', error);
      alert((error as ApiError)?.response?.data?.message || 'Failed to review request');
    },
  });

  const handleReview = () => {
    if (!selectedRequest || !actionType) return;

    if (actionType === 'reject' && !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    reviewMutation.mutate({
      body: {
        requestId: selectedRequest._id,
        status: actionType === 'approve' ? 'approved' : 'rejected',
        rejectionReason:
          actionType === 'reject' ? rejectionReason : undefined,
      },
    });
  };

  const filteredRequests = useMemo(() => {
    if (!data?.body?.data) return [];
    return data.body.data.filter((req: TSrkTaskUserPaymentDetailsRequest) => {
      const userDetails =
        typeof req.srkTaskUserId === 'object'
          ? req.srkTaskUserId
          : { fullName: '', email: '', phoneNumber: '' };
      const searchLower = searchQuery.toLowerCase();
      return (
        userDetails.fullName?.toLowerCase().includes(searchLower) ||
        userDetails.email?.toLowerCase().includes(searchLower) ||
        req.accountHolderName?.toLowerCase().includes(searchLower) ||
        req.bankName?.toLowerCase().includes(searchLower) ||
        req.accountNumber?.toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B68938] to-[#E1BA73] flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Payment Details Verification</h2>
            <p className="text-sm text-gray-400">
              Review and approve user payment details
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, bank, account..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-[#B68938] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status as 'all' | 'pending' | 'approved' | 'rejected');
                setCurrentPage(1);
              }}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-[#B68938] text-black'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B68938] mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No payment details requests found</p>
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Account Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Bank Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredRequests.map((request: TSrkTaskUserPaymentDetailsRequest) => {
                  const userDetails =
                    typeof request.srkTaskUserId === 'object'
                      ? request.srkTaskUserId
                      : { fullName: '', email: '', phoneNumber: '' };

                  return (
                    <motion.tr
                      key={request._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium">
                            {userDetails.fullName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {userDetails.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">
                            {request.accountHolderName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {request.accountNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{request.bankName}</div>
                          <div className="text-sm text-gray-400">
                            {request.branchName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-[#B68938] hover:text-[#E1BA73] transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.body && (
            <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing {filteredRequests.length} of{' '}
                {data.body.totalRecords} results
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={
                    currentPage >= data.body.totalPages
                  }
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold">Payment Details Request</h3>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setActionType(null);
                  setRejectionReason('');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  User Information
                </h4>
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                  <p>
                    <span className="text-gray-400">Name:</span>{' '}
                    {typeof selectedRequest.srkTaskUserId === 'object'
                      ? selectedRequest.srkTaskUserId.fullName
                      : 'N/A'}
                  </p>
                  <p>
                    <span className="text-gray-400">Email:</span>{' '}
                    {typeof selectedRequest.srkTaskUserId === 'object'
                      ? selectedRequest.srkTaskUserId.email
                      : 'N/A'}
                  </p>
                  <p>
                    <span className="text-gray-400">Phone:</span>{' '}
                    {typeof selectedRequest.srkTaskUserId === 'object'
                      ? selectedRequest.srkTaskUserId.phoneNumber
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Bank Account Details
                </h4>
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                  <p>
                    <span className="text-gray-400">Account Holder:</span>{' '}
                    {selectedRequest.accountHolderName}
                  </p>
                  <p>
                    <span className="text-gray-400">Bank Name:</span>{' '}
                    {selectedRequest.bankName}
                  </p>
                  <p>
                    <span className="text-gray-400">Account Number:</span>{' '}
                    {selectedRequest.accountNumber}
                  </p>
                  <p>
                    <span className="text-gray-400">Branch:</span>{' '}
                    {selectedRequest.branchName}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Payment QR Code
                </h4>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <img
                    src={getTaskAssetUrl(selectedRequest.qrCodeUrl)}
                    alt="Payment QR"
                    className="w-64 h-64 mx-auto rounded-lg border border-gray-700"
                  />
                  <a
                    href={getTaskAssetUrl(selectedRequest.qrCodeUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-[#B68938] hover:text-[#E1BA73] text-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    View Full Size
                  </a>
                </div>
              </div>

              {/* Status Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Request Status
                </h4>
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status:</span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <p>
                    <span className="text-gray-400">Submitted:</span>{' '}
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                  {selectedRequest.reviewedAt && (
                    <p>
                      <span className="text-gray-400">Reviewed:</span>{' '}
                      {new Date(selectedRequest.reviewedAt).toLocaleString()}
                    </p>
                  )}
                  {selectedRequest.rejectionReason && (
                    <p>
                      <span className="text-gray-400">Rejection Reason:</span>{' '}
                      {selectedRequest.rejectionReason}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="space-y-4">
                  {!actionType ? (
                    <div className="flex gap-4">
                      <button
                        onClick={() => setActionType('approve')}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => setActionType('reject')}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {actionType === 'reject' && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Rejection Reason *
                          </label>
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#B68938] transition-colors"
                            rows={3}
                            placeholder="Provide a reason for rejection..."
                          />
                        </div>
                      )}
                      <div className="flex gap-4">
                        <button
                          onClick={handleReview}
                          disabled={reviewMutation.isPending}
                          className={`flex-1 px-6 py-3 rounded-lg transition-colors font-medium ${
                            actionType === 'approve'
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-red-600 hover:bg-red-700'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {reviewMutation.isPending
                            ? 'Processing...'
                            : `Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`}
                        </button>
                        <button
                          onClick={() => {
                            setActionType(null);
                            setRejectionReason('');
                          }}
                          disabled={reviewMutation.isPending}
                          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
