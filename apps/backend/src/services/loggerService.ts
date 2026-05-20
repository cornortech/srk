import { LogModel, ILog } from '../model/logModel';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';
export type AppName = 'task' | 'grow' | 'university' | 'backend';

interface LogContext {
  userId?: string;
  requestId?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  module?: string;
}

class LoggerService {
  public context: LogContext = {};

  setContext(context: Partial<LogContext>) {
    this.context = { ...this.context, ...context };
  }

  clearContext() {
    this.context = {};
  }

  private saveLog(
    level: LogLevel,
    app: AppName,
    message: string,
    metadata?: Record<string, any>,
    stackTrace?: string
  ): void {
    // Fire and forget - don't await in caller
    LogModel.create({
      timestamp: new Date(),
      level,
      app,
      module: this.context.module,
      message,
      metadata: metadata || {},
      stackTrace,
      userId: this.context.userId,
      requestId: this.context.requestId,
      url: this.context.url,
      method: this.context.method,
      statusCode: this.context.statusCode,
      duration: this.context.duration,
    }).catch((error) => {
      // Silent fail to prevent log saving from breaking app
      // Only log to console as a last resort
      console.error('[LOGGER_ERROR]', error);
    });
  }

  private formatLog(level: LogLevel, app: AppName, message: string): string {
    const timestamp = new Date().toISOString();
    const module = this.context.module ? ` [${this.context.module}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}]${module} [${app.toUpperCase()}] ${message}`;
  }

  // Non-blocking methods - return immediately, log in background
  info(app: AppName, message: string, metadata?: Record<string, any>): void {
    // Don't log to console to avoid infinite recursion with interception
    // Just save to database
    this.saveLog('info', app, message, metadata);
  }

  warn(app: AppName, message: string, metadata?: Record<string, any>): void {
    // Don't log to console to avoid infinite recursion with interception
    // Just save to database
    this.saveLog('warn', app, message, metadata);
  }

  error(
    app: AppName,
    message: string,
    error?: Error | any,
    metadata?: Record<string, any>
  ): void {
    // Don't log to console to avoid infinite recursion with interception
    // Just save to database
    
    // Extract stack trace from error or metadata
    let stackTrace = error instanceof Error ? error.stack : String(error);
    if (metadata?.stackTrace && !stackTrace) {
      stackTrace = metadata.stackTrace;
      delete metadata.stackTrace; // Remove from metadata to avoid duplication
    }
    
    // Fire and forget
    this.saveLog('error', app, message, metadata, stackTrace);
  }

  debug(app: AppName, message: string, metadata?: Record<string, any>): void {
    // Don't log to console to avoid infinite recursion with interception
    // Just save to database
    this.saveLog('debug', app, message, metadata);
  }

  // Overloaded method for frontend logs - non-blocking
  logFromClient(
    app: AppName,
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>
  ): void {
    // Fire and forget
    this.saveLog(level, app, message, metadata);
  }

  // Query methods
  async getLogs(
    filters?: {
      app?: AppName | AppName[];
      level?: LogLevel | LogLevel[];
      startDate?: Date;
      endDate?: Date;
      userId?: string;
      search?: string;
      module?: string;
      limit?: number;
      skip?: number;
    }
  ) {
    const query: any = {};

    if (filters?.app) {
      if (Array.isArray(filters.app)) {
        query.app = { $in: filters.app };
      } else {
        query.app = filters.app;
      }
    }

    if (filters?.level) {
      if (Array.isArray(filters.level)) {
        query.level = { $in: filters.level };
      } else {
        query.level = filters.level;
      }
    }

    if (filters?.startDate || filters?.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = filters.startDate;
      if (filters.endDate) query.timestamp.$lte = filters.endDate;
    }

    if (filters?.userId) {
      query.userId = filters.userId;
    }

    if (filters?.module) {
      query.module = filters.module;
    }

    if (filters?.search) {
      query.$or = [
        { message: { $regex: filters.search, $options: 'i' } },
        { requestId: { $regex: filters.search, $options: 'i' } },
        { url: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const limit = filters?.limit || 100;
    const skip = filters?.skip || 0;

    const logs = await LogModel.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const total = await LogModel.countDocuments(query);

    return {
      logs,
      total,
      limit,
      skip,
      hasMore: skip + logs.length < total,
    };
  }

  async getLogStats(app?: AppName) {
    const query = app ? { app } : {};

    const stats = await LogModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return stats;
  }

  async clearOldLogs(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await LogModel.deleteMany({
      timestamp: { $lt: cutoffDate },
    });

    return result;
  }
}

export const logger = new LoggerService();
