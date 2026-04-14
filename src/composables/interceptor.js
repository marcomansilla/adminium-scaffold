// composables/useAxiosInterceptor.js
import axios from 'axios';
import { useAuthStore } from '../stores/UseAuthStore';
import { GlobalNotificator } from './notificator';

export function useInterceptor() {
  const setupInterceptors = (axiosInstance) => {
    // Response interceptor
    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Handle 401 errors
        if (error.response?.status === 401) {
          const authStore = useAuthStore();
          const errorMessage = error.response?.data?.message || '';

          // Only clear auth if token is actually expired/invalid
          if (errorMessage.includes('expired') || errorMessage.includes('Invalid')) {
            authStore.Logout();
            GlobalNotificator('Tu sesión ha expirado. Por favor inicia sesión nuevamente.', 'negative');

            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
              console.log('test');
              window.location.href = '/login';
            }
          }
          // For other 401 errors (like user not found, deleted_at), don't redirect
        }

        return Promise.reject(error);
      }
    );
  };

  return {
    setupInterceptors
  };
}
