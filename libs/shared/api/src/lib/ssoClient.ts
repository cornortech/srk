import axios from 'axios';
import { API_ENDPOINTS } from './api/endpoints';

// SSO Response Types
export interface SSOCodeResponse {
  success: boolean;
  message: string;
  data?: {
    code: string;
    redirectUrl: string;
    expiresIn: number;
  };
}

export interface SSOExchangeResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    redirectionUrl: string;
  };
}

export interface SSOGetMeResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

// Create axios instance with credentials
const createSSOClient = (backendUrl: string) => {
  return axios.create({
    baseURL: backendUrl,
    withCredentials: true, // Important for cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Get SSO auto code for redirecting to another app (task or bank)
 * Called from the source app (university)
 */
export const getAutoCode = async (
  backendUrl: string,
  targetApp: 'task' | 'bank' = 'task'
): Promise<SSOCodeResponse> => {
  const client = createSSOClient(backendUrl);
  const response = await client.get<SSOCodeResponse>(
    `${API_ENDPOINTS.sso.getAutoCode}?targetApp=${targetApp}`
  );
  return response.data;
};

/**
 * Exchange SSO code for authentication
 * Called from the target app (task or bank)
 */
export const exchangeCode = async (
  backendUrl: string,
  code: string
): Promise<SSOExchangeResponse> => {
  const client = createSSOClient(backendUrl);
  const response = await client.post<SSOExchangeResponse>(
    API_ENDPOINTS.sso.exchangeCode,
    { code }
  );
  return response.data;
};

/**
 * Get current authenticated user from cookie
 * Used to restore session on page refresh
 */
export const getMe = async (backendUrl: string): Promise<SSOGetMeResponse> => {
  const client = createSSOClient(backendUrl);
  const response = await client.get<SSOGetMeResponse>(API_ENDPOINTS.sso.getMe);
  return response.data;
};
