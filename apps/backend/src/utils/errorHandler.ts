import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/loggerService';

/**
 * Comprehensive Error Handler Middleware
 * Catches all types of errors:
 * - Async/await errors
 * - Thrown errors
 * - Express validation errors
 * - Database errors
 * - Third-party library errors
 */
export function globalErrorHandler() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    const requestId = (req as any).requestId || 'unknown';
    const startTime = (req as any).startTime || Date.now();
    const duration = Date.now() - startTime;

    // Normalize error object
    const error = err instanceof Error ? err : new Error(String(err));
    const statusCode = err?.statusCode || err?.status || 500;
    const errorMessage = error.message || 'Unknown error';
    const errorStack = error.stack || 'No stack trace';

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

    // Set context with statusCode and duration before logging
    logger.setContext({
      requestId,
      url: req.path,
      method: req.method,
      statusCode,
      duration,
      userId: (req as any).user?.userId,
      module: detectedApp,
    });

    // Log the error with full context
    logger.error(
      detectedApp,
      `ERROR [${req.method} ${req.path}] ${errorMessage}`,
      error,
      {
        requestId,
        statusCode,
        duration,
        url: req.path,
        method: req.method,
        query: Object.keys(req.query).length > 0 ? req.query : undefined,
        params: Object.keys(req.params).length > 0 ? req.params : undefined,
        userId: (req as any).user?.userId,
        errorType: error.name,
        errorMessage,
        stackTrace: errorStack,
      }
    );

    // Don't send error details in production
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const errorResponse = {
      success: false,
      error: isDevelopment ? errorMessage : 'Internal server error',
      requestId,
      ...(isDevelopment && { stack: errorStack }),
    };

    // Send error response
    res.status(statusCode).json(errorResponse);
  };
}

/**
 * 404 Handler - catches undefined routes
 */
export function notFoundHandler() {
  return (req: Request, res: Response) => {
    const requestId = (req as any).requestId || 'unknown';

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

    // Set context before logging
    logger.setContext({
      requestId,
      url: req.path,
      method: req.method,
      statusCode: 404,
      duration: Date.now() - ((req as any).startTime || Date.now()),
      userId: (req as any).user?.userId,
      module: detectedApp,
    });

    logger.warn(detectedApp, `404 NOT FOUND [${req.method} ${req.path}]`, {
      requestId,
      url: req.path,
      method: req.method,
      statusCode: 404,
      query: Object.keys(req.query).length > 0 ? req.query : undefined,
    });

    res.status(404).json({
      success: false,
      error: 'Route not found',
      requestId,
      path: req.path,
    });
  };
}

/**
 * Wrap async route handlers to catch errors
 * Usage: router.get('/users', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure startTime is set for error handler
    if (!(req as any).startTime) {
      (req as any).startTime = Date.now();
    }

    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Pass to error handler middleware
      next(error);
    });
  };
}
