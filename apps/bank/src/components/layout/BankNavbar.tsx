import { useEffect, useRef, useState } from "react";
import { CircleUser } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
} from "@nextui-org/react";
import clsx from "clsx";
import { TUserDataReponseData } from "@srk/shared/types";
import { useQuery } from "@tanstack/react-query";
import { useAlert, useAuthStore, useIsMobileView } from "@srk/shared/hooks";
import { getUserDetailsApi } from "@srk/shared/api";



interface NavbarProps {
}

export function BankNavbar({
}: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const { userDetails } = useAuthStore();
    const isMobileView = useIsMobileView();
    const toogleMenuRef = useRef<HTMLButtonElement>(null);
    return (
        <Navbar
            onMenuOpenChange={setIsMenuOpen}
            className={clsx(
                "w-full bg-transparent py-2 text-textPrimary fixed h-32 bg-black top-0 z-50 border-b border-primary",
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
                                    src="/logo/transparentLogo.png"
                                    loading="lazy"
                                    role="presentation"
                                    fetchPriority="high"
                                    width={100}
                                />
                            </picture>
                        </div>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            {/* Desktop Menu */}

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
                            <LoginUserMenu />
                        </>
                    ) : null}
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
            if (res && res.authDetails.redirectionUrl) {
                setRedirectionUrl(res.authDetails.redirectionUrl);
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
        // AuthLocalStorage.removeUserData("user");
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
                    <Avatar src={userDetails?.profilePicture || ""} isBordered />
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

    // <div className="border-b border-[#b68938]/20 bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center gap-4">
    //           <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-[#b68938]/20" 
    //                style={{background: 'linear-gradient(135deg, #e1ba73, #b68938)'}}>
    //             <Wallet className="w-6 h-6 text-black" />
    //           </div>
    //           <div>
    //             <h1 className="text-xl font-bold" style={{color: '#b68938'}}>SRK Bank</h1>
    //             <p className="text-sm text-gray-400">Personal Banking</p>
    //           </div>
    //         </div>
            
    //         <div className="flex items-center gap-3">
    //           <button className="p-2 hover:bg-[#b68938]/10 rounded-xl transition-colors relative">
    //             <Bell className="w-5 h-5" style={{color: '#b68938'}} />
    //             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    //           </button>
    //           <button className="p-2 hover:bg-[#b68938]/10 rounded-xl transition-colors">
    //             <Settings className="w-5 h-5" style={{color: '#b68938'}} />
    //           </button>
    //           <div className="flex items-center gap-3 pl-3 border-l" style={{borderColor: '#b68938/20'}}>
    //             <img
    //               src={userDetails.profilePicture}
    //               alt="Profile"
    //               className="w-10 h-10 rounded-full ring-2"
    //               style={{borderColor: '#b68938'}}
    //             />
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>