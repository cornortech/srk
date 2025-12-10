import { create } from 'zustand';

export interface GrowUser {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface GrowAuthState {
  user: GrowUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: GrowUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useGrowAuthStore = create<GrowAuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));

export default useGrowAuthStore;
