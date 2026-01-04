import { create } from 'zustand';
import { TaskUser } from '../lib/types';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TaskAuthState {
  user: TaskUser | null;
  universityID: string | null;
  taskUserID: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setTaskUserID: (id: string) => void;
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
      universityID: null,
      taskUserID: null,

      setTaskUserID: (id) => set({ taskUserID: id }),

      setUser: (user) =>
        set({
          user,
          universityID: user?._id,
          taskUserID: null,
          // '69545b8c4036f70e122fe9ef',
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user: null,
          universityID: null,
          taskUserID: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'srkAffiliate-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTaskAuthStore;
