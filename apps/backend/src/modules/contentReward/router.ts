import { initServer } from '@ts-rest/express';
import { NextFunction, Request, Response } from 'express';
import { contentRewardContract } from '@srk/shared/contracts';
import { contentRewardHandler as h } from './handler';
import { JwtAuthMiddleware } from '../../utils/middleware';
import { adminModel } from '../../model/adminModel';
import { createDataUrlUploadMiddleware } from '../../utils/dataUrlUploadMiddleware';

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

// The post image arrives as a data URL and is stored in R2 before the handler runs
const leaderImageUpload = createDataUrlUploadMiddleware({
  postImage: {
    folder: 'university/content-rewards',
    prefix: 'content-leader',
    compress: true,
  },
});

export const contentRewardRouter = s.router(contentRewardContract, {
  getContentSubmissionStatus: {
    middleware: user,
    handler: h.getContentSubmissionStatus,
  },
  submitContent: { middleware: user, handler: h.submitContent },
  getContentLeaderboard: { middleware: user, handler: h.getContentLeaderboard },
  getContentRewardStatement: {
    middleware: user,
    handler: h.getContentRewardStatement,
  },
  getMyContentSubmissions: {
    middleware: user,
    handler: h.getMyContentSubmissions,
  },
  getContentSubmissionsByWeek: {
    middleware: admin,
    handler: h.getContentSubmissionsByWeek,
  },
  getContentSubmissionsForAdmin: {
    middleware: admin,
    handler: h.getContentSubmissionsForAdmin,
  },
  selectContentLeader: {
    middleware: [...admin, leaderImageUpload],
    handler: h.selectContentLeader,
  },
  getContentLeadersForAdmin: {
    middleware: admin,
    handler: h.getContentLeadersForAdmin,
  },
  setContentLeaderImage: {
    middleware: [...admin, leaderImageUpload],
    handler: h.setContentLeaderImage,
  },
  removeContentLeader: { middleware: admin, handler: h.removeContentLeader },
  setContentUploadPermission: {
    middleware: admin,
    handler: h.setContentUploadPermission,
  },
});
