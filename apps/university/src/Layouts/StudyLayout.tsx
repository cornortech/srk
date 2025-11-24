import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/SideBar";
import { Footer } from "../components/Footer";
import { useEffect } from "react";
import useAuthStore from "../store/useAuth";
import AuthLocalStorage from "../lib/localstorage/auth";
import { useQuery } from "@tanstack/react-query";
import { getUserDetailsApi } from "../lib/apiClient";
import { ReusableNavbar } from "../components/Navbar";
import { menuItems } from "../Data/NavbarData";

const StudyDashboardLayout = () => {
  const userId = AuthLocalStorage.getUserData("user")?._id;
  const { setAuthDetails, refresh } = useAuthStore();
  const navigate = useNavigate();

  useQuery({
    queryKey: ["user", userId, refresh],
    queryFn: async () => {
      try {
        if (!userId) return;
        const data = await getUserDetailsApi(userId);
        if (!data || !data.userDetails) {
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
            affiliateEnabled: data.userDetails.affiliateEnabled,
            status: data.userDetails.status,
            redirectionUrl: data.redirectionUrl,
            allowedToAddUsers: data.userDetails.allowedToAddUsers,
            purpose: data.userDetails.purpose,
          },
        });

        navigate(data?.redirectionUrl);
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
        onSignup={() => navigate("/auth/sign-up")}
        dashboardType="study"
        menuItems={menuItems}
        showNavigationLinks={false}
        onLogin={() => navigate("/auth/login")}
      />
      <div className="w-full flex gap-4 bg-bgPrimary overflow-y-auto my-32">
        <Sidebar sidebarType="study" sideBarName="" />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default StudyDashboardLayout;
