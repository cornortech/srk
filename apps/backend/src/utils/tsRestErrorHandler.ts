/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '../services/loggerService';

/**
 * Wraps ts-rest route implementations to catch all errors (sync and async)
 * and log them with full context before returning error response
 */
export function withErrorHandling<T extends (...args: any[]) => any>(handler: T): T {
  return (async (args: any) => {
    try {
      return await handler(args);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const requestId = args?.req?.id || 'unknown';
      const userId = args?.req?.userId || 'anonymous';
      const path = args?.req?.path || 'unknown';
      const method = args?.req?.method || 'unknown';

      // Set context before logging error
      logger.setContext({
        requestId,
        url: path,
        method,
        userId,
        statusCode: 500,
        duration: args?.req?.startTime ? Date.now() - args.req.startTime : 0,
      });

      // Log the error with full context
      logger.error(
        'backend',
        `Route handler error: ${errorMessage}`,
        error instanceof Error ? error : new Error(errorMessage),
        {
          handler: handler.name,
          path,
          method,
          userId,
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          requestId,
        }
      );

      // Return standardized error response
      return {
        status: 500,
        body: {
          success: false,
          message: 'An error occurred processing your request. Please try again.',
          ...(process.env.NODE_ENV === 'development' && { error: errorMessage }),
        },
      };
    }
  }) as T;
}

/**
 * Example usage in route definitions:
 *
 * export const authRouter = s.router(authContract, {
 *   login: withErrorHandling(authMutationHandler.login),
 *   register: withErrorHandling(authMutationHandler.register),
 * });
 *
 * This ensures EVERY handler is wrapped and logs errors to database
 */
