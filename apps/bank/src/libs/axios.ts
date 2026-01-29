import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_ROOT_URL, // Backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});
