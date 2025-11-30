import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { authContract } from '../../contract/auth/contract';
import { UserModel } from '../../model/userModel';
import AuthService from '../../services/authService';
import { SubscriptionModel } from '../../model/subscriptionModel';
import { PackageModel } from '../../model/packageModel';
import CustomerBalanceService from '../../services/customerBalanceService';
import AdminBalanceService from '../../services/adminBalanceService';
import { KYCModel } from '../../model/kycModel';
import { env } from '../../config/env';
import EmailService from '../../services/emailService';
import { adminModel } from '../../model/adminModel';
import { balanceModel } from '../../model/balanceModel';
import { FinanceService } from '../../services/financeService';
import { modifyAndUploadAgreement } from '../../services/pdfService';
import { CoursePaymentModel } from '../../model/coursePayment';
import { methods } from '../../utils/methods';
import { EarningStatementModel } from '../../model/earningStatementModel';
import { AutoCodeModel } from '../../model/autoCodeModel';
import mongoose from 'mongoose';
import moment from 'moment';
import crypto from 'crypto';

interface CalculateEarningsProps {
  referredBy: string;
  referredTo: string;
  seniorId?: string;
  packageId: string;
  enrolledPackageId: string;
  referringUserPackageId: string;
  seniorPackageId?: string;
}

/**
 * Calculate and store commission earnings for a referral transaction
 */

export function calculateAmountFromPercentage(
  amount: number,
  commission: number
) {
  return (amount * commission) / 100;
}

const calculateEarnings = async ({
  packageId,
  referredBy,
  referredTo,
  seniorId,
  enrolledPackageId,
  referringUserPackageId,
  seniorPackageId,
}: CalculateEarningsProps) => {
  try {
    let {
      balance,
      ceoSalary,
      companyTurnover,
      earning,
      eventWallet,
      officeManagementCharge,
      srkBonus,
    } = await FinanceService.getFiananceAmountCommission({
      newUserPackageId: packageId,
      referringUserPackageId,
      seniorPackageId,
      enrolledPackageId,
    });

    await CustomerBalanceService.depositCustomerBalance({
      userId: referredBy,
      balance,
      eventWallet,
      totalEarnings: balance,
    });

    await AdminBalanceService.depositAdminBalance({
      ceoSalary,
      officeManagementCharge,
      companyTurnover,
    });

    await EarningStatementModel.create({
      userId: new mongoose.Types.ObjectId(referredBy),
      referredTo: new mongoose.Types.ObjectId(referredTo),
      type: 'REFERRAL_EANRING',
      ceoSalary,
      companyTurnover,
      officeManagementCharge,
      eventWallet: 0,
      balanceWallet: balance,
      srkBonus,
      earning: balance,
    });

    if (seniorId) {
      await balanceModel.updateOne(
        {
          userId: seniorId,
        },
        {
          $inc: {
            srkBonus: srkBonus,
            balance: srkBonus,
            totalEarnings: srkBonus,
            eventWallet: 0,
          },
        }
      );

      await EarningStatementModel.create({
        userId: new mongoose.Types.ObjectId(seniorId),
        type: 'SENIOR_EARNING',
        earning: srkBonus,
        srkBonus,
        eventWallet: 0,
        ceoSalary: 0,
        officeManagementCharge: 0,
        balanceWallet: srkBonus,
        companyTurnover: 0,
      });
    }
  } catch (error) {
    console.error('Error calculating earnings:', error);
  }
};

const register: AppRouteImplementationOrOptions<
  typeof authContract.register
> = async ({ req, body }) => {
  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: body.email });

    if (existingUser) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'User already exists with this email.',
        },
      };
    }

    if (body.isAddedByUser) {
      body.password = AuthService.generateRandomPassword();
    }

    const newUserPackageExist = await PackageModel.findOne({
      _id: body.packageId,
    });

    if (!newUserPackageExist) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Package not found',
        },
      };
    }

    if (!body.password) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Password is required',
        },
      };
    }

    const [hashedPassword, referralCode] = await Promise.all([
      AuthService.hashPassword(body.password),
      AuthService.generateUniqueReferralCode(),
    ]);

    let referredBy: string | null = null;
    const referringUser = await UserModel.findOne({
      referralCode: body.referredBy,
    })
      .populate<{
        packageId: {
          _id: string;
          title: string;
          price: number;
        } | null;
      }>('packageId')
      .populate<{
        referredBy: {
          packageId: string;
          _id: string;
        };
      }>('referredBy');

    if (body.referredBy && referringUser) {
      referredBy = referringUser._id.toString();
    }

    // Create new user
    const newUser = await UserModel.create({
      email: body.email.replace(/\s/g, ''),
      // remove whitespaces from firstname and last name
      firstName: body.firstName.replace(/\s/g, ''),
      lastName: body.lastName.replace(/\s/g, ''),
      password: hashedPassword,
      country: body.country,
      phoneNumber: body.phoneNumber,
      profilePicture: body.profilePicture,
      referralCode,
      gender: body.gender,
      isSelfSignup: !body.isAddedByUser,
      dob: body.dob,
      packageId: body.packageId,
      purpose: body.purpose,
      uid: body.uid,
      baseSecret: AuthService.generateBaseSecret(),
      status: body.isAddedByUser
        ? 'REGISTERED'
        : 'PAYMENT_VERIFICATION_PENDING',
      ...(referredBy ? { referredBy } : {}),
    });

    // Create user subscription
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 90);

    await SubscriptionModel.create({
      userId: newUser._id,
      packageId: body.packageId,
      status: 'active',
      purchasedAt: new Date(),
      expiresAt: expirationDate,
    });

    if (!body.isAddedByUser) {
      await CoursePaymentModel.create({
        userId: newUser._id,
        transactionId: body.transactionId || '',
        paymentMethod: body.paymentMethod || '',
        paymentType: body.paymentType || 'qr',
        paymentProofUrl: body.paymentProofUrl || '',
      });
    }

    if (referredBy && body.isAddedByUser) {
      if (!referringUser?.packageId) {
        return {
          status: 400,
          body: {
            success: false,
            message: "Couldn't find referring user's package",
          },
        };
      }

      const packageExists = await PackageModel.findById(body.packageId);

      if (!packageExists) {
        return {
          status: 400,
          body: { success: false, message: 'Package not found' },
        };
      }

      const referredByUserEmailTemplate = EmailService.EmailTemplate({
        heading: 'User enrolled with your referral code',
        message: `
        <p>Hi ${referringUser?.firstName},</p>
        <p>${newUser.firstName} enrolled ${packageExists.title} package with your referral code .</p>
        <p>You will get Srk Bonus after 24 hours.</p>
       `,
      });

      EmailService.sendEmail({
        email: referringUser?.email || '',
        message: referredByUserEmailTemplate,
        subject: 'User enrolled with your referral code',
      });

      let commissionPackageId = referringUser.packageId._id.toString();

      if (newUserPackageExist.price < referringUser.packageId.price) {
        commissionPackageId = newUserPackageExist._id.toString();
      }

      await calculateEarnings({
        packageId: commissionPackageId || '',
        enrolledPackageId: newUserPackageExist._id.toString(),
        referredBy,
        referredTo: newUser._id.toString(),
        seniorId: referringUser.referredBy?._id?.toString() || '',
        referringUserPackageId: referringUser.packageId._id.toString(),
        seniorPackageId: referringUser?.referredBy?.packageId,
      });
    }

    const registrationEmailTemplate = EmailService.EmailTemplate({
      heading: 'Registration Successful',
      message: `
      <p>Hi ${newUser.firstName},</p>
      <p>Thank you for registering with Srk University. We're excited to have you on board.</p>
      <p>Here are your login credentials:</p>
      <ul>
        <li>Email: ${newUser.email}</li>
        <li>Password: ${body.password}</li>
      </ul>
      `,
      link_name: 'Login Now',
      link: `${env.FRONTEND_BASE_URL}/auth/login`,
    });

    EmailService.sendEmail({
      email: newUser.email,
      message: registrationEmailTemplate,
      subject: 'Registration Successful',
    });

    return {
      status: 201,
      body: { success: true, message: 'User registered successfully' },
    };
  } catch (error) {
    console.error('Error in registration:', error);
    return {
      status: 500,
      body: { success: false, message: 'Internal server error' },
    };
  }
};

const login: AppRouteImplementationOrOptions<
  typeof authContract.login
> = async ({ req, res, body }) => {
  // Fetch user from the database
  const userExist = await UserModel.findOne({ email: body.email });
  const adminExist = await adminModel.findOne({ email: body.email });

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

  // Verify password
  const isPasswordValid = await AuthService.verifyPassword(
    body.password,
    loggedInUser.password
  );

  if (!isPasswordValid) {
    return {
      status: 401,
      body: {
        success: false,
        message: 'Invalid credentials',
      },
    };
  }

  // Determine role
  const role = adminExist ? 'admin' : 'user';

  // Set redirection URL based on user type and status
  let redirectionUrl = '/auth/login'; // Default for users
  if (role === 'user') {
    if (userExist) {
      redirectionUrl = methods.getFrontendRedirectionUrl(
        false,
        userExist.status,
        userExist.packageId?.toString() || ''
      );
    } else {
      redirectionUrl = '/auth/login';
    }
  } else {
    redirectionUrl = '/admin'; // Admin redirection
  }

  // Generate JWT token
  const token = await AuthService.generateJwtToken({
    email: loggedInUser.email,
    userId: loggedInUser._id.toString(),
  });

  // Set cookie
  res.cookie('x-auth-token', token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  return {
    status: 200,
    body: {
      success: true,
      message: 'User logged in successfully',
      user: {
        _id: loggedInUser._id.toString(),
        email: loggedInUser.email,
        status: userExist?.status || null,
        affiliateEnabled: !!userExist?.affiliateEnabled,
        role,
        redirectionUrl,
      },
    },
  };
};

const verifyKyc: AppRouteImplementationOrOptions<
  typeof authContract.approveKyc
> = async ({ params }) => {
  try {
    const userExist = await UserModel.findById(params.userId);
    const kycExist = await KYCModel.findOne({ userId: params.userId });

    if (!userExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    if (!kycExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'KYC not found',
        },
      };
    }
    if (userExist.status === 'PORTAL_ACTIVATED') {
      return {
        status: 400,
        body: {
          success: false,
          message: 'KYC already approved',
        },
      };
    }
    await KYCModel.findOneAndUpdate(
      {
        userId: params.userId,
      },
      {
        $set: {
          status: 'approved',
        },
      }
    );

    userExist.status = 'PORTAL_ACTIVATED';

    const courseEnrollAgreementUrl = await modifyAndUploadAgreement(
      userExist.firstName,
      kycExist.verificationImage,
      moment(kycExist.createdAt).format('DD-MM-YYYY'),
      userExist.referralCode || ''
    );

    kycExist.courseEnrollAgreement = courseEnrollAgreementUrl;
    await kycExist.save();
    await userExist.save();

    EmailService.sendEmail({
      email: userExist.email,
      subject: 'KYC Approved',
      message: `
      <p>Hi ${userExist.firstName},</p>
      <p>Your KYC has been approved. You can now access the study portal now.</p>
      `,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'KYC approved successfully',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: { success: false, message: 'Internal server error' },
    };
  }
};

const rejectKyc: AppRouteImplementationOrOptions<
  typeof authContract.rejectKyc
> = async ({ params, body }) => {
  try {
    const userExist = await UserModel.findById(params.userId);

    if (!userExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    // if (userExist.status === "PORTAL_ACTIVATED") {
    //   return {
    //     status: 400,
    //     body: {
    //       success: false,
    //       message: "KYC already approved",
    //     },
    //   };
    // }

    await KYCModel.findOneAndUpdate(
      {
        userId: params.userId,
      },
      {
        $set: {
          status: 'rejected',
          rejectionReason: body.reason,
        },
      }
    );

    userExist.status = 'KYC_VERIFICATION_REJECTED';
    await userExist.save();

    return {
      status: 200,
      body: {
        success: true,
        message: 'KYC rejected successfully',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const rejectPaymentDetails: AppRouteImplementationOrOptions<
  typeof authContract.rejectPaymentDetails
> = async ({ req, body }) => {
  try {
    const userExist = await UserModel.findById(req.params.userId);
    const paymentDetailsExist = await CoursePaymentModel.findOne({
      userId: req.params.userId,
    });

    if (!userExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    if (!paymentDetailsExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Payment details not found.',
        },
      };
    }

    if (userExist.status !== 'PAYMENT_VERIFICATION_PENDING') {
      return {
        status: 403,
        body: {
          success: false,
          message: 'Payment is not in verification pending state.',
        },
      };
    }

    paymentDetailsExist.rejectionReason = body.reason;
    userExist.status = 'PAYMENT_VERIFICATION_REJECTED';
    await userExist.save();
    await paymentDetailsExist.save();

    return {
      status: 200,
      body: {
        success: true,
        message: 'Payment details rejected.',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: { success: false, message: 'Internal server error' },
    };
  }
};

const approvePaymentDetails: AppRouteImplementationOrOptions<
  typeof authContract.approvePaymentDetails
> = async ({ req, body }) => {
  try {
    const userExist = await UserModel.findById(req.params.userId);

    if (!userExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    const paymentDetailsExist = await CoursePaymentModel.findOne({
      userId: req.params.userId,
    });

    if (!paymentDetailsExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Payment details not found.',
        },
      };
    }

    if (userExist.status !== 'PAYMENT_VERIFICATION_PENDING') {
      return {
        status: 403,
        body: {
          success: false,
          message: 'Payment is not in verification pending state.',
        },
      };
    }

    if (userExist.referredBy) {
      const referringUser = await UserModel.findById(userExist.referredBy)
        .populate<{
          packageId: {
            _id: string;
            title: string;
            price: number;
          } | null;
        }>('packageId')
        .populate<{
          referredBy: {
            packageId: string;
            _id: string;
          };
        }>('referredBy');

      if (!referringUser) {
        return {
          status: 404,
          body: {
            success: false,
            message: 'Referring user not found',
          },
        };
      }

      if (!referringUser?.packageId) {
        return {
          status: 400,
          body: {
            success: false,
            message: "Couldn't find referring user's package",
          },
        };
      }

      const newUserPackage = await PackageModel.findById(userExist.packageId);

      if (!newUserPackage) {
        return {
          status: 400,
          body: { success: false, message: 'Package not found' },
        };
      }

      const referredByUserEmailTemplate = EmailService.EmailTemplate({
        heading: 'User enrolled with your referral code',
        message: `
        <p>Hi ${referringUser?.firstName},</p>
        <p>${userExist.firstName} enrolled ${newUserPackage.title} package with your referral code .</p>
        <p>You will get Srk Bonus after 24 hours.</p>
       `,
      });

      EmailService.sendEmail({
        email: referringUser?.email || '',
        message: referredByUserEmailTemplate,
        subject: 'User enrolled with your referral code',
      });

      let commissionPackageId = referringUser.packageId._id.toString();

      if (newUserPackage.price < referringUser.packageId.price) {
        commissionPackageId = newUserPackage._id.toString();
      }

      await calculateEarnings({
        packageId: commissionPackageId || '',
        referredBy: referringUser._id.toString(),
        referredTo: userExist._id.toString(),
        seniorId: referringUser.referredBy?._id?.toString() || '',
        referringUserPackageId: referringUser.packageId._id.toString(),
        seniorPackageId: referringUser?.referredBy?.packageId,
        enrolledPackageId: newUserPackage._id.toString(),
      });
    }

    userExist.status = 'REGISTERED';
    await userExist.save();

    return {
      status: 200,
      body: {
        success: true,
        message: 'Payment details approved successfully.c',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: { success: false, message: 'Internal server error' },
    };
  }
};

const editPaymentDetails: AppRouteImplementationOrOptions<
  typeof authContract.editPaymentDetails
> = async ({ req, body }) => {
  try {
    const userExist = await UserModel.findById(req.params.userId);

    if (!userExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    if (userExist.status === 'REGISTERED') {
      return {
        status: 409,
        body: {
          success: false,
          message: 'User is already registered.',
        },
      };
    }

    const paymentDetailsExist = await CoursePaymentModel.findOne({
      userId: req.params.userId,
    });

    if (!paymentDetailsExist) {
      await CoursePaymentModel.create({
        userId: req.params.userId,
        transactionId: body.transactionId,
        paymentMethod: body.paymentMethod,
        paymentProofUrl: body.paymentProofUrl,
      });
    } else {
      paymentDetailsExist.transactionId = body.transactionId;
      paymentDetailsExist.paymentMethod = body.paymentMethod;
      paymentDetailsExist.paymentProofUrl = body.paymentProofUrl;
      await paymentDetailsExist.save();
    }

    userExist.status = 'PAYMENT_VERIFICATION_PENDING';
    await userExist.save();

    return {
      status: 200,
      body: {
        success: true,
        message: 'Payment details updated successfully.',
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: { success: false, message: 'Internal server error' },
    };
  }
};

/**
 * SSO: Generate one-time auto code
 * Used by thesrkuniversity.com to get a code for redirecting to thesrkbank.com
 */
const getAutoCode: AppRouteImplementationOrOptions<
  typeof authContract.getAutoCode
> = async ({ req }) => {
  try {
    // Get userId from JWT middleware (req.user should be set by auth middleware)
    const userId = (req as any).user?.userId;

    if (!userId) {
      return {
        status: 401,
        body: {
          success: false,
          message: 'Unauthorized - No user session found',
        },
      };
    }

    // Generate a random 10-character code
    const code = crypto.randomBytes(5).toString('hex').toUpperCase();

    // Code expires in 30 seconds
    const expiresAt = new Date(Date.now() + 30 * 1000);

    // Store the code in database
    await AutoCodeModel.create({
      code,
      userId,
      expiresAt,
      isUsed: false,
    });

    // Generate redirect URL for bank program
    const bankDomain =
      process.env['BANK_FRONTEND_URL'] || 'https://thesrkbank.com';
    const redirectUrl = `${bankDomain}/callback?code=${code}`;

    return {
      status: 200,
      body: {
        success: true,
        message: 'Auto code generated successfully',
        data: {
          code,
          redirectUrl,
        },
      },
    };
  } catch (error) {
    console.error('Error generating auto code:', error);
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
 * SSO: Exchange auto code for JWT token
 * Used by thesrkbank.com to exchange the code for authentication
 */
const exchangeCode: AppRouteImplementationOrOptions<
  typeof authContract.exchangeCode
> = async ({ req, res, body }) => {
  try {
    // Find the auto code
    const autoCode = await AutoCodeModel.findOne({ code: body.code });

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
          message: 'Code has expired',
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

    // Mark code as used
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

    // Set redirection URL based on user type
    let redirectionUrl = '/bank/dashboard'; // Default for bank domain
    if (role === 'user' && userExist) {
      // For bank, we want to redirect to bank dashboard
      redirectionUrl = '/bank/dashboard';
    } else {
      redirectionUrl = '/bank/admin'; // Admin redirection for bank
    }

    // Generate new JWT token
    const token = await AuthService.generateJwtToken({
      email: loggedInUser.email,
      userId: loggedInUser._id.toString(),
    });

    // Set cookie for bank domain
    res.cookie('x-auth-token', token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      domain: process.env['COOKIE_DOMAIN'] || undefined, // Set to .thesrk.com for cross-subdomain
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Authentication successful',
        user: {
          _id: loggedInUser._id.toString(),
          email: loggedInUser.email,
          status: userExist?.status || null,
          affiliateEnabled: !!userExist?.affiliateEnabled,
          role,
          redirectionUrl,
        },
      },
    };
  } catch (error) {
    console.error('Error exchanging code:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

export const authMutationHandler = {
  register,
  login,
  getAutoCode,
  exchangeCode,
  verifyKyc,
  rejectKyc,
  editPaymentDetails,
  rejectPaymentDetails,
  approvePaymentDetails,
};
