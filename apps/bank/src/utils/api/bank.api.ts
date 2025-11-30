import { apiClient } from '@srk/shared/api';

export type CreateBankDetailsPayload = {
  password: string;
  familyDetails: {
    fatherName: string;
    motherName: string;
    spouseName?: string;
    childrenNames?: string[];
  };
  permanentAddress: {
    country: string;
    province: string;
    district: string;
    municipality: string;
    wardNo: string;
    street: string;
  };
  currentAddress: {
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
    placeOfBirth: string;
    issuedDate: string; // string input, transformed to Date by Zod
    issuedFrom: string;
  };

  documents: {
    ppSizePhoto: string;
    nationalIdCard: string;
  };
};

const createBankDetailsApi = (
  userId: string,
  payload: CreateBankDetailsPayload
) => {
  return apiClient.post(`/bank/details/${userId}`, payload);
};

const validateBankRegistrationOtp = (userId: string, otp: string) => {
  return apiClient.post(`/bank/validate-registration-otp/${userId}`, { otp });
};

const sendBankRegistrationOtp = (userId: string) => {
  return apiClient.post(`/bank/send-registration-otp/${userId}`);
};

const uploadBankProfilePicture = (userId: string, profilePicture: string) => {
  return apiClient.post(`/bank/upload-profile-picture/${userId}`, {
    profilePicture,
  });
};

const createBankTransactionPin = (userId: string, pin: string) => {
  return apiClient.post(`/bank/create-transaction-pin/${userId}`, {
    transactionPIN: pin,
  });
};

const getBankDetailsByUserId = (userId: string) => {
  return apiClient.get(`/bank/details/${userId}`);
};

const getBankBalance = (userId: string) => {
  return apiClient.get(`/bank/balance/${userId}`);
};

const validateTransactionPin = (transactionPIN: string, intentId: string) => {
  return apiClient.post(`/bank/validate-transaction-pin`, {
    transactionPIN,
    intentId,
  });
};

const sendMoney = ({
  userId,
  intentId,
}: {
  userId: string;
  intentId: string;
}) => {
  return apiClient.post(`/bank/send-money/${userId}`, {
    intentId,
  });
};

const createPaymentIntent = (payload: {
  userId: string;
  amount: number;
  receiverAccountNumber: string;
  description?: string;
  recipientName: string;
}) => {
  return apiClient.post(`/bank/payment-intent/${payload.userId}`, {
    userId: payload.userId,
    amount: +payload.amount,
    receiverAccountNumber: payload.receiverAccountNumber,
    description: payload.description,
    recipientName: payload.recipientName,
  });
};

const getBankStatementOfUser = (userId: string) => {
  return apiClient.get(`/finance/getBankStatementOfUser/${userId}`);
};

export const bankApi = {
  sendMoney,
  getBankStatementOfUser,
  getBankBalance,
  createPaymentIntent,
  createBankDetailsApi,
  validateBankRegistrationOtp,
  validateTransactionPin,
  sendBankRegistrationOtp,
  createBankTransactionPin,
  uploadBankProfilePicture,
  getBankDetailsByUserId,
};
