import { AuthLayout } from "./AuthLayout";
import { SignupComponent } from "../components/SignUpComponent";
import { useQuery } from "@tanstack/react-query";
import { TPackage } from "../lib/types/entities";
import { useLocation, Location } from "react-router-dom";
import { getPackageDetailsApi } from "../lib/apiClient";
import { SignupContent } from "../components/signup/SignupContent";

// eslint-disable-next-line react-refresh/only-export-components
export const getQueryParam = (location: Location, param: string) => {
  const urlParams = new URLSearchParams(location.search);
  return urlParams.get(param) || undefined;
};
export const SignUp = () => {
  const location = useLocation();
  const packageId = getQueryParam(location, "packageId");
  const referralCode = getQueryParam(location, "referralCode");

  const { data: packageDetails } = useQuery<TPackage | null>({
    queryKey: ["packageById", packageId],
    queryFn: async () => {
      if (!packageId) return null;
      const data = await getPackageDetailsApi(packageId);
      return data;
    },
  });

  if (!packageDetails) return;

  return (
    <AuthLayout
      leftChildren={<SignupContent packageDetails={packageDetails} />}
      rightChildren={
        <SignupComponent
          packageDetails={packageDetails}
          referralCode={referralCode}
        />
      }
    />
  );
};
