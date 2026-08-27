import { initServer } from '@ts-rest/express';
import { authRouter } from './auth/router';
import { userRouter } from './user/router';
import { packageRouter } from './package/router';
import { courseRouter } from './course/router';
import { financeRouter } from './finance/router';
import { affiliateRouter } from './affiliate/router';
import { webinarRouter } from './webinar/router';
import { bankRouter } from './bank/router';
import { tourRouter } from './tour/router';
import { taskRouter } from './task/router';
import { growRouter } from './grow/router';
import { growAffiliateRouter } from './grow/affiliate/router';
import { apiContract } from '@srk/shared/contracts';
import { srkTaskRouter } from './grow/task/router';
import { appSettingsRouter } from './appSettings/router';

const s = initServer();

export const router = s.router(apiContract, {
  auth: authRouter,
  user: userRouter,
  package: packageRouter,
  course: courseRouter,
  finance: financeRouter,
  affiliate: affiliateRouter,
  webinar: webinarRouter,
  bank: bankRouter,
  tour: tourRouter,
  task: taskRouter,
  grow: growRouter,
  growAffiliate: growAffiliateRouter,
  srkTask: srkTaskRouter,
  appSettings: appSettingsRouter,
});