import { Outlet, useNavigate } from "react-router-dom";
import { getUserDetailsApi } from "../lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import AuthLocalStorage from "../lib/localstorage/auth";
import useAuthStore from "../store/useAuth";

const AuthLayout = () => {
  const navigate = useNavigate();
  const userId = AuthLocalStorage.getUserData("user")?._id;
  const { setAuthDetails } = useAuthStore();

  useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return;
      const data = await getUserDetailsApi(userId);
      if (!data) return;
      setAuthDetails({
        userDetails: {
          _id: data.userDetails._id,
          country: data.userDetails.country,
          dob: data.userDetails.dob,
          email: data.userDetails.email,
          firstName: data.userDetails.firstName,
          lastName: data.userDetails.lastName,
          phoneNumber: data.userDetails.phoneNumber,
          profilePicture: data.userDetails.profilePicture,
          referralCode: data.userDetails.referralCode,
          gender: data.userDetails.gender,
          packageId: data.userDetails.packageId,
          createdAt: data.userDetails.createdAt,
          referredBy: data.userDetails.referredBy,
          updatedAt: data.userDetails.updatedAt,
          isActive: data.userDetails.isActive,
          affiliateEnabled: data.userDetails.affiliateEnabled,
          status: data.userDetails.status,
          allowedToAddUsers: data.userDetails.allowedToAddUsers,
          redirectionUrl: data.redirectionUrl,
          purpose: data.userDetails.purpose,
        },
      });
      navigate(data?.redirectionUrl);
      return data;
    },
    enabled: !!userId,
  });
  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthLayout;
