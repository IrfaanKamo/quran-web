import { create } from "zustand";

type User = {
  id?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  [key: string]: any;
} | null;

type AuthState = {
  user: User;
  setUser: (u: User) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

const STORAGE_KEY = "auth_session";

export const useAuthStore = create<AuthState>((set: any) => ({
  // start with null on both server and client to avoid hydration mismatches
  user: null,

  setUser: (u: User) => {
    set({ user: u });
    if (typeof window !== "undefined") {
      try {
        if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        else localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // ignore
      }
    }
  },

  logout: () => {
    set({ user: null });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  },

  isLoggedIn: () => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return !!raw;
  },
}));

export default useAuthStore;
