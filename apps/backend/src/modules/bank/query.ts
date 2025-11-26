import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { bankContract } from '../../contract/bank/contract';
import { UserModel } from '../../model/userModel';
import { SrkBankModel } from '../../model/srkBankModel';

const getBankDetailsByUserId: AppRouteImplementationOrOptions<
  typeof bankContract.getBankDetailsByUserId
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
        accountNumber: string;
        status: string;
        bankDetailsId: {
          familyDetails: {
            fatherName: string;
            motherName: string;
            spouseName: string;
            childrenNames: string[];
          };
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
            placeOfBirth: string;
            issuedFrom: string;
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
        srkBankDetails: {
          accountNumber: userExist.srkBankId?.accountNumber || null,
          status: userExist.srkBankId?.status || null,
        },
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
              issuedFrom:
                userExist.srkBankId.bankDetailsId.identificationDetails
                  .issuedFrom,
              placeOfBirth:
                userExist.srkBankId.bankDetailsId.identificationDetails
                  .placeOfBirth,
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
        familyDetails: userExist.srkBankId?.bankDetailsId?.familyDetails
          ? {
              fatherName:
                userExist.srkBankId.bankDetailsId.familyDetails.fatherName,
              motherName:
                userExist.srkBankId.bankDetailsId.familyDetails.motherName,
              spouseName:
                userExist.srkBankId.bankDetailsId.familyDetails.spouseName,
              childrenNames:
                userExist.srkBankId.bankDetailsId.familyDetails.childrenNames ||
                [],
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

const getBankDetailsByAccountNumber: AppRouteImplementationOrOptions<
  typeof bankContract.getBankDetailsByAccountNumber
> = async ({ req, res }) => {
  try {
    const accountNumber = req.params.accountNumber;
    if (!accountNumber) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Account number is required',
        },
      };
    }

    const srkBank = await SrkBankModel.findOne({
      accountNumber: accountNumber,
    }).populate<{
      bankDetailsId: {
        familyDetails: {
          fatherName: string;
          motherName: string;
          spouseName: string;
          childrenNames: string[];
        };
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
          issuedFrom: string;
          placeOfBirth: string;
        };
        documents: {
          ppSizePhoto: string;
          nationalIdCard: string;
        };
      };
    }>({
      path: 'bankDetailsId',
      model: 'BankDetails',
    });

    if (!srkBank) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    console.log(srkBank);

    return {
      status: 200,
      body: {
        userId: srkBank._id.toString(),
        currentAddress: srkBank?.bankDetailsId?.currentAddress
          ? {
              country: srkBank.bankDetailsId.currentAddress.country,
              province: srkBank.bankDetailsId.currentAddress.province,
              district: srkBank.bankDetailsId.currentAddress.district,
              municipality: srkBank.bankDetailsId.currentAddress.municipality,
              wardNo: srkBank.bankDetailsId.currentAddress.wardNo,
              street: srkBank.bankDetailsId.currentAddress.street,
            }
          : null,
        permanentAddress: srkBank?.bankDetailsId?.permanentAddress
          ? {
              country: srkBank.bankDetailsId.permanentAddress.country,
              province: srkBank.bankDetailsId.permanentAddress.province,
              district: srkBank.bankDetailsId.permanentAddress.district,
              municipality: srkBank.bankDetailsId.permanentAddress.municipality,
              wardNo: srkBank.bankDetailsId.permanentAddress.wardNo,
              street: srkBank.bankDetailsId.permanentAddress.street,
            }
          : null,
        identificationDetails: srkBank?.bankDetailsId?.identificationDetails
          ? {
              idNumber: srkBank.bankDetailsId.identificationDetails.idNumber,
              idType: srkBank.bankDetailsId.identificationDetails.idType,
              issuedDate:
                srkBank.bankDetailsId.identificationDetails.issuedDate,

              issuedFrom:
                srkBank.bankDetailsId.identificationDetails.issuedFrom,
              placeOfBirth:
                srkBank.bankDetailsId.identificationDetails.placeOfBirth,
            }
          : null,
        documents: srkBank?.bankDetailsId?.documents
          ? {
              ppSizePhoto: srkBank.bankDetailsId.documents.ppSizePhoto,
              nationalIdCard: srkBank.bankDetailsId.documents.nationalIdCard,
            }
          : null,
        familyDetails: srkBank?.bankDetailsId?.familyDetails
          ? {
              fatherName: srkBank.bankDetailsId.familyDetails.fatherName,
              motherName: srkBank.bankDetailsId.familyDetails.motherName,
              spouseName: srkBank.bankDetailsId.familyDetails.spouseName,
              childrenNames:
                srkBank.bankDetailsId.familyDetails.childrenNames || [],
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

const getBankBalance: AppRouteImplementationOrOptions<
  typeof bankContract.getBankBalance
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

    const srkBank = await SrkBankModel.findOne({
      userId: userId,
    });

    if (!srkBank) {
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
        balance: srkBank.amount,
      },
    };
  } catch (error) {
    console.log(error);
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
  getBankBalance,
  getBankDetailsByUserId,
  getBankDetailsByAccountNumber,
};