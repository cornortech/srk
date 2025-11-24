import { NextFunction, Request, Response, RequestHandler } from "express";

/**
 * A higher-order function to handle async errors in Express routes or middleware.
 * @param fn - The asynchronous function to wrap
 * @returns A function that catches errors and forwards them to Express error handling
 */
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
