import { create } from 'zustand';
import { TaskUser } from '../lib/types';

interface TaskAuthState {
  user: TaskUser | null;
  universityID: string | null;
  taskUserID: string | null;
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
  universityID: null,
  taskUserID: null,

  setUser: (user) =>
    set({
      user,
      universityID: '692d5b88a8f7bb228f363bfc',
      taskUserID: '69545b8c4036f70e122fe9ef',
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
}));

export default useTaskAuthStore;
