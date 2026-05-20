import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../lib/apiClient';

interface Log {
  _id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  app: 'task' | 'grow' | 'university' | 'backend';
  module?: string;
  message: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
  userId?: string;
  requestId?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
}

interface LogsResponse {
  logs: Log[];
  total: number;
  limit: number;
  skip: number;
  hasMore: boolean;
}

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'task' | 'grow' | 'university' | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string[]>(['info', 'warn', 'error', 'debug']);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [limit, setLimit] = useState(50);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>({});

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        limit,
        skip,
      };

      if (activeTab !== 'all') {
        params.app = activeTab;
      }

      if (selectedLevel.length > 0 && selectedLevel.length < 4) {
        params.level = selectedLevel;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (startDate) {
        params.startDate = startDate;
      }

      if (endDate) {
        params.endDate = endDate;
      }

      const response = await apiClient.get<LogsResponse>('/api/logs', { params });
      setLogs(response.data?.logs || []);
      setTotal(response.data?.total || 0);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedLevel, searchQuery, startDate, endDate, limit, skip]);

  const fetchStats = useCallback(async () => {
    try {
      const params: any = {};
      if (activeTab !== 'all') {
        params.app = activeTab;
      }

      const response = await apiClient.get('/api/logs/stats', { params });
      setStats(response.data || {});
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({});
    }
  }, [activeTab]);

  useEffect(() => {
    setSkip(0); // Reset pagination when filters change
  }, [activeTab, selectedLevel, searchQuery, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [fetchLogs, fetchStats]);

  const handleLevelToggle = (level: string) => {
    setSelectedLevel((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleExport = async () => {
    try {
      const params: any = {};
      if (activeTab !== 'all') params.app = activeTab;
      if (selectedLevel.length > 0) params.level = selectedLevel;
      if (searchQuery) params.search = searchQuery;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await apiClient.get('/api/logs/export', {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `logs-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Failed to export logs:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-500 bg-red-900 bg-opacity-30';
      case 'warn':
        return 'text-yellow-500 bg-yellow-900 bg-opacity-30';
      case 'info':
        return 'text-blue-500 bg-blue-900 bg-opacity-30';
      case 'debug':
        return 'text-gray-400 bg-gray-800 bg-opacity-30';
      default:
        return 'text-gray-400 bg-gray-800 bg-opacity-30';
    }
  };

  const pageCount = Math.ceil((total || 0) / (limit || 1));
  const currentPage = Math.floor((skip || 0) / (limit || 1)) + 1;

  return (
    <div className="min-h-screen bg-bgPrimary p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-textPrimary mb-2">System Logs</h1>
          <p className="text-textSecondary">Monitor and track all system activities across different applications</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-borderColor">
            {['all', 'task', 'grow', 'university'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {total > 0 && (
                  <span className="ml-2 text-xs bg-bgSecondary text-textSecondary px-2 py-1 rounded-full">
                    {total}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filters */}
        <div className="bg-cardBg rounded-lg shadow mb-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Level Filter */}
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Log Levels</label>
                <div className="space-y-2">
                  {['info', 'warn', 'error', 'debug'].map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedLevel.includes(level)}
                        onChange={() => handleLevelToggle(level)}
                        className="rounded text-primary"
                      />
                      <span className="ml-2 text-sm text-textSecondary capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Search Message</label>
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-borderColor rounded-md bg-bgPrimary text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-borderColor rounded-md bg-bgPrimary text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">End Date</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-borderColor rounded-md bg-bgPrimary text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStartDate('');
                  setEndDate('');
                  setSelectedLevel(['info', 'warn', 'error', 'debug']);
                  setSkip(0);
                }}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-opacity-80 transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-80 transition-colors"
              >
                Export as CSV
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-cardBg rounded-lg shadow overflow-hidden">
            {loading ? (
            <div className="p-8 text-center text-textSecondary">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-textSecondary">No logs found</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-bgSecondary border-b border-borderColor">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                          App
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                          Module
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                          Message
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borderColor">
                      {logs.map((log) => (
                        <React.Fragment key={log._id}>
                        <tr className="hover:bg-bgSecondary transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)}`}>
                                {log.level.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textPrimary">
                              {log.app.toUpperCase()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                              {log.module || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-textSecondary max-w-md truncate">
                              {log.message}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() =>
                                  setExpandedLogId(expandedLogId === log._id ? null : log._id)
                                }
                                className="text-primary hover:text-opacity-80 font-medium"
                              >
                                {expandedLogId === log._id ? 'Hide' : 'View'}
                              </button>
                            </td>
                          </tr>
                          {expandedLogId === log._id && (
                          <tr className="bg-bgSecondary">
                              <td colSpan={6} className="px-6 py-4">
                                <div className="space-y-3">
                                  <div>
                                  <h4 className="font-semibold text-textPrimary mb-2">Full Details</h4>
                                  <div className="bg-bgPrimary rounded p-3 text-sm font-mono text-textSecondary overflow-auto max-h-64">
                                      <div>
                                        <strong>Request ID:</strong> {log.requestId || 'N/A'}
                                      </div>
                                      <div>
                                        <strong>URL:</strong> {log.url || 'N/A'}
                                      </div>
                                      <div>
                                        <strong>Method:</strong> {log.method || 'N/A'}
                                      </div>
                                      <div>
                                        <strong>Status Code:</strong> {log.statusCode || 'N/A'}
                                      </div>
                                      <div>
                                        <strong>Duration:</strong> {log.duration ? `${log.duration}ms` : 'N/A'}
                                      </div>
                                      <div>
                                        <strong>User ID:</strong> {log.userId || 'N/A'}
                                      </div>
                                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                                        <div>
                                          <strong>Metadata:</strong>
                                        <pre className="mt-1 bg-bgSecondary p-2 rounded text-textSecondary">
                                          {JSON.stringify(log.metadata, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                    {log.stackTrace && (
                                      <div>
                                        <strong>Stack Trace:</strong>
                                        <pre className="mt-1 bg-bgSecondary p-2 rounded text-red-500">
                                            {log.stackTrace}
                                          </pre>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
              <div className="bg-bgSecondary px-6 py-4 border-t border-borderColor flex items-center justify-between">
                <div className="text-sm text-textSecondary">
                    Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} logs
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSkip(Math.max(0, skip - limit))}
                      disabled={skip === 0}
                      className="px-4 py-2 bg-secondary text-white rounded-md disabled:opacity-50 hover:bg-opacity-80 transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setSkip((page - 1) * limit)}
                            className={`px-3 py-2 rounded-md transition-colors ${
                              currentPage === page
                              ? 'bg-primary text-white'
                              : 'bg-bgSecondary text-textSecondary hover:bg-opacity-80'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setSkip(skip + limit)}
                      disabled={!logs.length || logs.length < limit}
                      className="px-4 py-2 bg-secondary text-white rounded-md disabled:opacity-50 hover:bg-opacity-80 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
  );
};

export default LogsPage;
