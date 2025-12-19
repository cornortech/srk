import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getSrkGrowProfileResponseSchema } from '@srk/shared/contracts';
import { z } from 'zod';

export type GrowUser = z.infer<
  typeof getSrkGrowProfileResponseSchema
>['result'];

interface GrowAuthState {
  user: GrowUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: GrowUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useGrowAuthStore = create<GrowAuthState>()(
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
      name: 'srkgrow-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useGrowAuthStore;
