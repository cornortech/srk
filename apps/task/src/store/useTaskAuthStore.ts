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
  clearTaskUserID: () => void;
  setUser: (user: TaskUser | null) => void;
  setLoading: (loading: boolean) => void;
  setUniversityID: (id: string | null) => void;
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

      // Clears a stale taskUserID (e.g. when the DB record was deleted and re-created)
      clearTaskUserID: () => set({ taskUserID: null }),

      setUniversityID: (id) => set({ universityID: id }),

      setUser: (user) =>
        set((state) => ({
          user,
          universityID: user?.universityId ?? state.universityID,
          taskUserID: state.taskUserID,
          isAuthenticated: !!user,
          isLoading: false,
        })),

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
