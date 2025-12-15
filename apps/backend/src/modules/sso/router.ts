import { createExpressEndpoints } from '@ts-rest/express';
import { ssoMutationHandler } from './mutation';
import { Router } from 'express';
import { JwtAuthMiddleware } from '../../utils/middleware';
import { ssoContract } from '@srk/shared/contracts';

const router = Router();

createExpressEndpoints(ssoContract, ssoMutationHandler, router, {
  requestValidationErrorHandler(err, req, res, next) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  },
  globalMiddleware: [
    (req, res, next) => {
      // Apply auth middleware to get-auto-code and me endpoints
      // exchange-code doesn't need auth (it's used to GET auth)
      if (req.path.includes('get-auto-code') || req.path.endsWith('/me')) {
        return JwtAuthMiddleware(req, res, next);
      }
      next();
    },
  ],
});

export default router;
