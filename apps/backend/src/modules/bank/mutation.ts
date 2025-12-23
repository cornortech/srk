import mongoose, { mongo } from 'mongoose';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { bankContract } from '../../../../../libs/shared/contracts/src/lib/bank/contract';
import { UserModel } from '../../model/userModel';
import { BankDetailsModel } from '../../model/bankDetails';
import { SrkBankModel } from '../../model/srkBankModel';

const createBankDetails: AppRouteImplementationOrOptions<
  typeof bankContract.createBankDetails
> = async ({ req, res }) => {
  try {
    const { userId } = req.params;
    const body = req.body;
    let srkBankId: null | mongoose.Types.ObjectId = null;

    // Validate userId

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

    srkBankId = userExist.srkBankId!;

    if (!userExist.srkBankId) {
      const newSrkBank = await SrkBankModel.create({
        userId: userExist._id,
        status: 'pending',
      });
      srkBankId = newSrkBank._id;
      userExist.srkBankId = srkBankId;
      await userExist.save();
    }

    // Create bank details

    await BankDetailsModel.create({
      srkBankId: srkBankId,
      documents: {
        ppSizePhoto: body.documents.ppSizePhoto,
        nationalIdCard: body.documents.nationalIdCard,
      },
      identificationDetails: {
        idType: body.identificationDetails.idType,
        idNumber: body.identificationDetails.idNumber,
        issuedDate: body.identificationDetails.issuedDate,
        issuedFrom: body.identificationDetails.issuedFrom,
        nidAuthority: body.identificationDetails.nidAuthority,
      },
      familyDetails: {
        fatherName: body.familyDetails.fatherName,
        motherName: body.familyDetails.motherName,
        spouseName: body.familyDetails.spouseName,
        childrenNames: body.familyDetails.childrenNames,
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

export const bankMutationHandlers = {
  createBankDetails,
};
