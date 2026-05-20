import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../services/loggerService';

// Store original console methods
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

let currentRequestId: string | null = null;

// Override console methods to capture logs (non-blocking)
export function setupConsoleInterception() {
  console.log = (...args: any[]) => {
    originalLog(...args);
    // Non-blocking - fire and forget
    captureConsoleLog('info', args);
  };

  console.warn = (...args: any[]) => {
    originalWarn(...args);
    // Non-blocking - fire and forget
    captureConsoleLog('warn', args);
  };

  console.error = (...args: any[]) => {
    originalError(...args);
    // Non-blocking - fire and forget
    captureConsoleLog('error', args);
  };
}

function captureConsoleLog(level: 'info' | 'warn' | 'error', args: any[]) {
  try {
    // Extract message and error object
    let message = '';
    let error: Error | undefined;
    let metadata: Record<string, any> = {};

    args.forEach((arg) => {
      if (arg instanceof Error) {
        error = arg;
        message += (message ? ' ' : '') + arg.message;
      } else if (typeof arg === 'object') {
        try {
          metadata = { ...metadata, ...arg };
          message += (message ? ' ' : '') + JSON.stringify(arg);
        } catch {
          message += (message ? ' ' : '') + String(arg);
        }
      } else {
        message += (message ? ' ' : '') + String(arg);
      }
    });

    // Don't log logger output to avoid recursion
    if (message.includes('[LOGGER]') || message.includes('[LOG_API]') || message.includes('[LOGGER_ERROR]')) {
      return;
    }

    // Use the appropriate logger method to preserve context
    // The app is determined from the context if available, otherwise default to 'backend'
    const app = (logger.context?.module as any) || 'backend';
    
    if (level === 'error') {
      logger.error(app, message, error, metadata);
    } else if (level === 'warn') {
      logger.warn(app, message, metadata);
    } else {
      logger.info(app, message, metadata);
    }
  } catch (error) {
    // Silent fail
  }
}

// Request logging middleware - non-blocking
export function requestLoggingMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestId = uuidv4();
    const startTime = Date.now();

    currentRequestId = requestId;

    // Detect which app is making the request
    const origin = req.get('origin') || req.get('referer') || '';
    let detectedApp: 'task' | 'grow' | 'university' | 'backend' = 'backend';
    
    if (origin.includes(':4300') || origin.includes('task')) detectedApp = 'task';
    else if (origin.includes(':4400') || origin.includes('grow')) detectedApp = 'grow';
    else if (origin.includes(':4200') || origin.includes('university')) detectedApp = 'university';

    // Check for app header override
    const appHeader = req.get('X-App-Name');
    if (appHeader && ['task', 'grow', 'university', 'backend'].includes(appHeader)) {
      detectedApp = appHeader as any;
    }

    // Set context for logger (for error tracking)
    logger.setContext({
      requestId,
      url: req.path,
      method: req.method,
      userId: (req as any).user?.userId,
      module: detectedApp,
    });

    // Override res.json to capture response
    const originalJson = res.json.bind(res);
    res.json = function (data: any) {
      const duration = Date.now() - startTime;

      // Update context with response data before logging
      logger.setContext({
        requestId,
        url: req.path,
        method: req.method,
        userId: (req as any).user?.userId,
        statusCode: res.statusCode,
        duration,
        module: detectedApp,
      });

      // Only log errors and slow requests to reduce memory usage
      if (res.statusCode >= 400 || duration > 5000) {
        logger.info(detectedApp, `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`, {
          requestId,
          statusCode: res.statusCode,
          duration,
        });
      }

      return originalJson(data);
    };

    // Override res.send to capture response
    const originalSend = res.send.bind(res);
    res.send = function (data: any) {
      const duration = Date.now() - startTime;

      // Update context with response data before logging
      logger.setContext({
        requestId,
        url: req.path,
        method: req.method,
        userId: (req as any).user?.userId,
        statusCode: res.statusCode,
        duration,
        module: detectedApp,
      });

      // Only log errors and slow requests to reduce memory usage
      if (res.statusCode >= 400 || duration > 5000) {
        logger.info(detectedApp, `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`, {
          requestId,
          statusCode: res.statusCode,
          duration,
        });
      }

      return originalSend(data);
    };

    // Clear context after response
    res.on('finish', () => {
      currentRequestId = null;
      logger.clearContext();
    });

    next();
  };
}

// Error logging middleware - non-blocking
export function errorLoggingMiddleware() {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    const duration = Date.now() - (req as any).startTime;

    // Log error (fire and forget)
    logger.error('backend', `Error in ${req.method} ${req.path}`, err, {
      requestId: currentRequestId,
      statusCode: res.statusCode,
      duration,
      message: err.message,
    });

    next(err);
  };
}

export function getCurrentRequestId() {
  return currentRequestId;
}
