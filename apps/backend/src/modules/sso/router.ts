import { createExpressEndpoints } from '@ts-rest/express';
import { ssoMutationHandler } from './mutation';
import { Router } from 'express';
import { JwtAuthMiddleware } from '../../utils/middleware';
import { ssoContract } from '../../../../../libs/shared/contracts/src/lib/sso/contract';

const ssoRouter = Router();

// Create SSO routes
createExpressEndpoints(ssoContract, ssoMutationHandler, ssoRouter, {
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

export default ssoRouter;