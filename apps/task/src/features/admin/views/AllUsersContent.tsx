import React, { useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Award,
  Target,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { api } from '../../../lib/api';

export const AllUsersContent: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isActivatedFilter, setIsActivatedFilter] = useState<
    'all' | 'true' | 'false'
  >('all');

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users data
  const queryResult = api.srkTask.getAllSrkTaskUsersForAdmin.useQuery(
    ['admin-all-users', page, debouncedSearch, isActivatedFilter],
    {
      query: {
        page: page.toString(),
        limit: '15',
        search: debouncedSearch || undefined,
        isActivated:
          isActivatedFilter !== 'all' ? isActivatedFilter : undefined,
      },
    }
  );

  const { data, isLoading, error } = queryResult;

  const users = data?.body?.data || [];
  const totalPages = data?.body?.totalPages || 1;
  const totalRecords = data?.body?.totalRecords || 0;

  const getKycStatusBadge = (status: string | null) => {
    if (!status)
      return (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-600/20 text-gray-400">
          No KYC
        </span>
      );
    if (status === 'approved')
      return (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-600/20 text-green-400">
          Verified
        </span>
      );
    if (status === 'pending')
      return (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-600/20 text-yellow-400">
          Pending
        </span>
      );
    return (
      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-600/20 text-red-400">
        Rejected
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center p-10 text-gray-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E1BA73] mx-auto"></div>
        <p className="mt-4">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-400">
        Error loading users. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">All Users</h2>
          <p className="text-sm text-gray-400">Total: {totalRecords} users</p>
        </div>

        {/* Activation Filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          {(['all', 'true', 'false'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setIsActivatedFilter(filter);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors ${
                isActivatedFilter === filter
                  ? 'bg-[#E1BA73] text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filter === 'all'
                ? 'All'
                : filter === 'true'
                ? 'Activated'
                : 'Inactive'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E1BA73] transition-colors"
        />
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="text-center p-10 text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700/50 shadow-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#1A1715] uppercase text-xs tracking-wider text-gray-400 border-b border-gray-600">
                <th className="py-3 px-4 text-left whitespace-nowrap">User Info</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Contact</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">KYC</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Coins</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Tasks</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Success Rate</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-800 hover:bg-[#1A1715]/50 transition-colors"
                >
                  {/* User Info */}
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {user._id.slice(-8)}
                      </p>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Mail size={12} className="text-gray-500" />
                        <span className="truncate max-w-[150px]">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Phone size={12} className="text-gray-500" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Activation Status */}
                  <td className="py-4 px-4 text-center">
                    {user.isActivated ? (
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle size={16} className="text-green-400" />
                        <span className="text-xs text-green-400 font-semibold">
                          Active
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <XCircle size={16} className="text-red-400" />
                        <span className="text-xs text-red-400 font-semibold">
                          Inactive
                        </span>
                      </div>
                    )}
                  </td>

                  {/* KYC Status */}
                  <td className="py-4 px-4 text-center">
                    {getKycStatusBadge(user.kycStatus)}
                  </td>

                  {/* Coins */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Award size={14} className="text-[#E1BA73]" />
                      <span className="font-bold text-[#E1BA73] text-sm">
                        {user.totalCoins.toLocaleString()}
                      </span>
                    </div>
                  </td>

                  {/* Tasks */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Target size={14} className="text-blue-400" />
                      <span className="text-white text-sm font-semibold">
                        {user.completedTasks}/{user.totalTasks}
                      </span>
                    </div>
                  </td>

                  {/* Success Rate */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp
                        size={14}
                        className={
                          user.successRate >= 70
                            ? 'text-green-400'
                            : user.successRate >= 40
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }
                      />
                      <span
                        className={`text-sm font-bold ${
                          user.successRate >= 70
                            ? 'text-green-400'
                            : user.successRate >= 40
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }`}
                      >
                        {user.successRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* Joined Date */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar size={12} className="text-gray-500" />
                      <span>
                        {new Date(user.joinedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
