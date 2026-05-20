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
            {total > 0 && (
              <span className="ml-2 text-xs">({total})</span>
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
            <Accordion variant="splitted" defaultExpandedKeys={[]}>
              {logs.map((log) => (
                <AccordionItem
                  key={log._id}
                  title={
                    <div className="flex items-center gap-4 w-full">
                      <Chip
                        size="sm"
                        color={getLevelColor(log.level)}
                        variant="flat"
                        className="min-w-fit"
                      >
                        {log.level.toUpperCase()}
                      </Chip>
                      <span className="text-sm text-textSecondary min-w-fit">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <span className="text-sm text-textPrimary font-medium">
                        {log.app.toUpperCase()}
                      </span>
                      <span className="text-sm text-textSecondary flex-1 truncate">
                        {log.message}
                      </span>
                      {log.requestId && (
                        <Chip size="sm" variant="bordered" className="text-xs min-w-fit">
                          {log.requestId.slice(0, 8)}...
                        </Chip>
                      )}
                    </div>
                  }
                  subtitle={
                    log.module && (
                      <span className="text-xs text-textSecondary">Module: {log.module}</span>
                    )
                  }
                >
                  <div className="space-y-4 p-4 bg-bgSecondary rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-textSecondary font-semibold mb-1">REQUEST ID</p>
                        <p className="text-sm text-textPrimary font-mono break-all">
                          {log.requestId || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-textSecondary font-semibold mb-1">USER ID</p>
                        <p className="text-sm text-textPrimary font-mono">
                          {log.userId || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-textSecondary font-semibold mb-1">URL</p>
                        <p className="text-sm text-textPrimary font-mono break-all">
                          {log.url || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-textSecondary font-semibold mb-1">METHOD</p>
                        <p className="text-sm text-textPrimary font-mono">
                          {log.method || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-textSecondary font-semibold mb-1">STATUS CODE</p>
                        <p className="text-sm text-textPrimary font-mono">
                          {log.statusCode || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-textSecondary font-semibold mb-1">DURATION</p>
                        <p className="text-sm text-textPrimary font-mono">
                          {log.duration ? `${log.duration}ms` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div>
                        <p className="text-xs text-textSecondary font-semibold mb-2">METADATA</p>
                        <pre className="bg-bgPrimary p-3 rounded text-xs text-textSecondary overflow-auto max-h-40">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    )}

                    {log.stackTrace && (
                      <div>
                        <p className="text-xs text-red-400 font-semibold mb-2">STACK TRACE</p>
                        <pre className="bg-bgPrimary p-3 rounded text-xs text-red-400 overflow-auto max-h-40">
                          {log.stackTrace}
                        </pre>
                      </div>
                    )}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
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
