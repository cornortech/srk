import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { ssoContract } from '@srk/shared/contracts';
import { UserModel } from '../../model/userModel';
import { adminModel } from '../../model/adminModel';
import AuthService from '../../services/authService';
import crypto from 'crypto';
import GrowAffiliateUserModel from '../../model/grow/growAffiliateUserModel';
import { AutoCodeModel } from '../../model/autoCodeModel';

/**
 * Generate a one-time SSO auto code
 * Called when user from university wants to access task/bank app
 */
const getAutoCode: AppRouteImplementationOrOptions<
  typeof ssoContract.getAutoCode
> = async ({ req, query }) => {
  try {
    // Get userId from JWT middleware (req.user should be set by auth middleware)
    const userId = (req as any).user?.userId;

    if (!userId) {
      return {
        status: 401,
        body: {
          success: false,
          message: 'Unauthorized - Please login first',
        },
      };
    }

    // Verify user exists
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      return {
        status: 401,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    const targetApp = query.targetApp || 'task';

    // Generate a random 10-character code
    const code = crypto.randomBytes(5).toString('hex').toUpperCase();

    // Code expires in 30 seconds
    const expiresAt = new Date(Date.now() + 30 * 1000);

    // Store the code in database
    await AutoCodeModel.create({
      code,
      userId,
      targetApp,
      expiresAt,
      isUsed: false,
    });

    // Generate redirect URL based on target app
    let redirectUrl: string;
    if (targetApp === 'task') {
      const taskDomain =
        process.env['TASK_FRONTEND_URL'] || 'http://localhost:4400';
      redirectUrl = `${taskDomain}/callback?code=${code}`;
    } else if (
      targetApp === 'growaffiliate' ||
      targetApp === 'growsocialmedia'
    ) {
      let growAffiliateId = null;
      if (targetApp === 'growaffiliate') {
        const growAffiliateRecord = await GrowAffiliateUserModel.findOne({
          srkUniversityUserId: userId,
          isActive: true,
        });

        let redirectUrlQueryParams = '';
        if (growAffiliateRecord) {
          growAffiliateId = growAffiliateRecord._id.toString();
          redirectUrlQueryParams = `&affiliateId=${growAffiliateId}`;
        }

        const growDomain =
          process.env['GROW_FRONTEND_URL'] || 'http://localhost:4500';
        redirectUrl = `${growDomain}/callback?code=${code}${redirectUrlQueryParams}`;
      } else {
        const growDomain =
          process.env['GROW_FRONTEND_URL'] || 'http://localhost:4500';
        redirectUrl = `${growDomain}/callback?code=${code}`;
      }
    } else {
      const bankDomain =
        process.env['BANK_FRONTEND_URL'] || 'http://localhost:4300';
      redirectUrl = `${bankDomain}/callback?code=${code}`;
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'SSO code generated successfully',
        data: {
          code,
          redirectUrl,
          expiresIn: 30, // seconds
        },
      },
    };
  } catch (error) {
    console.error('Error generating SSO auto code:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

/**
 * Exchange SSO code for JWT token
 * Called from task/bank app to validate code and authenticate user
 */
const exchangeCode: AppRouteImplementationOrOptions<
  typeof ssoContract.exchangeCode
> = async ({ req, res, body }) => {
  try {
    const { code } = body;

    // Find the auto code
    const autoCode = await AutoCodeModel.findOne({ code });

    if (!autoCode) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Invalid or expired code',
        },
      };
    }

    // Check if code has expired
    if (new Date() > autoCode.expiresAt) {
      await AutoCodeModel.deleteOne({ _id: autoCode._id });
      return {
        status: 400,
        body: {
          success: false,
          message: 'Code has expired. Please try again.',
        },
      };
    }

    // Check if code has already been used
    if (autoCode.isUsed) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Code has already been used',
        },
      };
    }

    // Mark code as used immediately (one-time use)
    autoCode.isUsed = true;
    await autoCode.save();

    // Get user details
    const userExist = await UserModel.findById(autoCode.userId);
    const adminExist = await adminModel.findById(autoCode.userId);

    const loggedInUser = userExist || adminExist;

    if (!loggedInUser) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    // Determine role
    const role = adminExist ? 'admin' : 'user';

    // Set redirection URL based on target app and role
    let redirectionUrl = '/dashboard';

    if (autoCode.isAdmin && role === 'admin') {
      // Admin SSO redirect
      if (autoCode.targetApp === 'task') {
        redirectionUrl = '/admin';
      } else if (
        autoCode.targetApp === 'growaffiliate' ||
        autoCode.targetApp === 'growsocialmedia'
      ) {
        redirectionUrl = '/admin';
      }
    } else {
      // User SSO redirect
      if (autoCode.targetApp === 'task') {
        redirectionUrl = '/task/dashboard';
      } else if (autoCode.targetApp === 'growaffiliate') {
        // Check if affiliate is already approved
        const existingAffiliate = await GrowAffiliateUserModel.findOne({
          srkUniversityUserId: loggedInUser._id.toString(),
          isActive: true,
        });

        // If already approved, go to dashboard, otherwise go to verification
        redirectionUrl = existingAffiliate
          ? '/affiliate/dashboard'
          : '/grow/affiliate/verification';
      } else if (autoCode.targetApp === 'growsocialmedia') {
        redirectionUrl = '/';
      } else if (autoCode.targetApp === 'bank') {
        redirectionUrl = '/bank/dashboard';
      }
    }

    // Generate access and refresh tokens
    const [accessToken, refreshToken] = await Promise.all([
      AuthService.generateAccessToken({
        email: loggedInUser.email,
        userId: loggedInUser._id.toString(),
      }),
      AuthService.generateRefreshToken({
        email: loggedInUser.email,
        userId: loggedInUser._id.toString(),
      }),
    ]);

    // Set cookies with proper configuration
    const isProduction = process.env.NODE_ENV === 'production';

    const accessTokenOptions: any = {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    };

    const refreshTokenOptions: any = {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    };

    if (process.env.COOKIE_DOMAIN) {
      accessTokenOptions.domain = process.env.COOKIE_DOMAIN;
      refreshTokenOptions.domain = process.env.COOKIE_DOMAIN;
    }

    res.cookie('access_token', accessToken, accessTokenOptions);
    res.cookie('refresh_token', refreshToken, refreshTokenOptions);

    // Clean up - delete the used code
    await AutoCodeModel.deleteOne({ _id: autoCode._id });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Authentication successful',
        user: {
          universityId: loggedInUser._id.toString(),
          email: loggedInUser.email,
          firstName: userExist?.firstName || undefined,
          lastName: userExist?.lastName || undefined,
          role,
          redirectionUrl,
        },
      },
    };
  } catch (error) {
    console.error('Error exchanging SSO code:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

/**
 * Get current authenticated user from cookie
 * Used to restore session on page refresh
 */
const getMe: AppRouteImplementationOrOptions<
  typeof ssoContract.getMe
> = async ({ req }) => {
  try {
    const user = (req as any).user;

    if (!user || !user.userId) {
      return {
        status: 401,
        body: {
          success: false,
          message: 'Not authenticated',
        },
      };
    }

    // Find user details
    const userExist = await UserModel.findById(user.userId);
    const adminExist = await adminModel.findById(user.userId);
    const loggedInUser = userExist || adminExist;

    if (!loggedInUser) {
      return {
        status: 401,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    const role = userExist ? 'user' : 'admin';

    return {
      status: 200,
      body: {
        success: true,
        message: 'User retrieved successfully',
        user: {
          universityId: loggedInUser._id.toString(),
          email: loggedInUser.email,
          firstName: userExist?.firstName || undefined,
          lastName: userExist?.lastName || undefined,
          role,
        },
      },
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

export const ssoMutationHandler = {
  getAutoCode,
  exchangeCode,
  getMe,
};
