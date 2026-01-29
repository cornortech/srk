import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TAuthState } from '../utils/types/auth/auth.type';

const useAuthStore = create<TAuthState>()(
  persist(
    (set) => ({
      userDetails: null,
      refresh: true,
      srkBank: null,
      authDetails: {
        role: 'user',
        email: '',
        redirectionUrl: '',
      },
      setAuthDetails: ({ userDetails, srkBank, authDetails }) =>
        set(() => ({
          authDetails: authDetails,
          srkBank: srkBank
            ? {
                _id: srkBank?._id || '',
                accountNumber: srkBank?.accountNumber || '',
                status: srkBank?.status || null,
                amount: srkBank?.amount || 0,
                bankDetailsId: srkBank?.bankDetailsId || null,
              }
            : null,
          userDetails: userDetails
            ? {
                _id: userDetails._id,
                country: userDetails.country,
                dob: userDetails.dob,
                email: userDetails.email,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                phoneNumber: userDetails.phoneNumber,
                profilePicture: userDetails.profilePicture,
                referralCode: userDetails.referralCode,
                gender: userDetails.gender,
                packageId: userDetails.packageId,
                createdAt: userDetails.createdAt,
                referredBy: userDetails.referredBy,
                updatedAt: userDetails.updatedAt,
                isActive: userDetails.isActive,
                affiliateEnabled: userDetails.affiliateEnabled,
                status: userDetails.status,
                allowedToAddUsers: userDetails.allowedToAddUsers,
                redirectionUrl: userDetails.redirectionUrl,
                purpose: userDetails.purpose,
                bankDetailsId: userDetails.bankDetailsId,
              }
            : null,
        })),
      toggleRefresh: () => set((state) => ({ refresh: !state.refresh })),
      clearAuthDetails: () =>
        set(() => ({
          userDetails: null,
          srkBank: null,
          authDetails: {
            role: 'user',
            email: '',
            redirectionUrl: '',
          },
        })),
    }),
    {
      name: 'srk-bank-auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
