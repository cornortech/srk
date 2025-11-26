import { Outlet } from "react-router-dom";
import { BankNavbar } from "./BankNavbar";

// this is the bank dashboard layout
const BankDashboardLayout = () => {
    return (
        <>
            <BankNavbar />
            <Outlet />
        </>
    );
};

export default BankDashboardLayout;
