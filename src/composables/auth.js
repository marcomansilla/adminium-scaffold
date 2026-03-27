import { useAuthStore } from '../stores/UseAuthStore.js';

export function useAuth() {
  const store = useAuthStore();

  const loginUser = (uri, payload) => {
    return store.Login(uri, payload);
  };

  const checkAuth = (success_path, fail_path) => {
    return store.CheckAuth(success_path, fail_path);
  };

  const logout = () => {
    return store.Logout();
  };

  return {
    loginUser,
    checkAuth,
    logout
  };
}
