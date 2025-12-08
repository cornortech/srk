// API endpoints placeholder
export const API_ENDPOINTS = {
  users: {
    list: '/api/users',
    detail: (id: string) => `/api/users/${id}`,
    create: '/api/users',
    update: (id: string) => `/api/users/${id}`,
    delete: (id: string) => `/api/users/${id}`,
  },
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },
  sso: {
    getAutoCode: '/auth/sso/get-auto-code',
    exchangeCode: '/auth/sso/exchange-code',
    getMe: '/auth/sso/me',
  },
};
