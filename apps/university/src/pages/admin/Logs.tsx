import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader, Input, Accordion, AccordionItem, Chip, Button } from '@nextui-org/react';
import { apiClient } from '../../lib/apiClient';
import { Search, Download } from 'lucide-react';

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
  const [requestIdSearch, setRequestIdSearch] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [limit, setLimit] = useState(50);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<any>({});
  const [appCounts, setAppCounts] = useState<Record<string, number>>({});

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

      if (requestIdSearch) {
        params.search = requestIdSearch;
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
  }, [activeTab, selectedLevel, searchQuery, requestIdSearch, startDate, endDate, limit, skip]);

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

  // Fetch per-app counts on mount
  useEffect(() => {
    const fetchAppCounts = async () => {
      try {
        const apps = ['all', 'task', 'grow', 'university'];
        const counts: Record<string, number> = {};

        for (const app of apps) {
          try {
            const params = app === 'all' ? {} : { app };
            const response = await apiClient.get<LogsResponse>('/api/logs', { params: { ...params, limit: 1, skip: 0 } });
            counts[app] = response.data?.total || 0;
          } catch (error) {
            counts[app] = 0;
          }
        }

        setAppCounts(counts);
      } catch (error) {
        console.error('Failed to fetch app counts:', error);
      }
    };

    fetchAppCounts();
  }, []);

  useEffect(() => {
    setSkip(0);
  }, [activeTab, selectedLevel, searchQuery, requestIdSearch, startDate, endDate]);

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
      if (requestIdSearch) params.search = requestIdSearch;
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
        return 'danger';
      case 'warn':
        return 'warning';
      case 'info':
        return 'primary';
      case 'debug':
        return 'default';
      default:
        return 'default';
    }
  };

  const pageCount = Math.ceil((total || 0) / (limit || 1));
  const currentPage = Math.floor((skip || 0) / (limit || 1)) + 1;

  return (
    <div className="container mx-auto py-4">
      {/* Header Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-2xl font-bold text-textPrimary">System Logs</h1>
            <p className="text-textSecondary text-sm">Monitor and track all system activities across different applications</p>
          </div>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'task', 'grow', 'university'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-bgSecondary text-textSecondary hover:bg-opacity-80'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {appCounts[tab] !== undefined && (
              <span className="ml-2 text-xs">({appCounts[tab]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Filters Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-textPrimary">Filters & Search</h3>
        </CardHeader>
        <CardBody className="gap-4">
          {/* Search Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              isClearable
              placeholder="Search by message..."
              startContent={<Search className="w-4 h-4 text-textSecondary" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              description="Search in log messages"
            />
            <Input
              isClearable
              placeholder="Search by Request ID..."
              startContent={<Search className="w-4 h-4 text-textSecondary" />}
              value={requestIdSearch}
              onChange={(e) => setRequestIdSearch(e.target.value)}
              className="w-full"
              description="Search using Request ID"
            />
          </div>

          {/* Date Range and Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Start Date</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-borderColor rounded-md bg-bgPrimary text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">End Date</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-borderColor rounded-md bg-bgPrimary text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Log Levels</label>
              <div className="flex flex-wrap gap-2">
                {['info', 'warn', 'error', 'debug'].map((level) => (
                  <Chip
                    key={level}
                    onClick={() => handleLevelToggle(level)}
                    variant={selectedLevel.includes(level) ? 'solid' : 'bordered'}
                    color={selectedLevel.includes(level) ? getLevelColor(level) : 'default'}
                    className="cursor-pointer text-xs"
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="flex items-end gap-2">
              <Button
                color="default"
                variant="bordered"
                className="w-full"
                onClick={() => {
                  setSearchQuery('');
                  setRequestIdSearch('');
                  setStartDate('');
                  setEndDate('');
                  setSelectedLevel(['info', 'warn', 'error', 'debug']);
                  setSkip(0);
                }}
              >
                Reset
              </Button>
              <Button
                color="primary"
                startContent={<Download className="w-4 h-4" />}
                className="w-full"
                onClick={handleExport}
              >
                Export
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Logs Table Card */}
      <Card>
        <CardHeader className="flex flex-row gap-4 justify-between items-center">
          <h3 className="text-lg font-semibold text-textPrimary">
            Logs ({total})
          </h3>
          <span className="text-sm text-textSecondary">
            Page {currentPage} of {pageCount}
          </span>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="text-textSecondary">Loading logs...</div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <div className="text-textSecondary">No logs found</div>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bgSecondary border-b border-borderColor sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase">Level</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase">App</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase">Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase">URL / API</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase">Details</th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Accordion Rows */}
              <Accordion variant="splitted" defaultExpandedKeys={[]}>
                {logs.map((log, index) => (
                  <AccordionItem
                    key={log._id}
                    title={
                      <div className="w-full">
                        <table className="w-full">
                          <tbody>
                            <tr className="hover:bg-bgSecondary transition-colors">
                              <td className="px-4 py-3 w-20">
                                <Chip
                                  size="sm"
                                  color={getLevelColor(log.level)}
                                  variant="flat"
                                >
                                  {log.level.toUpperCase()}
                                </Chip>
                              </td>
                              <td className="px-4 py-3 w-24 text-sm font-medium text-textPrimary">
                                {log.app.toUpperCase()}
                              </td>
                              <td className="px-4 py-3 w-40 text-xs text-textSecondary">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 flex-1 text-sm text-textPrimary font-mono truncate">
                                {log.method && log.url ? (
                                  <span>
                                    <Chip size="sm" variant="bordered" className="text-xs mr-2">
                                      {log.method}
                                    </Chip>
                                    {log.url}
                                  </span>
                                ) : (
                                  <span className="text-textSecondary">N/A</span>
                                )}
                              </td>
                              <td className="px-4 py-3 w-20 text-xs text-textSecondary">
                                {log.duration ? `${log.duration}ms` : 'N/A'}
                              </td>
                              <td className="px-4 py-3 w-12 text-center text-xs text-primary">
                                ▼
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    }
                  >
                    <div className="space-y-6 p-6 bg-bgSecondary rounded-lg">
                      {/* Message */}
                      <div>
                        <p className="text-xs text-textSecondary font-semibold mb-2 uppercase">Message</p>
                        <p className="text-sm text-textPrimary bg-bgPrimary p-3 rounded break-words">
                          {log.message}
                        </p>
                      </div>

                      {/* Stack Trace - Show First for Errors */}
                      {log.stackTrace && log.level === 'error' && (
                        <div className="border-2 border-red-900 border-opacity-50 rounded-lg p-4 bg-red-950 bg-opacity-20">
                          <p className="text-xs text-red-400 font-bold mb-3 uppercase">⚠️ Stack Trace</p>
                          <pre className="bg-bgPrimary p-3 rounded text-xs text-red-300 overflow-auto max-h-96 font-mono border border-red-900 border-opacity-50 whitespace-pre-wrap break-words">
                            {log.stackTrace}
                          </pre>
                        </div>
                      )}

                      {/* Debugging Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-textSecondary font-semibold mb-1 uppercase">Request ID</p>
                          <p className="text-xs text-textPrimary font-mono bg-bgPrimary p-2 rounded break-all">
                            {log.requestId || 'N/A'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-textSecondary font-semibold mb-1 uppercase">User ID</p>
                          <p className="text-xs text-textPrimary font-mono bg-bgPrimary p-2 rounded break-all">
                            {log.userId || 'N/A'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-textSecondary font-semibold mb-1 uppercase">Status Code</p>
                          <p className={`text-xs font-mono bg-bgPrimary p-2 rounded ${
                            log.statusCode && log.statusCode >= 400 ? 'text-red-400' : 'text-textPrimary'
                          }`}>
                            {log.statusCode || 'N/A'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-textSecondary font-semibold mb-1 uppercase">Method</p>
                          <p className="text-xs text-textPrimary font-mono bg-bgPrimary p-2 rounded">
                            {log.method || 'N/A'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-textSecondary font-semibold mb-1 uppercase">Duration</p>
                          <p className="text-xs text-textPrimary font-mono bg-bgPrimary p-2 rounded">
                            {log.duration ? `${log.duration}ms` : 'N/A'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-textSecondary font-semibold mb-1 uppercase">Module</p>
                          <p className="text-xs text-textPrimary font-mono bg-bgPrimary p-2 rounded">
                            {log.module || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Full URL */}
                      <div>
                        <p className="text-xs text-textSecondary font-semibold mb-1 uppercase">Full URL</p>
                        <p className="text-xs text-textPrimary font-mono bg-bgPrimary p-3 rounded break-all">
                          {log.url ? `${log.method} ${log.url}` : 'N/A'}
                        </p>
                      </div>

                      {/* Metadata */}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div>
                          <p className="text-xs text-textSecondary font-semibold mb-2 uppercase">Metadata</p>
                          <pre className="bg-bgPrimary p-3 rounded text-xs text-textSecondary overflow-auto max-h-48">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Stack Trace - Show for Non-Error Logs */}
                      {log.stackTrace && log.level !== 'error' && (
                        <div>
                          <p className="text-xs text-yellow-400 font-semibold mb-2 uppercase">Stack Trace</p>
                          <pre className="bg-bgPrimary p-3 rounded text-xs text-yellow-300 overflow-auto max-h-48 border border-yellow-900 border-opacity-30 font-mono whitespace-pre-wrap break-words">
                            {log.stackTrace}
                          </pre>
                        </div>
                      )}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          )}

          {/* Pagination */}
          {logs.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-borderColor">
              <div className="text-sm text-textSecondary">
                Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} logs
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  isDisabled={skip === 0}
                  variant="bordered"
                  size="sm"
                  onClick={() => setSkip(Math.max(0, skip - limit))}
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        isIconOnly
                        size="sm"
                        variant={currentPage === page ? 'solid' : 'bordered'}
                        color={currentPage === page ? 'primary' : 'default'}
                        onClick={() => setSkip((page - 1) * limit)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  isDisabled={!logs.length || logs.length < limit}
                  variant="bordered"
                  size="sm"
                  onClick={() => setSkip(skip + limit)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default LogsPage;
