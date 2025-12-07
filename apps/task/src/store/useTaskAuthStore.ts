import { create } from 'zustand';
import { SSOUser } from '@srk/shared/contracts';

// Re-export the type from contracts for convenience
export type TaskUser = SSOUser;

interface TaskAuthState {
  user: TaskUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: TaskUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useTaskAuthStore = create<TaskAuthState>((set) => ({
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

export default useTaskAuthStore;
