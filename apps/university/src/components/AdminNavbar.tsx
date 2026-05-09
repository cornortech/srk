import { useState } from "react";
import { CircleUser, LogOutIcon } from "lucide-react";
import { motion } from "framer-motion"; // Import framer-motion
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import clsx from "clsx";
import { AdminSidebarItems } from "../Data/dashboardSidebar";
import { useLocation } from "react-router-dom";
import { getUniversityAssetUrl } from "../lib/cdn";

const user = {
  name: "John Doe",
  email: "john@example.com",
  image: "/instructor.jpg",
};

export const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(true); // For demonstration
  const location = useLocation();

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className={clsx(
        "w-full bg-bgPrimary py-2 md:hidden text-textPrimary relative"
      )}
      maxWidth="xl"
      height={130}
    >
      {/* Brand Section */}
      <NavbarContent>
        <NavbarBrand>
          <Link href="/">
            <div className="flex gap-2  items-center">
              <h1 className="text-textPrimary font-bold text-xl">
                Admin Pannel
              </h1>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Menu Toggle on the Right */}
      <NavbarContent justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
          onPress={() => setIsMenuOpen(!isMenuOpen)}
        />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-bgPrimary">
        {AdminSidebarItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              href={item.href}
              className="relative text-textPrimary font-semibold"
              size="lg"
            >
              {item.title}
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
        {isSignedIn ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar as="button" name={user.name} size="lg" src={getUniversityAssetUrl(user.image)} />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<LogOutIcon className="w-4 h-4" />}
                onPress={() => setIsSignedIn(false)}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarMenuItem>
            <Link
              onPress={() => {}}
              className="flex sm:hidden text-primary gap-2 font-bold"
              color="warning"
            >
              <CircleUser />
              Sign Up
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
};
