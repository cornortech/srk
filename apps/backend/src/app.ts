import express from 'express';
import cors from 'cors';
import { createExpressEndpoints } from '@ts-rest/express';
import * as swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import swaggerApiDocs from './config/swagger';
import cronJobInit from './utils/cronjob';
import { router } from './modules';
import ssoRouter from './modules/sso/router';
import { apiContract } from '@srk/shared/contracts';

export const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const WHITE_LISTED_ORIGINS = process.env.WHITE_LISTED_ORIGINS
  ? process.env.WHITE_LISTED_ORIGINS.split(',')
  : [];

// CORS

console.log('[APP] Whitelisted origins:', WHITE_LISTED_ORIGINS);

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

app.use(ssoRouter);

createExpressEndpoints(apiContract, router, app);
cronJobInit();

export default app;
