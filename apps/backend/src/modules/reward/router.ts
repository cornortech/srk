import { initServer } from '@ts-rest/express';
import { rewardContract } from '@srk/shared/contracts';
import { rewardHandler } from './handler';

const s = initServer();

export const rewardRouter = s.router(rewardContract, rewardHandler);
