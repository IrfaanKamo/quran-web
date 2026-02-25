import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  username: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  expiresAt: number | null;
  _hasHydrated: boolean;
  setAuth: (user: User, durationMinutes: number) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      expiresAt: null,
      _hasHydrated: false,

      setAuth: (user, durationMinutes) => {
        const expirationTime = Date.now() + durationMinutes * 60 * 1000;
        set({ user, expiresAt: expirationTime });
      },

      logout: () => set({ user: null, expiresAt: null }),
      
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);