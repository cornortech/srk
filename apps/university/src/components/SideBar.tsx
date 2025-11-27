import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  LogOutIcon,
  Menu,
  AlignLeftIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import { useState } from "react";
import {
  AdminSidebarItems,
  getAffiliateSidebarItems,
  getStudySidebarItems,
  visitorSidebarItems,
} from "../Data/dashboardSidebar";
import useAuthStore from "../store/useAuth";
import AuthLocalStorage from "../lib/localstorage/auth";
import useAlert from "../hooks/useAlert";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { updateUserDetailsApi } from "../lib/apiClient";

interface Tsidebar {
  sideBarName: string;
  sidebarType: "study" | "affiliate" | "admin" | "visitor";
  showInMobileView?: boolean;
  handleCloseMenu?: () => void;
}

export const Sidebar = ({
  handleCloseMenu,
  sidebarType,
  sideBarName,
  showInMobileView,
}: Tsidebar) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { userDetails, clearAuthDetails, toggleRefresh } = useAuthStore();
  const { show } = useAlert();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const { mutate: updateUserPermission } = useMutation({
    mutationFn: async () => {
      if (!userDetails?._id) return;
      const res = await updateUserDetailsApi({
        data: {
          purpose: "affiliate",
        },
        userId: userDetails?._id,
      });
      return res;
    },
    onSuccess: () => {
      show("User details updated successfully", "success");
      toggleRefresh();
    },
    onError: () => {
      show("Failed to update user details", "error");
    },
  });
  const sidebarFuncMap = {
    affiliate: getAffiliateSidebarItems(!!userDetails?.allowedToAddUsers),
    study: getStudySidebarItems(
      !!userDetails?.affiliateEnabled,
      userDetails?.purpose
    ),
    admin: AdminSidebarItems,
    visitor: visitorSidebarItems,
  };

  const handleLogout = () => {
    AuthLocalStorage.removeUserData("user");
    clearAuthDetails();
    show("Logout successful", "success");
    navigate("/");
    if (handleCloseMenu) {
      handleCloseMenu();
    }
  };
  const handleRedirect = () => {
    if (userDetails?.redirectionUrl) {
      navigate(userDetails?.redirectionUrl);
    }
  };

  const handleItemClick = (href: string) => {
    // Close the menu only if the user clicks a sidebar item
    if (handleCloseMenu) {
      handleCloseMenu();
    }
    // Navigate to the link
    navigate(href);
    // window.location.href = href;
  };

  const handleSwitchToAffiliate = () => {
    updateUserPermission();
  };

  return (
    <div
      className="relative min-h-screen hidden md:flex"
      style={{
        display: showInMobileView ? "flex" : "",
      }}
    >
      <div
        className={clsx(
          "h-full bg-bgSecondary shadow-md transition-all duration-500 ease-in-out",
          showInMobileView ? "w-full" : isOpen ? "w-64" : "w-20"
        )}
      >
        <ul className="space-y-2 p-4 mt-8 overflow-y-auto h-[93vh]">
          {sidebarFuncMap[sidebarType]?.map((item, index) => {
            if (item.href === "switchToAffiliate") {
              return (
                <li key={index}>
                  <Button
                    onPress={handleSwitchToAffiliate}
                    className={clsx(
                      "flex cursor-pointer items-center space-x-3 w-full justify-start text-textPrimary bg-bgSecondary p-2 rounded-md transition-all duration-300 ease-in-out",
                      item.href === location.pathname && "bg-primary"
                    )}
                  >
                    <item.icon className="w-5 h-5 text-current" />
                    {isOpen && (
                      <span className="font-medium capitalize">
                        {item.title}
                      </span>
                    )}
                  </Button>
                </li>
              );
            }
            return (
              <li key={index}>
                <Button
                  onPress={() => handleItemClick(item.href)}
                  className={clsx(
                    "flex cursor-pointer items-center space-x-3 w-full justify-start text-textPrimary bg-bgSecondary p-2 rounded-md transition-all duration-300 ease-in-out",
                    item.href === location.pathname && "bg-primary"
                  )}
                >
                  <item.icon className="w-5 h-5 text-current" />
                  {isOpen && (
                    <span className="font-medium capitalize">{item.title}</span>
                  )}
                </Button>
              </li>
            );
          })}
          {showInMobileView && sidebarType === "visitor" && (
            <div
              className="flex cursor-pointer items-center gap-x-3 w-full justify-start text-textPrimary bg-bgSecondary p-2 rounded-md transition-all duration-300 ease-in-out"
              color="primary"
              onClick={handleRedirect}
            >
              <LayoutDashboardIcon />
              Dashboard
            </div>
          )}

          <div
            className="flex cursor-pointer items-center gap-x-3 w-full justify-start text-textPrimary bg-bgSecondary p-2 rounded-md transition-all duration-300 ease-in-out"
            color="primary"
            onClick={handleLogout}
          >
            <LogOutIcon />
            Logout
          </div>
        </ul>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute top-1 left-4 bg-transparent p-2 shadow focus:outline-none transition-all duration-300 ease-in-out"
      >
        {isOpen ? (
          <div className="flex gap-3 items-center">
            <AlignLeftIcon className="w-5 h-5 text-textPrimary" />{" "}
            <span className="font-bold text-lg">{sideBarName}</span>
          </div>
        ) : (
          <Menu className="w-5 h-5 text-textPrimary" />
        )}
      </button>
    </div>
  );
};
