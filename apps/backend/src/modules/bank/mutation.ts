import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { UserModel } from "../../model/userModel";
import { SrkBankModel } from "../../model/bank/srkBankModel";
import EmailService from "../../services/emailService";
import AuthService from "../../services/authService";
import { methods } from "../../utils/methods";
import { bankContract } from "@srk/shared/contracts";
import { bankStatementService } from "../../services/bankStatementService";
import { PaymentIntentModel } from "../../model/bank/bankPaymentIntentModel";
import { OtpLib } from "../../libs/otplib";
import { BankDetailsModel } from "../../model/bank/bankDetails";

const createBankDetails: AppRouteImplementationOrOptions<
  typeof bankContract.createBankDetails
> = async ({ req }) => {
  try {
    const { userId } = req.params;
    const body = req.body;

    if (mongoose.isValidObjectId(userId) === false) {
      return {
        status: 400,
        body: {
          message: 'Invalid user ID',
          success: false,
        },
      };
    }

    const userExist = await UserModel.findById(userId);

    if (!userExist) {
      return {
        status: 404,
        body: {
          message: 'User not found',
          success: false,
        },
      };
    }
    console.log('userExist: ', userExist);

    const srkBankExist = await SrkBankModel.findById(userExist.srkBankId);

    if (!srkBankExist) {
      return {
        status: 404,
        body: {
          message: 'SRK Bank not found',
          success: false,
        },
      };
    }

    if (srkBankExist.bankDetailsId) {
      return {
        status: 400,
        body: {
          message: 'Bank details already exist for this user',
          success: false,
        },
      };
    }

    // Create bank details

    const newBankDetails = await BankDetailsModel.create({
      srkBankId: userExist.srkBankId,
      documents: {
        ppSizePhoto: body.documents.ppSizePhoto,
        nationalIdCard: body.documents.nationalIdCard,
      },
      identificationDetails: {
        idType: body.identificationDetails.idType,
        idNumber: body.identificationDetails.idNumber,
        issuedDate: body.identificationDetails.issuedDate,
        issuedFrom: body.identificationDetails.issuedFrom,
        placeOfBirth: body.identificationDetails.placeOfBirth,
      },
      familyDetails: {
        fatherName: body.familyDetails.fatherName,
        motherName: body.familyDetails.motherName,
        ...(body.familyDetails.spouseName
          ? { spouseName: body.familyDetails.spouseName }
          : {}),
        ...(body.familyDetails.childrenNames
          ? { childrenNames: body.familyDetails.childrenNames }
          : {}),
      },
      permanentAddress: {
        country: body.permanentAddress.country,
        province: body.permanentAddress.province,
        district: body.permanentAddress.district,
        municipality: body.permanentAddress.municipality,
        wardNo: body.permanentAddress.wardNo,
        street: body.permanentAddress.street,
      },
      currentAddress: {
        country: body.currentAddress.country,
        province: body.currentAddress.province,
        district: body.currentAddress.district,
        municipality: body.currentAddress.municipality,
        wardNo: body.currentAddress.wardNo,
        street: body.currentAddress.street,
      },
    });

    const otpFeatureSecret = `${userExist.baseSecret}-bank_registration`;
    const otpCode = OtpLib.generateOTP(otpFeatureSecret);

    srkBankExist.accountNumber = methods.generateSRKBankId();
    srkBankExist.password = await AuthService.hashPassword(body.password);
    srkBankExist.bankDetailsId = newBankDetails._id;
    srkBankExist.status = 'ONBOARDING_DETAILS_ADDED';

    await srkBankExist.save();

    EmailService.sendEmail({
      subject: 'Bank Registrataion OTP ',
      email: userExist.email,
      message: EmailService.EmailTemplate({
        heading: 'Bank Registration OTP',
        message: `Below is the otp for bank registration . Please dont share it with anyone. It will is valid for 1 min only.`,
        receiver_name: userExist.firstName + ' ' + userExist.lastName,
        code: otpCode,
      }),
    });
    console.log(`[DEV] OTP for ${userExist.email}: ${otpCode}`);

    return {
      status: 200,
      body: {
        message: 'Bank details created successfully',
        success: true,
      },
    };
  } catch (error) {
    console.error('Error creating bank details:', error);
    return {
      status: 500,
      body: {
        message: 'Error creating bank details',
        success: false,
      },
    };
  }
};

const updateBankDetails: AppRouteImplementationOrOptions<
  typeof bankContract.updateBankDetails
> = async ({ req }) => {
  try {
    const { userId } = req.params;
    const body = req.body;

    if (mongoose.isValidObjectId(userId) === false) {
      return {
        status: 400,
        body: {
          message: 'Invalid user ID',
          success: false,
        },
      };
    }

    const userExist = await UserModel.findById(userId);

    if (!userExist) {
      return {
        status: 404,
        body: {
          message: 'User not found',
          success: false,
        },
      };
    }

    const srkBankExist = await SrkBankModel.findById(userExist.srkBankId);

    if (!srkBankExist) {
      return {
        status: 404,
        body: {
          message: 'SRK Bank not found',
          success: false,
        },
      };
    }

    if (!srkBankExist.bankDetailsId) {
      return {
        status: 400,
        body: {
          message: 'Bank details not found for this user',
          success: false,
        },
      };
    }

    // Update bank details
    await BankDetailsModel.findByIdAndUpdate(srkBankExist.bankDetailsId, {
      documents: {
        ppSizePhoto: body.documents.ppSizePhoto,
        nationalIdCard: body.documents.nationalIdCard,
      },
      identificationDetails: {
        idType: body.identificationDetails.idType,
        idNumber: body.identificationDetails.idNumber,
        issuedDate: body.identificationDetails.issuedDate,
        issuedFrom: body.identificationDetails.issuedFrom,
        placeOfBirth: body.identificationDetails.placeOfBirth,
      },
      familyDetails: {
        fatherName: body.familyDetails.fatherName,
        motherName: body.familyDetails.motherName,
        spouseName: body.familyDetails.spouseName || '',
        childrenNames: body.familyDetails.childrenNames || [],
      },
      permanentAddress: {
        country: body.permanentAddress.country,
        province: body.permanentAddress.province,
        district: body.permanentAddress.district,
        municipality: body.permanentAddress.municipality,
        wardNo: body.permanentAddress.wardNo,
        street: body.permanentAddress.street,
      },
      currentAddress: {
        country: body.currentAddress.country,
        province: body.currentAddress.province,
        district: body.currentAddress.district,
        municipality: body.currentAddress.municipality,
        wardNo: body.currentAddress.wardNo,
        street: body.currentAddress.street,
      },
    });

    if (body.password) {
      srkBankExist.password = await AuthService.hashPassword(body.password);
      await srkBankExist.save();
    }

    srkBankExist.status = 'ONBOARDING_DETAILS_ADDED';

    await srkBankExist.save();

    return {
      status: 200,
      body: {
        message: 'Bank details updated successfully',
        success: true,
      },
    };
  } catch (error) {
    console.error('Error updating bank details:', error);
    return {
      status: 500,
      body: {
        message: 'Error updating bank details',
        success: false,
      },
    };
  }
};

const sendMoney: AppRouteImplementationOrOptions<
  typeof bankContract.sendMoney
> = async ({ req }) => {
  const session = await mongoose.startSession();

  try {
    const { intentId } = req.body;

    await session.startTransaction(); // ✅ must await

    const intent = await PaymentIntentModel.findById(intentId).session(session);
    if (!intent) throw new Error('Payment intent not found');
    if (intent.status !== 'confirmed')
      throw new Error('Intent not confirmed or already processed');

    const sender = await SrkBankModel.findById(intent.senderBankId).session(
      session,
    );
    const receiver = await SrkBankModel.findById(intent.receiverBankId).session(
      session,
    );

    if (!sender || !receiver) throw new Error('Sender or receiver not found');
    if (sender.amount < intent.amount) throw new Error('INSUFFICIENT_BALANCE');

    // 1️⃣ Update balances
    sender.amount -= intent.amount;
    receiver.amount += intent.amount;
    await sender.save({ session });
    await receiver.save({ session });

    // 2️⃣ Create bank statements (inside same transaction)
    await bankStatementService.createBankStatement(
      {
        amount: intent.amount,
        type: 'send',
        bankId: sender._id,
        receiverBankId: receiver._id,
        currentAmount: sender.amount,
        status: 'pending',
      },
      session,
    );

    await bankStatementService.createBankStatement(
      {
        amount: intent.amount,
        type: 'receive',
        bankId: receiver._id,
        receiverBankId: sender._id,
        currentAmount: receiver.amount,
        status: 'pending',
      },
      session,
    );

    // 3️⃣ Update intent
    intent.status = 'completed';
    await intent.save({ session });

    await session.commitTransaction(); // ✅ must await

    return {
      status: 200,
      body: {
        message: 'Money sent successfully',
        success: true,
      },
    };
  } catch (error: any) {
    await session.abortTransaction(); // ✅ ensures rollback

    console.error('Error sending money:', error.message);
    let message = 'Something went wrong';

    switch (error.message) {
      case 'INVALID_SENDER':
        message = 'Invalid sender account number.';
        return { status: 404, body: { message, success: false } };
      case 'INVALID_PIN':
        message = 'Invalid transaction PIN.';
        return { status: 400, body: { message, success: false } };
      case 'INVALID_RECEIVER':
        message = 'Invalid receiver account number.';
        return { status: 404, body: { message, success: false } };
      case 'INSUFFICIENT_BALANCE':
        message = 'Insufficient balance.';
        return { status: 400, body: { message, success: false } };
      default:
        return {
          status: 500,
          body: { message, success: false },
        };
    }
  } finally {
    // ✅ CRITICAL: Always close session in finally block
    await session.endSession();
  }
};

const validateTransactionPIN: AppRouteImplementationOrOptions<
  typeof bankContract.validateTransactionPIN
> = async ({ req }) => {
  try {
    const { intentId, transactionPIN } = req.body;

    console.log('Validating transaction PIN:', { intentId, transactionPIN });

    if (!mongoose.isValidObjectId(intentId)) {
      return {
        status: 400,
        body: { message: 'Invalid intent ID', success: false },
      };
    }

    // Find the payment intent
    const intent = await PaymentIntentModel.findById(intentId);

    if (!intent) {
      return {
        status: 404,
        body: { message: 'Payment intent not found', success: false },
      };
    }

    if (intent.status !== 'pending') {
      return {
        status: 400,
        body: { message: 'Payment intent is not pending', success: false },
      };
    }

    // Find sender and validate PIN
    const sender = await SrkBankModel.findById(intent.senderBankId);
    if (!sender) {
      return {
        status: 404,
        body: { message: 'Sender not found', success: false },
      };
    }

    if (sender.transactionPIN !== transactionPIN) {
      return {
        status: 403,
        body: { message: 'Invalid transaction PIN', success: false },
      };
    }

    // Mark intent as confirmed
    intent.status = 'confirmed';
    await intent.save();

    return {
      status: 200,
      body: {
        message: 'Transaction PIN validated successfully',
        success: true,
      },
    };
  } catch (error) {
    console.error('Error validating transaction PIN:', error);
    return {
      status: 500,
      body: { message: 'Error validating transaction PIN', success: false },
    };
  }
};

const sendBankRegistrationOtp: AppRouteImplementationOrOptions<
  typeof bankContract.sendBankRegistrationOtp
> = async ({ req }) => {
  try {
    const { userId } = req.params;
    const userExist = await UserModel.findById(userId);

    if (!userExist) {
      return {
        status: 404,
        body: {
          message: 'User not found',
          success: false,
        },
      };
    }

    const otpFeatureSecret = `${userExist.baseSecret}-bank_registration`;
    console.log('otpFeatureSecret: 1', otpFeatureSecret);
    const otpCode = OtpLib.generateOTP(otpFeatureSecret);

    EmailService.sendEmail({
      email: userExist.email,
      subject: 'Bank Registration OTP',
      message: EmailService.EmailTemplate({
        heading: 'Bank Registration OTP',
        message: `Below is the otp for bank registration . Please dont share it with anyone. It will is valid for 1 min only.`,
        receiver_name: userExist.firstName + ' ' + userExist.lastName,
        code: otpCode,
      }),
    });
    console.log(`[DEV] New OTP for ${userExist.email}: ${otpCode}`);

    return {
      status: 200,
      body: {
        message: 'Bank registration OTP sent successfully',
        success: true,
      },
    };
  } catch (error) {
    console.error('Error sending bank registration OTP:', error);
    return {
      status: 500,
      body: {
        message: 'Error sending bank registration OTP',
        success: false,
      },
    };
  }
};
const validateBankRegistrationOtp: AppRouteImplementationOrOptions<
  typeof bankContract.validateBankRegistrationOtp
> = async ({ req }) => {
  try {
    const { userId } = req.params;
    const { otp } = req.body;

    if (!otp) {
      return {
        status: 400,
        body: {
          message: 'OTP is required',
          success: false,
        },
      };
    }
    if (mongoose.isValidObjectId(userId) === false) {
      return {
        status: 400,
        body: {
          message: 'Invalid user ID',
          success: false,
        },
      };
    }

    const userExist = await UserModel.findById(userId).populate<{
      srkBankId: {
        _id: mongoose.Schema.Types.ObjectId;
        status: string;
      };
    }>({
      path: 'srkBankId',
      select: 'status',
    });

    if (!userExist) {
      return {
        status: 404,
        body: {
          message: 'User not found',
          success: false,
        },
      };
    }

    if (userExist.srkBankId.status !== 'ONBOARDING_DETAILS_ADDED') {
      return {
        status: 400,
        body: {
          message: 'User is not in the onboarding process',
          success: false,
        },
      };
    }
    const otpFeatureSecret = `${userExist.baseSecret}-bank_registration`;
    const isValidOtp = OtpLib.verifyOTP(otp, otpFeatureSecret);

    if (!isValidOtp) {
      return {
        status: 400,
        body: {
          message: 'Invalid OTP',
          success: false,
        },
      };
    }

    await SrkBankModel.findByIdAndUpdate(userExist.srkBankId._id, {
      status: 'OTP_VERIFIED',
    });

    return {
      status: 200,
      body: {
        message: 'Bank registration OTP validated successfully',
        success: true,
      },
    };
  } catch (error) {
    console.error('Error validating bank registration OTP:', error);
    return {
      status: 500,
      body: {
        message: 'Error validating bank registration OTP',
        success: false,
      },
    };
  }
};

const uploadBankProfilePicture: AppRouteImplementationOrOptions<
  typeof bankContract.uploadBankProfilePicture
> = async ({ req }) => {
  try {
    const { userId } = req.params;
    const { profilePicture } = req.body;

    if (mongoose.isValidObjectId(userId) === false) {
      return {
        status: 400,
        body: {
          message: 'Invalid user ID',
          success: false,
        },
      };
    }

    const userExist = await UserModel.findById(userId).populate<{
      srkBankId: {
        _id: string;
        status: string;
        bankDetailsId: string;
      };
    }>({
      path: 'srkBankId',
      populate: {
        path: 'bankDetailsId',
      },
    });

    if (!userExist) {
      return {
        status: 404,
        body: {
          message: 'User not found',
          success: false,
        },
      };
    }

    await BankDetailsModel.findByIdAndUpdate(
      userExist.srkBankId.bankDetailsId,
      {
        basicInfo: {
          profilePicture: profilePicture,
        },
      },
    );

    await SrkBankModel.findByIdAndUpdate(userExist.srkBankId._id, {
      status: 'PROFILE_PICTURE_UPLOADED',
    });

    return {
      status: 200,
      body: {
        message: 'Profile picture uploaded successfully',
        success: true,
      },
    };
  } catch (error) {
    console.error('Error uploading bank profile picture:', error);
    return {
      status: 500,
      body: {
        message: 'Error uploading bank profile picture',
        success: false,
      },
    };
  }
};

const createBankTransactionPin: AppRouteImplementationOrOptions<
  typeof bankContract.createBankTransactionPin
> = async ({ req }) => {
  try {
    const { userId } = req.params;
    const { transactionPIN } = req.body;

    if (mongoose.isValidObjectId(userId) === false) {
      return {
        status: 400,
        body: {
          message: 'Invalid user ID',
          success: false,
        },
      };
    }

    const userExist = await UserModel.findById(userId).populate<{
      srkBankId: {
        _id: string;
        status: string;
      };
    }>({
      path: 'srkBankId',
    });

    const srkBankId = userExist?.srkBankId?._id;

    if (!userExist) {
      return {
        status: 404,
        body: {
          message: 'User not found',
          success: false,
        },
      };
    }

    if (!srkBankId) {
      return {
        status: 404,
        body: {
          message: 'SRK Bank not found',
          success: false,
        },
      };
    }

    if (userExist.srkBankId.status !== 'PROFILE_PICTURE_UPLOADED') {
      return {
        status: 400,
        body: {
          message:
            'Profile picture must be uploaded before creating transaction PIN',
          success: false,
        },
      };
    }

    await SrkBankModel.findByIdAndUpdate(srkBankId, {
      transactionPIN: transactionPIN,
      status: 'PORTAL_ACTIVATED',
    });

    return {
      status: 200,
      body: {
        message: 'Transaction PIN created successfully',
        success: true,
      },
    };
  } catch (error) {
    console.error('Error creating bank transaction PIN:', error);

    return {
      status: 200,
      body: {
        message: 'Transaction PIN created successfully',
        success: true,
      },
    };
  }
};

const createPaymentIntent: AppRouteImplementationOrOptions<
  typeof bankContract.paymentIntent
> = async ({ req }) => {
  try {
    const { userId } = req.params;
    const { amount, receiverAccountNumber } = req.body;

    if (mongoose.isValidObjectId(userId) === false) {
      return {
        status: 400,
        body: {
          message: 'Invalid user ID',
          success: false,
        },
      };
    }

    const senderUserExist = await UserModel.findById(userId).populate<{
      srkBankId: {
        _id: string;
        status: string;
        amount: number;
      };
    }>({
      path: 'srkBankId',
    });

    const receiverSrkBankExist = await SrkBankModel.findOne({
      accountNumber: receiverAccountNumber,
    }).populate<{
      userId: {
        _id: string;
        email: string;
        status: string;
      };
    }>({
      path: 'userId',
    });

    if (!receiverSrkBankExist) {
      return {
        status: 404,
        body: {
          message: 'Invalid receiver account number',
          success: false,
        },
      };
    }

    if (!receiverSrkBankExist.userId) {
      return {
        status: 404,
        body: {
          message: 'Receiver user not found',
          success: false,
        },
      };
    }

    if (!senderUserExist) {
      return {
        status: 404,
        body: {
          message: 'User not found',
          success: false,
        },
      };
    }

    if (!senderUserExist.srkBankId) {
      return {
        status: 404,
        body: {
          message: 'SRK Bank not found',
          success: false,
        },
      };
    }

    if (senderUserExist.srkBankId.amount < amount) {
      return {
        status: 400,
        body: {
          message: 'Insufficient balance',
          success: false,
        },
      };
    }

    const paymentIntent = await PaymentIntentModel.create({
      senderBankId: senderUserExist.srkBankId._id,
      amount,
      receiverBankId: receiverSrkBankExist._id,
      idempotencyKey: uuidv4(),
      status: 'pending',
    });

    return {
      status: 200,
      body: {
        message: 'Payment intent created successfully',
        success: true,
        paymentIntentId: paymentIntent._id.toString(),
      },
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      status: 500,
      body: {
        message: 'Error creating payment intent',
        success: false,
      },
    };
  }
};

export const bankMutationHandlers = {
  createPaymentIntent,
  sendBankRegistrationOtp,
  createBankDetails,
  updateBankDetails,
  sendMoney,
  createBankTransactionPin,
  uploadBankProfilePicture,
  validateTransactionPIN,
  validateBankRegistrationOtp,
};
