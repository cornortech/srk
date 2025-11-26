import { Request } from 'express';
import { TsRestRequest } from '@ts-rest/express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { IUser } from '../model/userModel';

/**
 * Express middleware / standard Express route request
 */
export type ExpressAuthRequest = Request & {
  user?: DecodedIdToken;
  dbUser?: IUser | null;
};

/**
 * @ts-rest/express request with Firebase auth
 */
export type TsRestAuthRequest<T extends Record<string, any> = any> =
  TsRestRequest<T> & {
    user?: DecodedIdToken;
    dbUser?: IUser | null;
  };