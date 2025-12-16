import { AppRouteImplementation } from '@ts-rest/express';
import { financeContract } from '../../contract/finance/contract';
import { balancePayoutModel } from '../../model/balancePayoutModel';
import { BankModel } from '../../model/bankModel';
import { UserModel } from '../../model/userModel';
import { KYCModel } from '../../model/kycModel';
import { balanceModel } from '../../model/balanceModel';
import { adminBalanceModel } from '../../model/adminBalanceModel';
import { SrkBankModel } from '../../model/srkBankModel';
import bankStatement from '../../model/bankStatement';
import AdminSrkBankService from '../../services/adminSrkBankService';
import EmailService from '../../services/emailService';
import { SrkUniversityBankModel } from '../../model/srkUniversityBankModel';

const createBalancePayout: AppRouteImplementation<
  typeof financeContract.createBalancePayout
> = async ({ req, res }) => {
  try {
    const balanceExist = await balanceModel.findOne({
      userId: req.body.userId,
    });

    const srkBankExist = await SrkBankModel.findOne({
      userId: req.body.userId,
    });

    if (!balanceExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User balance not found',
        },
      };
    }

    if (!srkBankExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User balance not found',
        },
      };
    }
    if (req.body.amount <= 0) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Amount must be greater than 0',
        },
      };
    }
    if (balanceExist.balance < req.body.amount) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Insufficient balance',
        },
      };
    }

    const tdsAmount = +(req.body.amount * 0.15).toFixed(2);
    const withdrawAmount = +(req.body.amount - tdsAmount).toFixed(2);

    await balanceModel.updateOne(
      { userId: req.body.userId },
      {
        $inc: {
          balance: -req.body.amount,
          totalTds: tdsAmount,
          totalWithdraw: withdrawAmount,
        },
      }
    );

    await adminBalanceModel.updateOne(
      {},
      {
        $inc: {
          tdsAmount: tdsAmount,
        },
      }
    );

    const updatedSrkBank = await SrkBankModel.findOneAndUpdate(
      {
        userId: req.body.userId,
      },
      {
        $inc: {
          amount: withdrawAmount,
        },
      },
      {
        new: true,
      }
    );

    await bankStatement.create({
      amount: withdrawAmount,
      type: 'deposit',
      bankId: srkBankExist._id,
      description: 'Balance deposit to srk bank',
      currentAmount: updatedSrkBank?.amount,
    });

    const adminSrkBankExist = await AdminSrkBankService.getSrkBankDocument();

    await adminSrkBankExist.updateOne({
      $inc: {
        amount: withdrawAmount,
      },
    });

    return {
      status: 201,
      body: {
        success: true,
        message: 'Balance payout created successfully',
      },
    };
  } catch (error) {
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

const upsertBankDetails: AppRouteImplementation<
  typeof financeContract.upsertBankDetails
> = async ({ req, res }) => {
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

    const bankDetailExist = await BankModel.findOne({
      userId: req.params.userId,
    });

    if (bankDetailExist) {
      await BankModel.findByIdAndUpdate(bankDetailExist._id, {
        ...req.body,
        status: 'pending',
      });
    } else {
      await BankModel.create({
        accountHolderName: req.body.accountHolderName,
        accountNumber: req.body.accountNumber,
        ifscCode: req.body.ifscCode,
        accountType: req.body.accountType,
        bankName: req.body.bankName,
        branchName: req.body.branchName,
        relationWithAccount: req.body.relationWithAccount,
        userId: req.params.userId,
        qrUrl: req.body.qrUrl,
        status: 'pending',
      });
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Bank details updated successfully',
      },
    };
  } catch (error) {
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
const upsertKYCDetails: AppRouteImplementation<
  typeof financeContract.upsertKYCDetails
> = async ({ req, res }) => {
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

    const kycDetailExist = await KYCModel.findOne({
      userId: req.params.userId,
    });

    if (kycDetailExist) {
      await KYCModel.findByIdAndUpdate(kycDetailExist._id, req.body);
    } else {
      await KYCModel.create({
        userId: req.params.userId,
        ...req.body,
      });
    }
    userExist.status = 'KYC_VERIFICATION_PENDING';
    await userExist.save();

    return {
      status: 200,
      body: {
        success: true,
        message: 'KYC details updated successfully',
      },
    };
  } catch (error) {
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

export const approveBalancePayout: AppRouteImplementation<
  typeof financeContract.approveBalancePayout
> = async ({ req }) => {
  try {
    const balancePayoutExist = await balancePayoutModel.findById(
      req.params.payoutId
    );

    if (!balancePayoutExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Balance payout not found',
        },
      };
    }

    const userExist = await UserModel.findById(balancePayoutExist.userId);

    if (!userExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    await balancePayoutModel.findByIdAndUpdate(balancePayoutExist._id, {
      status: 'approved',
      paymentProofUrl: req.body.paymentProofUrl,
      paymentMethod: req.body.paymentMethod,
      transactionNumber: req.body.transactionNumber,
    });

    const srkBankExist = await SrkBankModel.findOne({
      userId: balancePayoutExist.userId,
    });

    const adminSrkBankDoc = await AdminSrkBankService.getSrkBankDocument();
    await adminSrkBankDoc.updateOne({
      $inc: {
        totalPendingPayout: -balancePayoutExist.amount,
        amount: -balancePayoutExist.amount,
      },
    });

    await bankStatement.create({
      amount: balancePayoutExist.amount,
      type: 'payout',
      bankId: srkBankExist?._id,
      description: 'Balance payout to user',
      currentAmount: srkBankExist?.amount,
    });

    EmailService.sendEmail({
      email: userExist.email,
      message: `
        <p>Hi ${userExist.firstName}, your balance payout of ${balancePayoutExist.amount} has been approved successfully.</p>
      `,
      subject: 'Balance payout approved successfully',
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Balance payout approved successfully',
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

export const rejectBalancePayout: AppRouteImplementation<
  typeof financeContract.rejectBalancePayout
> = async ({ req }) => {
  try {
    const balancePayoutExist = await balancePayoutModel.findById(
      req.params.payoutId
    );

    if (!balancePayoutExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Balance payout not found',
        },
      };
    }

    const srkBankExist = await SrkBankModel.findOne({
      userId: balancePayoutExist.userId,
    });

    if (!srkBankExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Bank details not found',
        },
      };
    }

    await balancePayoutModel.findByIdAndUpdate(balancePayoutExist._id, {
      status: 'rejected',
      rejectionReason: req.body.reason,
    });

    // await balanceModel.findOneAndUpdate(
    //   { userId: balancePayoutExist.userId },
    //   { $inc: { balance: balancePayoutExist.amount } }
    // );

    // await adminBalanceModel.findOneAndUpdate(
    //   {},
    //   {
    //     $inc: {
    //       tdsAmount: -balancePayoutExist.amount,
    //     },
    //   }
    // );

    const adminSrkBankDoc = await AdminSrkBankService.getSrkBankDocument();
    await adminSrkBankDoc.updateOne({
      $inc: {
        totalPendingPayout: -balancePayoutExist.amount,
      },
    });

    const updatedSrkBank = await SrkBankModel.findOneAndUpdate(
      { userId: balancePayoutExist.userId },
      {
        $inc: {
          amount: balancePayoutExist.amount,
        },
      },
      {
        new: true,
      }
    );

    await bankStatement.create({
      amount: balancePayoutExist.amount,
      bankId: srkBankExist._id,
      currentAmount: updatedSrkBank?.amount,
      type: 'refunded',
      description: 'Rejected balance payout and refunded to user',
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Balance payout rejected successfully',
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

const srkBankPayoutRequest: AppRouteImplementation<
  typeof financeContract.srkBankPayoutRequest
> = async ({ req }) => {
  try {
    const srkBankExist = await SrkBankModel.findOne({
      userId: req.body.userId,
    });

    if (!srkBankExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Srk bank details not found',
        },
      };
    }

    if (srkBankExist.amount <= 0) {
      return {
        status: 404,
        body: {
          success: false,
          message: "You don't have any balance to payout",
        },
      };
    }

    if (req.body.amount < 500) {
      return {
        status: 403,
        body: {
          success: false,
          message: 'Minimum payout amount is 500',
        },
      };
    }
    const transactionAmount = req.body.amount;

    const tdsPercentage = 15; // Assuming TDS is 15%
    const amountAfterTDS = transactionAmount; // Amount after TDS deduction

    const totalAmount = amountAfterTDS / (1 - tdsPercentage / 100); // Calculate total before TDS
    const tdsAmount = totalAmount - amountAfterTDS; // Calculate TDS deducted

    await balancePayoutModel.create({
      userId: req.body.userId,
      amount: amountAfterTDS,
      status: 'pending',
      tdsAmount,
      totalAmount,
    });

    const updatedSrkBankExist = await SrkBankModel.findOneAndUpdate(
      { userId: req.body.userId },
      { $inc: { amount: -transactionAmount } },
      {
        new: true,
      }
    );

    await bankStatement.create({
      bankId: srkBankExist._id,
      type: 'payout_request',
      amount: transactionAmount,
      description: 'Srk bank payout request',
      currentAmount: updatedSrkBankExist?.amount || 0,
    });

    const adminSrkBankDoc = await AdminSrkBankService.getSrkBankDocument();
    await adminSrkBankDoc.updateOne({
      $inc: {
        totalPendingPayout: transactionAmount,
      },
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Balance payout request sent successfully',
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};
const createSrkUniversityPayout: AppRouteImplementation<
  typeof financeContract.createSrkUniversityPayout
> = async ({ req }) => {
  try {
    const adminBalanceExist = await adminBalanceModel.findOne({});
    const srkUniversityBankExist = await SrkUniversityBankModel.findOne({});

    if (!adminBalanceExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Admin balance not found',
        },
      };
    }
    if (!srkUniversityBankExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Srk university bank not found',
        },
      };
    }
    switch (req.body.type) {
      case 'ceoSalary':
        await adminBalanceExist.updateOne({
          $inc: {
            ceoSalary: -req.body.amount,
          },
        });
        break;
      case 'tdsAmount':
        await adminBalanceExist.updateOne({
          $inc: {
            tdsAmount: -req.body.amount,
          },
        });
        break;
      case 'eventWallet':
        await adminBalanceExist.updateOne({
          $inc: {
            eventWallet: -req.body.amount,
          },
        });
        break;
      case 'srkBonus':
        await adminBalanceExist.updateOne({
          $inc: {
            srkBonus: -req.body.amount,
          },
        });
        break;
      case 'officeManagementCharge':
        await adminBalanceExist.updateOne({
          $inc: {
            officeManagementCharge: -req.body.amount,
          },
        });
        break;
    }

    const adminSrkUniversityUpdated =
      await SrkUniversityBankModel.findOneAndUpdate(
        {}, // Your filter criteria here
        { $inc: { amount: req.body.amount } },
        { returnDocument: 'after' } // Returns the updated document
      );

    await bankStatement.create({
      amount: req.body.amount,
      type: 'deposit',
      description: ` ${req.body.type} balance deposited to srk university bank`,
      currentAmount: adminSrkUniversityUpdated?.amount || 0,
      srkUniversityBankId: srkUniversityBankExist._id,
    });

    const adminSrkBankDoc = await AdminSrkBankService.getSrkBankDocument();
    await adminSrkBankDoc.updateOne({
      $inc: {
        amount: req.body.amount,
      },
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Srk university payout request sent successfully',
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

const srkBankPayoutRequestForAdmin: AppRouteImplementation<
  typeof financeContract.srkBankPayoutRequestForAdmin
> = async ({ req }) => {
  try {
    const srkUniversityBank = await SrkUniversityBankModel.findOne({});

    if (!srkUniversityBank) {
      return {
        status: 404,
        body: {
          message: 'srk university bank not found.',
          success: false,
        },
      };
    }

    if (req.body.amount > srkUniversityBank.amount) {
      return {
        status: 403,
        body: {
          message: 'You dont have enough srk university balance',
          success: false,
        },
      };
    }
    await balancePayoutModel.create({
      amount: req.body.amount,
      tdsAmount: 0,
      isAdmin: true,
      totalAmount: req.body.amount,
    });

    const srkUniversityBankUpdated =
      await SrkUniversityBankModel.findOneAndUpdate(
        {},
        {
          $inc: {
            amount: -req.body.amount,
            totalPendingPayout: req.body.amount,
          },
        },
        {
          returnDocument: 'after',
        }
      );

    await bankStatement.create({
      amount: req.body.amount,
      srkUniversityBankId: srkUniversityBank._id,
      type: 'payout_request',
      description: 'srk university payout request',
      currentAmount: srkUniversityBankUpdated?.amount,
    });

    const adminSrkBankDoc = await AdminSrkBankService.getSrkBankDocument();

    await adminSrkBankDoc.updateOne({
      $inc: {
        totalPendingPayout: req.body.amount,
      },
    });

    return {
      status: 201,
      body: {
        message: 'srk bank payout done ',
        success: true,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const approveBankDetails: AppRouteImplementation<
  typeof financeContract.approveBankDetails
> = async ({ req }) => {
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

    const bankExist = await BankModel.findOne({
      userId: req.params.userId,
    });

    if (!bankExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Bank details not found',
        },
      };
    }

    await BankModel.findByIdAndUpdate(bankExist._id, {
      $set: {
        status: 'approved',
      },
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Bank details approved successfully',
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
const rejectBankRequest: AppRouteImplementation<
  typeof financeContract.rejectBankRequest
> = async ({ req }) => {
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

    const bankExist = await BankModel.findOne({
      userId: req.params.userId,
    });

    if (!bankExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Bank details not found',
        },
      };
    }

    if (!req.body.reason) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Rejection reason is required',
        },
      };
    }

    await BankModel.findByIdAndUpdate(bankExist._id, {
      $set: {
        rejectionReason: req.body.reason,
        status: 'rejected',
      },
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Bank details rejected successfully',
      },
    };
  } catch (error) {
    console.log(error);

    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

export const financeMutationHandler = {
  approveBalancePayout,
  rejectBalancePayout,
  createBalancePayout,
  upsertBankDetails,
  upsertKYCDetails,
  srkBankPayoutRequest,
  createSrkUniversityPayout,
  approveBankDetails,
  srkBankPayoutRequestForAdmin,
  rejectBankRequest,
};
