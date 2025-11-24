import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminNavbar } from "../components/AdminNavbar";
import { Sidebar } from "../components/SideBar";
import AuthLocalStorage from "../lib/localstorage/auth";

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = AuthLocalStorage.getUserData("user");

    if (!userDetails || userDetails.role !== "admin") {
      navigate("/auth/login", { replace: true }); // Avoids history stacking
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Show loading screen while authentication is being checked
  if (isAuthenticated === null) {
    return <div></div>; // Placeholder loader component
  }

  return (
    <>
      <AdminNavbar />
      <div className="w-full h-screen flex gap-4 bg-bgPrimary">
        <Sidebar sidebarType="admin" sideBarName="Admin Panel" />
        <main className="flex-1 p-4 max-h-screen overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
