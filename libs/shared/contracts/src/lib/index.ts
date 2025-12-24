import { initContract } from '@ts-rest/core';
import { authContract } from './auth/contract';
import { growContract } from './grow/contract';
import { ssoContract } from './sso/contract';
import { userContract } from './user/contract';
import { packageContract } from './package/contract';
import { courseContract } from './course/contract';
import { financeContract } from './finance/contract';
import { affiliateContract } from './affiliate/contract';
import { webinarContract } from './webinar/contract';
import { bankContract } from './bank/contract';
import { tourContract } from './tour/tour.contract';
import { taskContract } from './task/contract';

const c = initContract();

export const apiContract = c.router({
  auth: authContract,
  grow: growContract,
  user: userContract,
  package: packageContract,
  course: courseContract,
  finance: financeContract,
  affiliate: affiliateContract,
  webinar: webinarContract,
  bank: bankContract,
  tour: tourContract,
  task: taskContract,
  sso: ssoContract,
});
