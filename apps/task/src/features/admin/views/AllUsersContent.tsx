import React from 'react';
import { User } from '../types';

interface AllUsersContentProps {
  data: User[];
}

export const AllUsersContent: React.FC<AllUsersContentProps> = React.memo(
  ({ data }) => {
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-700/50 shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-[#1A1715] uppercase text-xs tracking-wider text-gray-400 border-b border-gray-600">
              <th className="py-3 px-3 sm:px-4 text-left whitespace-nowrap">
                User ID
              </th>
              <th className="py-3 px-3 sm:px-4 text-left whitespace-nowrap">
                Username
              </th>
              <th className="py-3 px-3 sm:px-4 text-left whitespace-nowrap">
                Points
              </th>
              <th className="py-3 px-3 sm:px-4 text-left whitespace-nowrap">
                Joined
              </th>
              <th className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-800 hover:bg-[#1A1715]/50 transition-colors text-sm"
              >
                <td className="py-3 px-3 sm:px-4 text-gray-500 text-xs whitespace-nowrap">
                  {user.id}
                </td>
                <td className="py-3 px-3 sm:px-4 font-medium text-white whitespace-nowrap">
                  {user.name}
                </td>
                <td className="py-3 px-3 sm:px-4 font-bold text-[#E1BA73] whitespace-nowrap">
                  {user.totalPoints.toLocaleString()}
                </td>
                <td className="py-3 px-3 sm:px-4 text-gray-500 text-xs whitespace-nowrap">
                  {user.joined}
                </td>
                <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                      user.isVerified
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-red-600/20 text-red-400'
                    }`}
                  >
                    {user.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);
