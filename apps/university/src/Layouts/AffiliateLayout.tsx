import { ReusableNavbar } from "../components/Navbar";
import { Outlet, ScrollRestoration, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { useEffect } from "react";
import { menuItems } from "../Data/NavbarData";
import useAuthStore from "../store/useAuth";
import AuthLocalStorage from "../lib/localstorage/auth";
import { useQuery } from "@tanstack/react-query";
import { getUserDetailsApi } from "../lib/apiClient";
import { Sidebar } from "../components/SideBar";

// this is the affiliate dashboard layout
const AffiliateDashboardLayout = () => {
  const userId = AuthLocalStorage.getUserData("user")?._id;
  const { setAuthDetails } = useAuthStore();
  const navigate = useNavigate();

  useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        if (!userId) return;
        const data = await getUserDetailsApi(userId);

        if (!data || !data?.userDetails) {
          return navigate("/");
        }
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
            status: data.userDetails.status,
            affiliateEnabled: data.userDetails.affiliateEnabled,
            allowedToAddUsers: data.userDetails.allowedToAddUsers,
            redirectionUrl: data.redirectionUrl,
            purpose: data.userDetails.purpose,
          },
        });

        // navigate(data?.redirectionUrl);
        return data;
      } catch (error) {
        navigate("/");
        return error;
      }
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId]);

  return (
    <>
      <ReusableNavbar
        onLogin={() => navigate("/auth/login")}
        onSignup={() => navigate("/auth/sign-up")}
        dashboardType="affiliate"
        menuItems={menuItems}
      />
      <div className="w-full flex gap-4 bg-bgPrimary overflow-y-auto my-32">
        <Sidebar sidebarType="affiliate" sideBarName="Dashboard" />
        <Outlet />
      </div>
      <Footer />
      <ScrollRestoration />
    </>
  );
};

export default AffiliateDashboardLayout;
