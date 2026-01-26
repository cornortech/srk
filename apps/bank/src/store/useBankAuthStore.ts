import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IBankUser } from '../utils/types/auth/auth.type';

interface BankAuthState {
  user: IBankUser | null;
  universityID: string | null;
  bankUserID: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setBankUserID: (id: string) => void;
  setUser: (user: IBankUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useBankAuthStore = create<BankAuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false, // Default to false, hydration handles true state if needed
      universityID: null,
      bankUserID: null,

      setBankUserID: (id) => set({ bankUserID: id }),

      setUser: (user) =>
        set({
          user,
          universityID: user?._id,
          bankUserID: null,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user: null,
          universityID: null,
          bankUserID: null,
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

export default useBankAuthStore;
