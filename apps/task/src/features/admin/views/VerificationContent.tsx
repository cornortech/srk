import React, { useCallback } from 'react';
import { Verification } from '../types';
import { GoldButton } from '../components/ui/GoldButton';
import { CARD_BG } from '../constants/theme';

interface VerificationContentProps {
  data: Verification[];
}

export const VerificationContent: React.FC<VerificationContentProps> =
  React.memo(({ data }) => {
    const handleApprove = useCallback((userId: number) => {
      console.log(`Approving user: ${userId}. Granting dashboard access.`);
    }, []);

    if (data.length === 0) {
      return (
        <div className="text-center p-10 text-gray-500">
          No pending verification requests.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((user) => (
          <div
            key={user.id}
            className="p-4 sm:p-6 rounded-xl border border-gray-700/50"
            style={{ background: CARD_BG }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-4">
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#E1BA73] flex-shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  {user.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-400 mb-4 space-y-1">
              <p>
                Requested:{' '}
                <span className="text-white">{user.requestedAt}</span>
              </p>
              <p>
                Credentials:{' '}
                <span className="text-green-400 cursor-pointer hover:underline">
                  View Document (Dummy)
                </span>
              </p>
            </div>
            <GoldButton onClick={() => handleApprove(user.id)} className="mt-2">
              Approve User
            </GoldButton>
          </div>
        ))}
      </div>
    );
  });
