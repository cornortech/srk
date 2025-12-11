import { create } from 'zustand';
import { TaskUser } from '../lib/types';

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
