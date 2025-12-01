import { createExpressEndpoints } from '@ts-rest/express';
import { ssoContract } from '../../contract/sso/contract';
import { ssoMutationHandler } from './mutation';
import { Router } from 'express';
import { JwtAuthMiddleware } from '../../utils/middleware';

const router = Router();

// Create SSO routes
createExpressEndpoints(ssoContract, ssoMutationHandler, router, {
  requestValidationErrorHandler(err, req, res, next) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  },
  globalMiddleware: [
    (req, res, next) => {
      // Only apply auth middleware to get-auto-code endpoint
      // exchange-code doesn't need auth (it's used to GET auth)
      if (req.path.includes('get-auto-code')) {
        return JwtAuthMiddleware(req, res, next);
      }
      next();
    },
  ],
});

export default router;
