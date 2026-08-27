import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../store/useAuth";
import useAlert from "../hooks/useAlert";
import AuthLocalStorage from "../lib/localstorage/auth";
import { getUserDetailsApi } from "../lib/apiClient";
import { getUniversityAssetUrl } from "../lib/cdn";
import { TUserDataReponseData } from "../lib/types";

// Only rendered for logged-in users — lazy-loaded from Navbar so its NextUI
// Dropdown/Avatar code (and the react-aria overlay/focus-management machinery
// that comes with it) isn't parsed/executed for every anonymous visitor.
const LoginUserMenu = () => {
  const { userDetails, clearAuthDetails } = useAuthStore();
  const { show } = useAlert();
  const navigate = useNavigate();
  const [redirectionUrl, setRedirectionUrl] = useState("");

  const { refetch: refetchUser } = useQuery<
    TUserDataReponseData | undefined | null
  >({
    queryKey: ["user", userDetails?._id],
    queryFn: async () => {
      if (!userDetails?._id) return;
      const res = await getUserDetailsApi(userDetails?._id);
      if (res && res.redirectionUrl) {
        setRedirectionUrl(res.redirectionUrl);
        return res;
      }
      return res;
    },
    enabled: false,
  });

  useEffect(() => {
    if (redirectionUrl) {
      navigate(redirectionUrl);
    }
  }, [redirectionUrl]);

  if (!userDetails) return null;

  const handleLogout = () => {
    AuthLocalStorage.removeUserData("user");
    clearAuthDetails();
    show("Logout successful", "success");
    navigate("/");
  };

  const handleRedirectToDashboard = () => {
    refetchUser();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <NavbarItem className="hidden md:flex gap-x-4 items-center cursor-pointer">
          <Avatar src={getUniversityAssetUrl(userDetails?.profilePicture) || ""} isBordered />
          <div>
            <h1 className="font-bold">
              {userDetails?.firstName} {userDetails?.lastName}
            </h1>
            <p className="text-sm">{userDetails?.packageId?.title}</p>
          </div>
        </NavbarItem>
      </DropdownTrigger>
      <DropdownMenu aria-label="User Menu">
        <DropdownItem
          key="logout"
          className="text-white"
          color="default"
          onPress={handleRedirectToDashboard}
        >
          Dashboard
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          onPress={handleLogout}
        >
          LOGOUT
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default LoginUserMenu;
