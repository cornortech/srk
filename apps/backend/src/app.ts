import express from 'express';
import cors from 'cors';
import { createExpressEndpoints } from '@ts-rest/express';
import * as swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import swaggerApiDocs from './config/swagger';
// import cronJobInit from './utils/cronjob';
import { router } from './modules';
import ssoRouter from './modules/sso/router';
import logRouter from './modules/logs/router';
import { apiContract } from '@srk/shared/contracts';
import { JwtAuthMiddleware } from './utils/middleware';
import { env } from './config/env';
import { setupConsoleInterception, requestLoggingMiddleware, errorLoggingMiddleware } from './utils/consoleInterception';
import { globalErrorHandler, notFoundHandler, asyncHandler } from './utils/errorHandler';
import { logger } from './services/loggerService';

export const app = express();

app.set('trust proxy', 1);

// Setup console interception for logging
setupConsoleInterception();

// Increase body size limits to allow base64 image uploads from the frontend
app.use(express.json({ limit: '150mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '150mb', parameterLimit: 100000 }));

// Add request logging middleware
app.use(requestLoggingMiddleware());

// Add request context middleware (for error handling)
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  (req as any).startTime = Date.now();
  next();
});

const WHITE_LISTED_ORIGINS = env.WHITE_LISTED_ORIGINS
  ? env.WHITE_LISTED_ORIGINS.split(',')
  : [];

// CORS

console.log('[APP] Whitelisted origins:', WHITE_LISTED_ORIGINS);
console.log('[APP] R2 prefix folder:', env.R2_PREFIX_FOLDER);

// Root endpoint
app.get('/', (req, res) => {
  console.log('[ROOT] Root path requested');
  res.status(200).send('OK');
});

// Health check endpoint - MUST be before CORS for immediate response
app.get('/health', (req, res) => {
  console.log('[HEALTH] Health check requested');
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || WHITE_LISTED_ORIGINS.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies to be sent
  })
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerApiDocs));

// Logging routes
app.use('/api', logRouter);

app.use(ssoRouter);

// Apply JWT middleware to protected tour endpoints
app.use('/tour/targets', JwtAuthMiddleware);
// app.use('/tour/active-achievements', JwtAuthMiddleware);

createExpressEndpoints(apiContract, router, app);
// cronJobInit();

// 404 Handler - must be before error handler
app.use(notFoundHandler());

// Global Error Handler - must be last
app.use(globalErrorHandler());

export default app;
