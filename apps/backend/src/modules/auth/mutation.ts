import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { UserModel } from '../../model/userModel';
import AuthService from '../../services/authService';
import { SubscriptionModel } from '../../model/subscriptionModel';
import { PackageModel } from '../../model/packageModel';
import mongoose from 'mongoose';
import CustomerBalanceService from '../../services/customerBalanceService';
import AdminBalanceService from '../../services/adminBalanceService';
import { KYCModel } from '../../model/kycModel';
import { env } from '../../config/env';
import EmailService from '../../services/emailService';
import { adminModel } from '../../model/adminModel';
import { balanceModel } from '../../model/balanceModel';
import { FinanceService } from '../../services/financeService';
import { modifyAndUploadAgreement } from '../../services/pdfService';
import moment from 'moment';
import { CoursePaymentModel } from '../../model/coursePayment';
import { methods } from '../../utils/methods';
import { EarningStatementModel } from '../../model/earningStatementModel';
import { growSocialMediaPackageUserModel } from '../../model/growSocialMediaPackageUserModel';
import { authContract } from '@srk/shared/contracts';
import crypto from 'crypto';
import { AutoCodeModel } from '../../model/autoCodeModel';

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
    const {
      balance,
      companyTurnover,
      earning,
      officeManagementCharge,
      srkBonus,
      tms,
      vat,
    } = await FinanceService.getFiananceAmountCommission({
      newUserPackageId: packageId,
      referringUserPackageId,
      seniorPackageId,
      enrolledPackageId,
    });

    await CustomerBalanceService.depositCustomerBalance({
      userId: referredBy,
      balance,
      totalEarnings: balance,
    });

    await AdminBalanceService.depositAdminBalance({
      officeManagementCharge,
      companyTurnover,
      tms,
      vat,
    });

    await EarningStatementModel.create({
      userId: new mongoose.Types.ObjectId(referredBy),
      referredTo: new mongoose.Types.ObjectId(referredTo),
      type: 'REFERRAL_EANRING',
      ceoSalary: 0,
      companyTurnover,
      officeManagementCharge,
      eventWallet: 0,
      balanceWallet: balance,
      srkBonus,
      earning: balance,
      tms,
      vat,
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
        tms: 0,
        vat: 0,
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
        qrCodeId: body.qrCodeId,
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
> = async ({  res, body }) => {
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
  let requiresSSO = false;
  let ssoCode = '';

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
    // Admin login - check domain for SSO redirect
    const adminDomain = (adminExist as any).domain;

    if (adminDomain === 'task' || adminDomain === 'grow') {
      // Need SSO redirect for task/grow admin
      requiresSSO = true;

      // Generate SSO code
      ssoCode = crypto.randomBytes(5).toString('hex').toUpperCase();
      const expiresAt = new Date(Date.now() + 30 * 1000);

      await AutoCodeModel.create({
        code: ssoCode,
        userId: loggedInUser._id.toString(),
        targetApp: adminDomain,
        expiresAt,
        isUsed: false,
        isAdmin: true,
      });

      // Generate redirect URL based on domain
      if (adminDomain === 'task') {
        const taskDomain =
          process.env['TASK_FRONTEND_URL'] || 'http://localhost:4400';
        redirectionUrl = `${taskDomain}/admin/callback?code=${ssoCode}`;
      } else if (adminDomain === 'grow') {
        const growDomain =
          process.env['GROW_FRONTEND_URL'] || 'http://localhost:4500';
        redirectionUrl = `${growDomain}/admin/callback?code=${ssoCode}`;
      }
    } else {
      // University admin - direct redirect
      redirectionUrl = '/admin';
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

    // Get the course payment details to determine the QR code type
    let templatePath: string | undefined;
    try {
      const coursePayment = await CoursePaymentModel.findOne({
        userId: params.userId,
      }).populate('qrCodeId');

      if (coursePayment && coursePayment.qrCodeId) {
        const qrCode = coursePayment.qrCodeId as any;
        if (qrCode.type === 'srkIndustries') {
          templatePath = `apps/backend/static/agreement/university-industries-agreement.pdf`;
        } else if (qrCode.type === 'srkOrganization') {
          templatePath = `apps/backend/static/agreement/task-organization-agreement.pdf`;
        }
        console.log(`QR Code Type: ${qrCode.type}, Template Path: ${templatePath}`);
      }
    } catch (err) {
      console.warn('Error fetching course payment QR code details:', err);
      // Continue with default template if error occurs
    }

    const courseEnrollAgreementUrl = await modifyAndUploadAgreement(
      userExist.firstName,
      kycExist.verificationImage,
      moment(kycExist.createdAt).format('DD-MM-YYYY'),
      userExist.referralCode || '',
      templatePath,
      kycExist.leftThumbFingerprint || undefined,
      kycExist.rightThumbFingerprint || undefined,
      kycExist.signature || undefined
    );
    
    console.log('=== KYC Verify - Biometric Data ===');
    console.log('Left Thumb from KYC:', kycExist.leftThumbFingerprint);
    console.log('Right Thumb from KYC:', kycExist.rightThumbFingerprint);
    console.log('Signature from KYC:', kycExist.signature);

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
    console.log('Error in KYC approval:', error);
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
    console.log(error);
    return {
      status: 500,
      body: { success: false, message: 'Internal server error' },
    };
  }
};

const approvePaymentDetails: AppRouteImplementationOrOptions<
  typeof authContract.approvePaymentDetails
> = async ({ req }) => {
  try {
    const userId = req.params.userId;

    // Validate ObjectId format
    if (!mongoose.isValidObjectId(userId)) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Invalid user ID format',
        },
      };
    }

    const userExist = await UserModel.findById(userId);

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
      userId: userId,
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

    // Process referral earnings if user was referred
    if (userExist.referredBy) {
      try {
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
          console.warn(`Referring user not found for userId: ${userExist.referredBy}`);
        } else if (!referringUser?.packageId) {
          console.warn(`Referring user package not found for userId: ${userExist.referredBy}`);
        } else {
          const newUserPackage = await PackageModel.findById(userExist.packageId);

          if (!newUserPackage) {
            console.warn(`New user package not found: ${userExist.packageId}`);
          } else {
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
        }
      } catch (referralError) {
        console.error(`Error processing referral earnings for userId ${userId}:`, referralError);
        // Continue with status update even if referral processing fails
      }
    }

    // Update user status to REGISTERED
    userExist.status = 'REGISTERED';
    const saveResult = await userExist.save();

    if (!saveResult) {
      console.error(`Failed to save user status update for userId: ${userId}`);
      return {
        status: 500,
        body: {
          success: false,
          message: 'Failed to update user status',
        },
      };
    }

    console.log(`Payment approved successfully for userId: ${userId}, new status: REGISTERED`);

    return {
      status: 200,
      body: {
        success: true,
        message: 'Payment details approved successfully.',
      },
    };
  } catch (error) {
    console.error(`Error in approvePaymentDetails:`, error);
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

const loginSrkGrow: AppRouteImplementationOrOptions<
  typeof authContract.loginSrkGrow
> = async ({ res, body }) => {
  try {
    const userExist = await growSocialMediaPackageUserModel.findOne({
      email: body.email,
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

    const isPasswordValid = await AuthService.verifyPassword(
      body.password,
      userExist.password
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

    const redirectionUrl =
      userExist.status === 'portalActivated'
        ? '/dashboard'
        : '/grow/verification';

    // Generate access and refresh tokens
    const [accessToken, refreshToken] = await Promise.all([
      AuthService.generateAccessToken({
        email: userExist.email,
        userId: userExist._id.toString(),
      }),
      AuthService.generateRefreshToken({
        email: userExist.email,
        userId: userExist._id.toString(),
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

    return {
      status: 200,
      body: {
        success: true,
        message: 'User logged in successfully',
        user: {
          _id: userExist._id.toString(),
          email: userExist.email,
          fullName: userExist.fullName,
          status: userExist.status,
          redirectionUrl,
        },
      },
    };
  } catch (error: any) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const refreshToken: AppRouteImplementationOrOptions<
  typeof authContract.refreshToken
> = async ({ req, res }) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return {
        status: 401,
        body: {
          success: false,
          message: 'Refresh token not found',
        },
      };
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = await AuthService.verifyJwtToken(refreshToken);
    } catch (error) {
      return {
        status: 401,
        body: {
          success: false,
          message: 'Invalid or expired refresh token',
        },
      };
    }

    // Generate new access token
    const newAccessToken = await AuthService.generateAccessToken({
      email: decoded.email,
      userId: decoded.userId,
    });

    // Set new access token cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const accessTokenOptions: any = {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    };

    if (process.env.COOKIE_DOMAIN) {
      accessTokenOptions.domain = process.env.COOKIE_DOMAIN;
    }

    res.cookie('access_token', newAccessToken, accessTokenOptions);

    return {
      status: 200,
      body: {
        success: true,
        message: 'Access token refreshed successfully',
      },
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const logout: AppRouteImplementationOrOptions<
  typeof authContract.logout
> = async ({ res }) => {
  try {
    // Clear both tokens
    const isProduction = process.env.NODE_ENV === 'production';
    const clearOptions: any = {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    };

    if (process.env.COOKIE_DOMAIN) {
      clearOptions.domain = process.env.COOKIE_DOMAIN;
    }

    res.clearCookie('access_token', clearOptions);
    res.clearCookie('refresh_token', clearOptions);

    return {
      status: 200,
      body: {
        success: true,
        message: 'Logged out successfully',
      },
    };
  } catch (error) {
    console.error('Error logging out:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const forgotPassword: AppRouteImplementationOrOptions<
  typeof authContract.forgotPassword
> = async ({ body }) => {
  try {
    const user = await UserModel.findOne({ email: body.email });

    if (!user) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'No account found with this email address',
        },
      };
    }

    // Generate reset token (10 characters)
    const resetToken = crypto.randomBytes(5).toString('hex').toUpperCase();

    // Token expires in 1 hour
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Create reset URL
    const resetUrl = `${env.FRONTEND_BASE_URL}/auth/reset-password?token=${resetToken}`;

    // Send email
    const emailTemplate = EmailService.EmailTemplate({
      heading: 'Password Reset Request',
      message: `
        <p>Hi ${user.firstName},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <p><strong>Reset Code:</strong> ${resetToken}</p>
        <p>This code will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
      link_name: 'Reset Password',
      link: resetUrl,
    });

    await EmailService.sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message: emailTemplate,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Password reset email sent successfully',
      },
    };
  } catch (error) {
    console.error('Error in forgot password:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const resetPassword: AppRouteImplementationOrOptions<
  typeof authContract.resetPassword
> = async ({ body }) => {
  try {
    const user = await UserModel.findOne({
      resetPasswordToken: body.token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Invalid or expired reset token',
        },
      };
    }

    // Hash new password
    const hashedPassword = await AuthService.hashPassword(body.newPassword);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation email
    const emailTemplate = EmailService.EmailTemplate({
      heading: 'Password Reset Successful',
      message: `
        <p>Hi ${user.firstName},</p>
        <p>Your password has been successfully reset.</p>
        <p>If you didn't make this change, please contact support immediately.</p>
      `,
      link_name: 'Login Now',
      link: `${env.FRONTEND_BASE_URL}/auth/login`,
    });

    await EmailService.sendEmail({
      email: user.email,
      subject: 'Password Reset Successful',
      message: emailTemplate,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Password reset successfully',
      },
    };
  } catch (error) {
    console.error('Error in reset password:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const forgotPasswordSrkGrow: AppRouteImplementationOrOptions<
  typeof authContract.forgotPasswordSrkGrow
> = async ({ body }) => {
  try {
    const user = await growSocialMediaPackageUserModel.findOne({
      email: body.email,
    });

    if (!user) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'No account found with this email address',
        },
      };
    }

    // Generate reset token (10 characters)
    const resetToken = crypto.randomBytes(5).toString('hex').toUpperCase();

    // Token expires in 1 hour
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.GROW_FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email
    const emailTemplate = EmailService.EmailTemplate({
      heading: 'Password Reset Request',
      message: `
        <p>Hi ${user.fullName},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <p><strong>Reset Code:</strong> ${resetToken}</p>
        <p>This code will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
      link_name: 'Reset Password',
      link: resetUrl,
    });

    await EmailService.sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message: emailTemplate,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Password reset email sent successfully',
      },
    };
  } catch (error) {
    console.error('Error in forgot password (Grow):', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const resetPasswordSrkGrow: AppRouteImplementationOrOptions<
  typeof authContract.resetPasswordSrkGrow
> = async ({ body }) => {
  try {
    const user = await growSocialMediaPackageUserModel.findOne({
      resetPasswordToken: body.token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Invalid or expired reset token',
        },
      };
    }

    // Hash new password
    const hashedPassword = await AuthService.hashPassword(body.newPassword);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation email
    const emailTemplate = EmailService.EmailTemplate({
      heading: 'Password Reset Successful',
      message: `
        <p>Hi ${user.fullName},</p>
        <p>Your password has been successfully reset.</p>
        <p>If you didn't make this change, please contact support immediately.</p>
      `,
      link_name: 'Login Now',
      link: `${process.env.GROW_FRONTEND_URL}/login`,
    });

    await EmailService.sendEmail({
      email: user.email,
      subject: 'Password Reset Successful',
      message: emailTemplate,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Password reset successfully',
      },
    };
  } catch (error) {
    console.error('Error in reset password (Grow):', error);
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
  verifyKyc,
  rejectKyc,
  editPaymentDetails,
  rejectPaymentDetails,
  approvePaymentDetails,
  loginSrkGrow,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  forgotPasswordSrkGrow,
  resetPasswordSrkGrow,
};
