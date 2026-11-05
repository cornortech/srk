import { initServer } from '@ts-rest/express';
import { NextFunction, Request, Response } from 'express';
import { contentRewardContract } from '@srk/shared/contracts';
import { contentRewardHandler as h } from './handler';
import { JwtAuthMiddleware } from '../../utils/middleware';
import { adminModel } from '../../model/adminModel';

const s = initServer();

// Runs after JwtAuthMiddleware: only logged-in admins may continue
const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = (req as Request & { user?: { userId?: string } }).user
      ?.userId;
    if (!adminId || !(await adminModel.exists({ _id: adminId }))) {
      return res
        .status(403)
        .json({ success: false, message: 'Forbidden - Admin access only' });
    }
    next();
  } catch (error) {
    console.error('Admin check failed', error);
    return res
      .status(403)
      .json({ success: false, message: 'Forbidden - Admin check failed' });
  }
};

const user = [JwtAuthMiddleware];
const admin = [JwtAuthMiddleware, adminOnly];

export const contentRewardRouter = s.router(contentRewardContract, {
  getContentSubmissionStatus: {
    middleware: user,
    handler: h.getContentSubmissionStatus,
  },
  submitContent: { middleware: user, handler: h.submitContent },
  getContentLeaderboard: { middleware: user, handler: h.getContentLeaderboard },
  getContentSubmissionsForAdmin: {
    middleware: admin,
    handler: h.getContentSubmissionsForAdmin,
  },
  selectContentLeader: { middleware: admin, handler: h.selectContentLeader },
  getContentLeadersForAdmin: {
    middleware: admin,
    handler: h.getContentLeadersForAdmin,
  },
  removeContentLeader: { middleware: admin, handler: h.removeContentLeader },
  setContentUploadPermission: {
    middleware: admin,
    handler: h.setContentUploadPermission,
  },
});
