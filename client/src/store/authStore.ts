import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMeFn } from '../api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isCheckingAuth: true, // Start as true to prevent immediate redirect on refresh
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      checkAuth: async () => {
        try {
          console.log('[Auth Store] Checking auth via /api/auth/me...');
          const res = await getMeFn();
          console.log('[Auth Store] /me successful, user:', res.data.user);
          set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
          console.log('[Auth Store] /me failed, clearing auth state.');
          set({ user: null, token: null, isAuthenticated: false, isCheckingAuth: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }), // Don't persist isCheckingAuth
    }
  )
);
