import { create } from "zustand";
import { TAuthState } from "../lib/types";

const useAuthStore = create<TAuthState>((set) => ({
  userDetails: null,
  refresh: true,

  setAuthDetails: ({ userDetails }) =>
    set(() => ({
      userDetails: {
        country: userDetails.country,
        dob: userDetails.dob,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phoneNumber: userDetails.phoneNumber,
        profilePicture: userDetails.profilePicture,
        referralCode: userDetails.referralCode,
        gender: userDetails.gender,
        _id: userDetails._id,
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
      },
    })),
  toggleRefresh: () => set((state) => ({ refresh: !state.refresh })),
  clearAuthDetails: () =>
    set(() => ({
      userDetails: null,
    })),
}));

export default useAuthStore;
