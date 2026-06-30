import { useEffect, useRef, useState } from "react";
import { CircleUser } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
  NavbarMenuItem,
} from "@nextui-org/react";
import clsx from "clsx";
import useAuthStore from "../store/useAuth";
import useAlert from "../hooks/useAlert";
import AuthLocalStorage from "../lib/localstorage/auth";
import { Sidebar } from "./SideBar";
import { useIsMobile } from "../hooks/useIsMobileView";
import { useQuery } from "@tanstack/react-query";
import { getUserDetailsApi } from "../lib/apiClient";
import { getUniversityAssetUrl } from "../lib/cdn";
import { TUserDataReponseData } from "../lib/types";

interface NavbarProps {
  menuItems: { label: string; href: string }[];
  onLogin: () => void;
  onSignup: () => void;
  className?: string;
  hideSidebar?: boolean;
  dashboardType: "study" | "affiliate" | "admin" | "visitor";
  showNavigationLinks?: boolean;
}

export function ReusableNavbar({
  menuItems,
  onSignup,
  dashboardType,
  className,
  showNavigationLinks = true,
}: NavbarProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const { userDetails } = useAuthStore();
  const isMobileView = useIsMobile();
  const toogleMenuRef = useRef<HTMLButtonElement>(null);

  const handleCloseMenu = () => {
    toogleMenuRef.current?.focus();
    toogleMenuRef.current?.click();
    toogleMenuRef.current?.click();
    setIsMenuOpen(false);
  };


  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className={clsx(
        "w-full bg-transparent py-2 text-textPrimary fixed h-32 bg-black top-0 z-50 border-b border-primary",
        className
      )}
      maxWidth="xl"
      height={130}
    >
      {/* Brand Section */}
      <NavbarContent>
        <NavbarBrand>
          <Link to="/">
            <div className="flex gap-2 items-center">
              <picture>
                <img
                  alt="SRK University"
                  src="/logo/transparentLogo.png"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  width={100}
                  height={60}
                />
              </picture>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Menu */}
      {showNavigationLinks && !isMobileView && (
        <NavbarContent className="hidden md:flex gap-6" justify="center">
          {menuItems.map((item, index) => (
            <NavbarItem
              key={index}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link
                to={item.href}
                className="relative text-textPrimary font-semibold"
              >
                {item.label}
                {location.pathname === item.href && (
                  <span className="absolute left-0 bottom-[-5px]  border border-yellow-500 w-full duration-150"></span>
                )}
                {hovered === index && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 bottom-[-5px] h-[2px] bg-yellow-500 duration-150"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    exit={{ width: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      )}

      {/* Right-Side Menu (User or Login) */}
      <NavbarContent justify="end">
        {userDetails ? (
          <LoginUserMenu />
        ) : (
          <Link
            to="/auth/login"
            className="hidden sm:flex text-primary gap-2 font-bold"
            color="warning"
          >
            <CircleUser />
            Login
          </Link>
        )}
        <NavbarMenuToggle
          // ignore this error
          // @ts-expect-error no ref here
          ref={toogleMenuRef}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
          onPress={() => setIsMenuOpen(!isMenuOpen)}
        />
      </NavbarContent>

      {/* Mobile View: Sidebar or Menu */}
      {isMobileView && (
        <NavbarMenu className="bg-bgPrimary">
          {userDetails ? (
            <>
              <Sidebar
                handleCloseMenu={handleCloseMenu}
                showInMobileView={true}
                sideBarName=""
                sidebarType={dashboardType}
              />
              <LoginUserMenu />
            </>
          ) : (
            <>
              {menuItems.map((item, index) => (
                <NavbarMenuItem key={index}>
                  <Link
                    to={item.href}
                    className="relative text-textPrimary font-semibold"
                  >
                    {item.label}
                    {location.pathname === item.href && (
                      <motion.div
                        layoutId="underline"
                        className="absolute left-0 bottom-0 h-[2px] bg-yellow-500"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </NavbarMenuItem>
              ))}

              <NavbarMenuItem>
                <Link
                  to="/auth/login"
                  className="w-full text-primary font-bold"
                >
                  Login
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <div
                  onClick={onSignup}
                  className="flex sm:hidden text-primary gap-2 font-bold"
                  color="warning"
                >
                  <CircleUser />
                  Sign Up
                </div>
              </NavbarMenuItem>
            </>
          )}
        </NavbarMenu>
      )}
    </Navbar>
  );
}

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
