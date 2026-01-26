import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
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
    universityId: string;
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
    universityId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

// Create axios instance with credentials
const createSSOClient = (backendUrl: string): AxiosInstance => {
  const client = axios.create({
    baseURL: backendUrl,
    withCredentials: true, // Important for cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Response interceptor for handling 401 and auto-refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // If error is 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh token
          await client.post('/auth/refresh');
          
          // Token refreshed successfully, process queued requests
          processQueue();
          
          // Retry original request
          return client(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear queue and redirect to login
          processQueue(refreshError);
          
          // Clear any existing tokens
          try {
            await client.post('/auth/logout');
          } catch (logoutError) {
            // Ignore logout errors
          }

          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * Get SSO auto code for redirecting to another app (task or bank)
 * Called from the source app (university)
 */
export const getAutoCode = async (
  backendUrl: string,
  targetApp: 'task' | 'growaffiliate' | 'growsocialmedia' | 'bank' = 'task'
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
