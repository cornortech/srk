import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { bankContract } from '../../../../../libs/shared/contracts/src/lib/bank/contract';
import { UserModel } from '../../model/userModel';
import { SrkBankModel } from '../../model/srkBankModel';

const getBankDetails: AppRouteImplementationOrOptions<
  typeof bankContract.getBankDetails
> = async ({ req, res }) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'User ID is required',
        },
      };
    }

    const userExist = await UserModel.findById(userId).populate<{
      srkBankId: {
        bankDetailsId: {
          currentAddress: {
            country: string;
            province: string;
            district: string;
            municipality: string;
            wardNo: string;
            street: string;
          };
          permanentAddress: {
            country: string;
            province: string;
            district: string;
            municipality: string;
            wardNo: string;
            street: string;
          };
          identificationDetails: {
            idNumber: string;
            idType: string;
            issuedDate: Date;
            expiryDate: Date;
            issuedFrom: string;
            nidAuthority: string;
          };
          documents: {
            ppSizePhoto: string;
            nationalIdCard: string;
          };
        };
      };
    }>({
      path: 'srkBankId',
      model: 'SrkBank',
      populate: {
        path: 'bankDetailsId',
        model: 'BankDetails',
      },
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

    return {
      status: 200,
      body: {
        userId: userExist._id.toString(),
        currentAddress: userExist.srkBankId?.bankDetailsId?.currentAddress
          ? {
              country: userExist.srkBankId.bankDetailsId.currentAddress.country,
              province:
                userExist.srkBankId.bankDetailsId.currentAddress.province,
              district:
                userExist.srkBankId.bankDetailsId.currentAddress.district,
              municipality:
                userExist.srkBankId.bankDetailsId.currentAddress.municipality,
              wardNo: userExist.srkBankId.bankDetailsId.currentAddress.wardNo,
              street: userExist.srkBankId.bankDetailsId.currentAddress.street,
            }
          : null,
        permanentAddress: userExist.srkBankId?.bankDetailsId?.permanentAddress
          ? {
              country:
                userExist.srkBankId.bankDetailsId.permanentAddress.country,
              province:
                userExist.srkBankId.bankDetailsId.permanentAddress.province,
              district:
                userExist.srkBankId.bankDetailsId.permanentAddress.district,
              municipality:
                userExist.srkBankId.bankDetailsId.permanentAddress.municipality,
              wardNo: userExist.srkBankId.bankDetailsId.permanentAddress.wardNo,
              street: userExist.srkBankId.bankDetailsId.permanentAddress.street,
            }
          : null,
        identificationDetails: userExist.srkBankId?.bankDetailsId
          ?.identificationDetails
          ? {
              idNumber:
                userExist.srkBankId.bankDetailsId.identificationDetails
                  .idNumber,
              idType:
                userExist.srkBankId.bankDetailsId.identificationDetails.idType,
              issuedDate:
                userExist.srkBankId.bankDetailsId.identificationDetails
                  .issuedDate,
              expiryDate:
                userExist.srkBankId.bankDetailsId.identificationDetails
                  .expiryDate,
              issuedFrom:
                userExist.srkBankId.bankDetailsId.identificationDetails
                  .issuedFrom,
              nidAuthority:
                userExist.srkBankId.bankDetailsId.identificationDetails
                  .nidAuthority,
            }
          : null,
        documents: userExist.srkBankId?.bankDetailsId?.documents
          ? {
              ppSizePhoto:
                userExist.srkBankId.bankDetailsId.documents.ppSizePhoto,
              nationalIdCard:
                userExist.srkBankId.bankDetailsId.documents.nationalIdCard,
            }
          : null,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const getSrkBankRequestByStatus: AppRouteImplementationOrOptions<
  typeof bankContract.getSrkBankRequestByStatus
> = async ({ req, res }) => {
  try {
    const status = req.query.status;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const srkBankRequests = await SrkBankModel.find(filter).populate<{
      userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
      };
    }>('userId');

    const formattedRequests = srkBankRequests.map((bank) => ({
      requestedAt: bank.createdAt,
      status: bank.status,
      userId: {
        _id: bank.userId._id.toString(),
        firstName: bank.userId.firstName,
        lastName: bank.userId.lastName,
        email: bank.userId.email,
        phoneNumber: bank.userId.phoneNumber,
        requestedAt: bank.createdAt,
      },
    }));

    return {
      status: 200,
      body: formattedRequests,
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

export const bankQueryHandlers = {
  getBankDetails,
  getSrkBankRequestByStatus,
};
