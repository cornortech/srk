import express from 'express';
import cors from 'cors';
import { createExpressEndpoints } from '@ts-rest/express';
import * as swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import swaggerApiDocs from './config/swagger';
import cronJobInit from './utils/cronjob';
import { router } from './modules';
import { apiContract } from '../../../libs/shared/contracts/src/index';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const WHITE_LISTED_ORIGINS = process.env.WHITE_LISTED_ORIGINS
  ? process.env.WHITE_LISTED_ORIGINS.split(',')
  : [];

// CORS

console.log('*** whitelisted origins ***', WHITE_LISTED_ORIGINS);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
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

createExpressEndpoints(apiContract, router, app);
cronJobInit();

export default app;
