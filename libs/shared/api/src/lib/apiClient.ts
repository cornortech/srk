import axios from 'axios';
import { TPackage } from '@srk/shared/types';
import {
  TAddUserPayload,
  TAdminEarningType,
  TCreatePackagePayload,
  TLoginResponse,
  TRegisterPayload,
  TUpdateUserDetails,
  TUploadVideoPayload,
  TUpsertAffiliateBiometricData,
  TUpsertBankDetails,
  TUpsertKYCDetails,
  TUserDataReponseData,
  TUserStatus,
} from '@srk/shared/types';
import { data } from 'react-router-dom';
import { getFirebaseAuth } from './firebase-client';

// Reusable Axios instance
export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header with Firebase token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const auth = getFirebaseAuth();
      const token = await auth.currentUser?.getIdToken(true); // fetch fresh token
      console.log('Firebase token added to request:', token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.debug('No Firebase auth token available:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Initialize the API client with the backend URL
 * This must be called in each app's main.tsx with the app-specific env.backendUrl
 */
export const initializeApiClient = (backendUrl: string) => {
  apiClient.defaults.baseURL = backendUrl;
};

export interface LoginResponse {
  token: string;
}

export interface LoginError {
  message: string;
}
// auth

export const registerApi = async (data: TRegisterPayload) => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};
export const loginApi = async (data: {
  email: string;
  password: string;
}): Promise<TLoginResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data; // Ensure the backend sends the proper structure
};

export const verifyKycApi = async (userId: string) => {
  const response = await apiClient.post(`/auth/approveKyc/${userId}`);
  return response.data;
};

export const rejectKycApi = async (userId: string, reason: string) => {
  const response = await apiClient.post(`/auth/rejectKyc/${userId}`, {
    reason,
  });
  return response.data;
};

export const approvePaymentDetailsApi = async (userId: string) => {
  const response = await apiClient.post(
    `/auth/payment/approve-payment-verification/${userId}`
  );
  return response.data;
};

export const rejectPaymentDetailsApi = async (
  userId: string,
  reason: string
) => {
  const response = await apiClient.post(
    `/auth/payment/reject-payment-verification/${userId}`,
    {
      reason,
    }
  );
  return response.data;
};

export const authMeApi = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// SSO: Get auto code for cross-domain authentication
export const getAutoCodeApi = async (): Promise<{
  success: boolean;
  message: string;
  data?: {
    code: string;
    redirectUrl: string;
  };
}> => {
  const response = await apiClient.get('/auth/get-auto-code');
  return response.data;
};

// SSO: Exchange code for JWT token
export const exchangeCodeApi = async (
  code: string
): Promise<TLoginResponse> => {
  const response = await apiClient.post('/auth/exchange-code', { code });
  return response.data;
};

//user

export const getUserDetailsApi = async (
  userId: string
): Promise<TUserDataReponseData | null> => {
  const response = await apiClient.get(`/user/getUserDetails/${userId}`);
  return response.data;
};
export const updatePasswordApi = async (userId: string, password: string) => {
  const response = await apiClient.put(`/user/updatePassword/${userId}`, {
    password,
  });
  return response.data;
};

interface TUpdateUserArg {
  userId: string;
  data: TUpdateUserDetails;
}

export const updateUserDetailsApi = async ({
  data,
  userId,
}: TUpdateUserArg) => {
  const response = await apiClient.put(`/user/updateUserDetails/${userId}`, {
    userDetails: data,
    kycDetails: null,
    bankDetails: null,
  });
  return response.data;
};

export const getAllUsersApi = async () => {
  const response = await apiClient.get('/user/getAllUsers');
  return response.data;
};

export const getUsersByStatus = async (status: string | TUserStatus[]) => {
  const statusArray = Array.isArray(status) ? status : [status]; // Ensure array

  const queryString = statusArray
    .map((s) => `status[]=${encodeURIComponent(s)}`)
    .join('&'); // Use `status[]` format

  const response = await apiClient.get(`/user/getAllUsers?${queryString}`);
  return response.data;
};

export const makeCoursePaymentApi = async ({
  userId,
  transactionId,
  paymentMethod,
  paymentProofUrl,
}: {
  userId: string;
  transactionId: string;
  paymentMethod: string;
  paymentProofUrl: string;
}) => {
  const response = await apiClient.post(
    `/auth/payment/edit-payment-verification/${userId}`,
    {
      transactionId,
      paymentMethod,
      paymentProofUrl,
    }
  );
  return response.data;
};

// apply promocode
export const applyPromocodeApi = async (promocode: string) => {
  const response = await apiClient.get(`/user/verifyPromocode/${promocode}`);
  return response.data;
};

// packages

export const getAllPackagesApi = async () => {
  const response = await apiClient.get('/package/all');
  return response.data;
};

export const getPackageDetailsApi = async (
  id: string
): Promise<TPackage | null> => {
  const response = await apiClient.get(`/package/${id}`);
  return response.data;
};

export const addPackageApi = async (data: TCreatePackagePayload) => {
  const response = await apiClient.post('/package/create', data);
  return response.data;
};

export const deletePackageApi = async (id: string) => {
  const response = await apiClient.delete(`/package/${id}`);
  return response.data;
};

export const createUserApi = async (data: TAddUserPayload) => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

// course

export const getAllCoursesApi = async () => {
  const response = await apiClient.get('/course/getAllCourses');
  return response.data;
};

export const getAllCoursesOfPackageApi = async (packageId: string) => {
  const response = await apiClient.get(
    `/course/getAllCourses?packageId=${packageId}`
  );
  return response.data;
};

export const getCourseDetailsByIdApi = async (courseId: string) => {
  const response = await apiClient.get(`/course/${courseId}`);
  return response.data;
};

type TCreateCoursePayload = {
  title: string;
  description: string;
  image: string;
  package: string[];
};
export const createCourseApi = async (data: TCreateCoursePayload) => {
  const response = await apiClient.post('/course/create', data);
  return response.data;
};
// course video

export const getCourseVideoByCourseId = async (courseId: string) => {
  const response = await apiClient.get(`/course/getVideosOfCourse/${courseId}`);
  return response.data;
};

//affiliate
export const requestAffiliateProgramApi = async (userId: string) => {
  const response = await apiClient.post(`/affiliate/request/${userId}`, data);
  return response.data;
};

export const getAllAffiliateRequestsByStatusApi = async (status: string[]) => {
  const queryParams =
    status.length > 1
      ? status.map((s) => `status=${encodeURIComponent(s)}`).join('&')
      : `status=${encodeURIComponent(status[0])}`;

  const response = await apiClient.get(
    `/affiliate/getAllAffiliateRequestsByStatus?${queryParams}`
  );

  return response.data;
};

export const approveAffiliateRequestApi = async (userId: string) => {
  const response = await apiClient.post(`/affiliate/approve/${userId}`, data);
  return response.data;
};

export const getTeamsOfUserApi = async (userId: string) => {
  const response = await apiClient.get(`/affiliate/getTeamsOfUser/${userId}`);
  return response.data;
};

export const upsertAffiliateBiometricDataApi = async (
  userId: string,
  data: TUpsertAffiliateBiometricData
) => {
  const response = await apiClient.post(
    `/affiliate/addAffiliateBiometricData/${userId}`,
    data
  );
  return response.data;
};

export const rejectAffiliateRequestApi = async (
  userId: string,
  reason: string
) => {
  const response = await apiClient.post(`/affiliate/reject/${userId}`, {
    reason,
  });
  return response.data;
};

// finance

export const getSrkBonusFlowOfUserApi = async (userId: string) => {
  const response = await apiClient.get(`/finance/cashflow/user/${userId}`);
  return response.data;
};
export const getSrkBonusFlowAdminApi = async () => {
  const response = await apiClient.get(`/finance/cashflow`);
  return response.data;
};

export const upsertBankDetailsApi = async (
  userId: string,
  data: TUpsertBankDetails
) => {
  const response = await apiClient.post(
    `/finance/upsertBankDetails/${userId}`,
    data
  );
  return response.data;
};

export const upsertKycDetailsApi = async (
  userId: string,
  data: TUpsertKYCDetails
) => {
  const response = await apiClient.post(
    `/finance/upsertKYCDetails/${userId}`,
    data
  );
  return response.data;
};

export const getEarningDetailsofUserApi = async (userId: string) => {
  const response = await apiClient.get(
    `/finance/getEarningDetailsOfUser/${userId}`
  );
  return response.data;
};

export const getEarningLeaderboardApi = async (
  timeFrame: 'weekly' | 'monthly' | 'allTime'
) => {
  const response = await apiClient.get(
    `/finance/getEarningLeaderboard?timeFrame=${timeFrame}`
  );
  return response.data;
};

export const createBalancePayoutApi = async (
  userId: string,
  amount: number
) => {
  const response = await apiClient.post(`/finance/balance-payout`, {
    userId,
    amount,
  });
  return response.data;
};

export const getPayoutOfUserApi = async (userId: string) => {
  const response = await apiClient.get(
    `/finance/getAllBalancePayoutsOfUser/${userId}`
  );
  return response.data;
};

export const getBalancePayoutByStatus = async (status: string[]) => {
  const queryParams =
    status.length > 1
      ? status.map((s) => `status=${encodeURIComponent(s)}`).join('&')
      : `status=${encodeURIComponent(status[0])}`;

  const response = await apiClient.get(
    `/finance/getAllBalancePayoutsByStatus?${queryParams}`
  );
  return response.data;
};

export const approveBalancePayoutApi = async (
  payoutId: string,
  paymentProofUrl: string,
  paymentMethod: string,
  transactionNumber: string
) => {
  const response = await apiClient.post(
    `/finance/approveBalancePayout/${payoutId}`,
    {
      paymentProofUrl,
      paymentMethod,
      transactionNumber,
    }
  );
  return response.data;
};

export const rejectBalancePayoutApi = async (
  payoutId: string,
  reason: string
) => {
  const response = await apiClient.post(
    `/finance/rejectBalancePayout/${payoutId}`,
    {
      reason,
    }
  );
  return response.data;
};

export const getAdminEarningDetailsApi = async () => {
  const response = await apiClient.get(`/finance/getAdminEarningDetails`);
  return response.data;
};

export const getBankStatementOfUserApi = async (userId: string) => {
  const response = await apiClient.get(
    `/finance/getBankStatementOfUser/${userId}`
  );
  return response.data;
};

export const srkBankPayoutRequestApi = async (
  userId: string,
  amount: number
) => {
  const response = await apiClient.post(`/finance/srkBankPayoutRequest`, {
    userId,
    amount,
  });
  return response.data;
};

export const getAdminSrkBankStatementApi = async () => {
  const response = await apiClient.get(`/finance/getBankStatementForAdmin`);
  return response.data;
};

export const getAdminSrkBankDetailsApi = async () => {
  const response = await apiClient.get(`/finance/getSrkBankDetailsForAdmin`);
  return response.data;
};

// finance admin

export const adminBalancePayoutToSrkUniversityApi = async (
  type: TAdminEarningType,
  amount: number
) => {
  const response = await apiClient.post(`/finance/createSrkUniversityPayout`, {
    type,
    amount,
  });
  return response.data;
};

export const getAllSrkUniversityBankStatementApi = async () => {
  const response = await apiClient.get(
    `/finance/getAllSrkUniversityBankStatement`
  );
  return response.data;
};

export const srkUniversityBankPayoutApi = async (amount: string) => {
  const response = await apiClient.post(
    `/finance/srkUniversityBankPayout`,
    amount
  );
  return response.data;
};

export const createSrkUniversityBankPayoutApi = async (amount: number) => {
  const response = await apiClient.post(`/finance/srkUniversityBankPayout`, {
    amount,
  });
  return response.data;
};

export const uploadVideoApi = async (data: TUploadVideoPayload) => {
  const response = await apiClient.post(
    `/course/createVideoInCourse/${data.courseId}`,
    data
  );
  return response.data;
};

export const getBankRequestApi = async () => {
  const response = await apiClient.get(`/finance/getBankRequest`);
  return response.data;
};

export const approveBankRequestApi = async (userId: string) => {
  const response = await apiClient.post(
    `/finance/approveBankDetails/${userId}`
  );
  return response.data;
};

export const rejectBankRequestApi = async (userId: string, reason: string) => {
  const response = await apiClient.post(
    `/finance/rejectBankRequest/${userId}`,
    {
      reason,
    }
  );
  return response.data;
};

// webinar

export const getAllWebinarsApi = async () => {
  const response = await apiClient.get('/webinar/all');
  return response.data;
};

export type TCreateWebinarPayload = {
  meetUrl: string;
  startTime: Date;
  endTime: Date;
  title: string;
};

export const createWebinarApi = async (data: TCreateWebinarPayload) => {
  const response = await apiClient.post('/webinar/create', data);
  return response.data;
};

export const deleteWebinarApi = async (id: string) => {
  const response = await apiClient.delete(`/webinar/${id}`);
  return response.data;
};

export const updateWebinarApi = async (
  data: TCreateWebinarPayload,
  id: string
) => {
  const response = await apiClient.put(`/webinar/${id}`, data);
  return response.data;
};
