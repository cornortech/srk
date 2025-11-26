import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "@srk/shared/hooks";
import { getFirebaseAuth, authMeApi } from "@srk/shared/api";

export function AuthenticateLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { setAuthDetails } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getFirebaseAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                // if user is coming from /onboarding/* routes, stay there
                if (window.location.pathname.startsWith("/onboarding")) {
                    setLoading(false);
                    return;
                }
                return;
            }

            try {
                const data = await authMeApi();

                if (data) {
                    setAuthDetails({
                        authDetails: {
                            role: data.authDetails.role,
                            email: data.authDetails.email,
                            redirectionUrl: data.authDetails.redirectionUrl,
                        },
                        userDetails: data.userDetails ? {
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
                        } : null,
                        srkBank: data.srkBank ? {
                            amount: data.srkBank.amount,
                            _id: data.srkBank._id,
                            accountNumber: data.srkBank.accountNumber,
                            status: data.srkBank.status,
                        } : null,
                    });
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Authentication error:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate, setAuthDetails]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bgPrimary">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-textPrimary text-lg">Authenticating...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
