import React, { useCallback, useEffect, useState } from 'react';
import { GoldButton } from '../components/ui/GoldButton';
import { CARD_BG } from '../constants/theme';
import { api } from '../../../lib/api';
import { Loader2 } from 'lucide-react';


export const VerificationContent: React.FC = React.memo(() => {
  const [page, setPage] = useState(1);

  const { data: verificationData, isLoading, error: queryError } =
    api.srkTask.getSrkTaskOnboardingVerificationRequestForAdmin.useQuery(
      ['getSrkTaskOnboardingVerificationRequestForAdmin', page],
      {
        query: {
          page: page.toString(),
          limit: "10",
          status: 'pending',
        },
      }
    );

  const handleApprove = useCallback((userId: string) => {
    console.log(`Approving user: ${userId}. Granting dashboard access.`);
    // TODO: Implement approve API call
  }, []);

  const handleReject = useCallback((userId: string) => {
    console.log(`Rejecting user: ${userId}`);
    // TODO: Implement reject API call
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-[#E1BA73]" />
        <span className="ml-3 text-gray-400">Loading verification requests...</span>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="text-center p-10 text-red-500">
        An error occurred while fetching data
      </div>
    );
  }

  if (!verificationData?.body?.data || verificationData.body.data.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        No pending verification requests.
      </div>
    );
  }

  const data = verificationData.body.data;
  const totalPages = verificationData.body.totalPages;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((request) => (
          <div
            key={request._id}
            className="p-4 sm:p-6 rounded-xl border border-gray-700/50"
            style={{ background: CARD_BG }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-4">
              <img
                src={request.imageUrl}
                alt={request.taskUserId.fullName}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#E1BA73] flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                }}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  {request.taskUserId.fullName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {request.taskUserId.srkUniversityUserId.email}
                </p>
                <p className="text-xs text-gray-500">
                  {request.taskUserId.srkUniversityUserId.phoneNumber}
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-400 mb-4 space-y-2">
              <p>
                <span className="text-gray-500">DOB:</span>{' '}
                <span className="text-white">{request.taskUserId.dob}</span>
              </p>
              <p>
                <span className="text-gray-500">Requested:</span>{' '}
                <span className="text-white">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Status:</span>{' '}
                <span className={`font-semibold ${request.status === 'pending' ? 'text-yellow-400' :
                  request.status === 'approved' ? 'text-green-400' :
                    'text-red-400'
                  }`}>
                  {request.status.toUpperCase()}
                </span>
              </p>

              <div className="pt-2 space-y-1">
                <a
                  href={request.kycDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-green-400 cursor-pointer hover:underline"
                >
                  📄 View KYC Document
                </a>
                <a
                  href={request.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 cursor-pointer hover:underline"
                >
                  🖼️ View Photo
                </a>
                <a
                  href={request.signatureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-purple-400 cursor-pointer hover:underline"
                >
                  ✍️ View Signature
                </a>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <GoldButton
                onClick={() => handleApprove(request.taskUserId._id)}
                className="flex-1"
              >
                Approve
              </GoldButton>
              <button
                onClick={() => handleReject(request.taskUserId._id)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
});
