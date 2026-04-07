// composables/useAxiosInterceptor.js
import axios from 'axios';
import { useAuthStore } from '../stores/UseAuthStore';
import { GlobalNotificator } from './notificator';

export function useInterceptor() {
  const setupInterceptors = (axiosInstance) => {
    // Response interceptor - only handles responses
    axiosInstance.interceptors.response.use(
      (response) => {
        // Just return successful responses
        return response;
      },
      (error) => {
        // Handle only token expiration (401)
        if (error.response?.status === 401) {
          const authStore = useAuthStore();

          // Clear auth data
          authStore.Logout();

          // Show notification
          GlobalNotificator(
            'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
            'negative'
          );

          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }

        // Return error to be handled by the calling code
        return Promise.reject(error);
      }
    );
  };

  return {
    setupInterceptors
  };
}
