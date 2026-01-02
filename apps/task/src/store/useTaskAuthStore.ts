import { create } from 'zustand';
import { TaskUser } from '../lib/types';
import { persist, createJSONStorage } from 'zustand/middleware';


interface TaskAuthState {
  user: TaskUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: TaskUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useTaskAuthStore = create<TaskAuthState>()(
 persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false, // Default to false, hydration handles true state if needed

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
    }),
    {
      name: 'srktask-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTaskAuthStore;

