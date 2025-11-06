import { create } from "zustand";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearIsAuthenticated: () => void;
  setIsLoading: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
  setIsLoading: (value) => set({ isLoading: value }),
}));
