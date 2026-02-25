import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const tadabburApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

// Axios interceptor to refresh outdated tokens when making api calls
tadabburApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { logout, setAuth } = useAuthStore.getState();

    // 401 (Expired Access Token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { user, expiresInMinutes } = refreshResponse.data;
        const _shortenedExpiryInMins = expiresInMinutes - 2;
        setAuth(user, _shortenedExpiryInMins || 28);

        return tadabburApi(originalRequest);
      } catch (refreshError) {
        logout();
        if (typeof window !== 'undefined') window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default tadabburApi;