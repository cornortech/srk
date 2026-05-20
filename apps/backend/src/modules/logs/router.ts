import { Router, Request, Response } from 'express';
import { logger } from '../../services/loggerService';
import { LogModel } from '../../model/logModel';
import { asyncHandler } from '../../utils/errorHandler';
const logRouter = Router();

// Middleware to parse query filters
interface LogQuery {
  app?: string | string[];
  level?: string | string[];
  startDate?: string;
  endDate?: string;
  userId?: string;
  search?: string;
  module?: string;
  limit?: string;
  skip?: string;
}

// GET logs with filters
logRouter.get('/logs', asyncHandler(async (req: Request, res: Response) => {
  const { app, level, startDate, endDate, userId, search, module, limit, skip } = req.query as LogQuery;

  const filters: any = {};

  // Handle app filter (single or multiple)
  if (app) {
    if (Array.isArray(app)) {
      filters.app = app;
    } else {
      filters.app = app === 'all' ? undefined : app;
    }
  }

  // Handle level filter
  if (level) {
    if (Array.isArray(level)) {
      filters.level = level;
    } else {
      filters.level = level === 'all' ? undefined : level;
    }
  }

  // Handle date filters
  if (startDate) {
    filters.startDate = new Date(startDate);
  }
  if (endDate) {
    filters.endDate = new Date(endDate);
  }

  if (userId) filters.userId = userId;
  if (module) filters.module = module;
  if (search) filters.search = search;

  filters.limit = limit ? parseInt(limit, 10) : 100;
  filters.skip = skip ? parseInt(skip, 10) : 0;

  const result = await logger.getLogs(filters);

  res.json(result);
}));

// GET log statistics
logRouter.get('/logs/stats', asyncHandler(async (req: Request, res: Response) => {
  const { app } = req.query;

  const appName = app && app !== 'all' ? (app as any) : undefined;
  const stats = await logger.getLogStats(appName);

  res.json(stats);
}));

// POST client logs (from frontend)
logRouter.post('/logs/client', asyncHandler(async (req: Request, res: Response) => {
  const { app, level, message, metadata } = req.body;

  if (!app || !level || !message) {
    res.status(400).json({ error: 'Missing required fields: app, level, message' });
    return;
  }

  await logger.logFromClient(app, level, message, metadata);

  res.json({ success: true, message: 'Log recorded' });
}));

// POST batch logs (for bulk operations)
logRouter.post('/logs/batch', asyncHandler(async (req: Request, res: Response) => {
  const { logs } = req.body;

  if (!Array.isArray(logs)) {
    res.status(400).json({ error: 'logs must be an array' });
    return;
  }

  const createdLogs = await LogModel.insertMany(logs);

  res.json({ success: true, count: createdLogs.length });
}));

// DELETE logs (for admin cleanup)
logRouter.delete('/logs', asyncHandler(async (req: Request, res: Response) => {
  const { daysOld } = req.body;

  const result = await logger.clearOldLogs(daysOld || 30);

  res.json({ success: true, deletedCount: result.deletedCount });
}));

// GET logs export (CSV format) - streaming to avoid memory issues
logRouter.get('/logs/export', asyncHandler(async (req: Request, res: Response) => {
  const { app, level, startDate, endDate } = req.query;

  const query: any = {};
  if (app && app !== 'all') query.app = app;
  if (level && level !== 'all') query.level = level;
  if (startDate) query.timestamp = { $gte: new Date(startDate as string) };
  if (endDate) {
    query.timestamp = query.timestamp || {};
    query.timestamp.$lte = new Date(endDate as string);
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="logs-${Date.now()}.csv"`);

  // Write CSV header
  const headers = ['Timestamp', 'Level', 'App', 'Module', 'Message', 'User ID', 'Request ID', 'URL', 'Status Code'];
  res.write(headers.join(',') + '\n');

  // Stream logs using cursor to avoid loading all into memory
  const cursor = LogModel.find(query).sort({ timestamp: -1 }).cursor({ batchSize: 100 });

  for (let log = await cursor.next(); log != null; log = await cursor.next()) {
    const row = [
      log.timestamp?.toISOString() || '',
      log.level || '',
      log.app || '',
      log.module || '',
      escapeCsv(log.message),
      log.userId || '',
      log.requestId || '',
      log.url || '',
      log.statusCode || '',
    ];
    res.write(row.map((cell) => escapeCsv(String(cell))).join(',') + '\n');
  }

  res.end();
}));

// Helper function to escape CSV cells
function escapeCsv(value: string): string {
  const escaped = String(value || '').replace(/"/g, '""');
  return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') ? `"${escaped}"` : escaped;
}

export default logRouter;
