import { create } from "zustand";
import { TAuthState } from "../utils/types/auth/auth.type";

const useAuthStore = create<TAuthState>((set) => ({
  userDetails: null,
  refresh: true,
  srkBank: null,
  authDetails: {
    role: "user",
    email: "",
    redirectionUrl: "",
  },
  setAuthDetails: ({ userDetails, srkBank, authDetails }) =>
    set(() => ({
      authDetails: authDetails,
      srkBank: {
        _id: srkBank?._id || "",
        accountNumber: srkBank?.accountNumber || "",
        status: srkBank?.status || null,
        amount: srkBank?.amount || 0,
      },
      userDetails: userDetails ? {
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
      } : null,
    })),
  toggleRefresh: () => set((state) => ({ refresh: !state.refresh })),
  clearAuthDetails: () =>
    set(() => ({
      userDetails: null,
    })),
}));

export default useAuthStore;
