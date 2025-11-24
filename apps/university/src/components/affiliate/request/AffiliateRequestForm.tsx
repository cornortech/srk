import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { classNameInput } from "../../dashboard/bank && kyc/PancardForm";
import useAuthStore from "../../../store/useAuth";
import useAlert from "../../../hooks/useAlert";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUserDetailsApi,
  requestAffiliateProgramApi,
} from "../../../lib/apiClient";
import { AxiosError } from "axios";
import { TUserDataReponseData } from "../../../lib/types";
import AlertBanner from "../../AlertBanner";
import { StepBackIcon } from "lucide-react";

export default function AffiliateRequestform() {
  const { userDetails } = useAuthStore();
  const { show } = useAlert();

  const { data: userData, refetch: refetchUserData } =
    useQuery<TUserDataReponseData | null>({
      queryKey: ["userDetails"],
      queryFn: async () => {
        if (!userDetails?._id) return null;
        const res = await getUserDetailsApi(userDetails?._id);
        return res;
      },
      enabled: !!userDetails?._id,
    });
  
  const { isPending, mutate } = useMutation({
    mutationFn: async (userId: string) => {
      await requestAffiliateProgramApi(userId);
    },
    onSuccess: () => {
      show("Affiliate Program requested successfully", "success");
      refetchUserData();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      show(error.response?.data?.message || "Failed to request", "error");
    },
  });

  const handleRequestForAffiliateProgram = () => {
    const userId = userDetails?._id;
    if (!userId) return;
    mutate(userId);
  };

  const kycStatus = userData?.affiliateRequestDetails?.status;

  const showKycAlertBanner =
    kycStatus === "pending" || kycStatus === "rejected";

  const affiliateRequestReason =
    userData?.affiliateRequestDetails?.rejectionReason || "";

  return (
    <div className="space-y-6  w-full">
      {showKycAlertBanner && kycStatus ? (
        <AlertBanner
          type={kycStatus === "pending" ? "warning" : "danger"}
          message={` ${
            kycStatus === "pending"
              ? "Affiliate request is pending . Admin will verify details soon."
              : `Affiliate request is rejected . Reason : ${affiliateRequestReason}`
          } `}
        />
      ) : (
        ""
      )}
      <Button
        color="primary"
        className="mb-4"
        onPress={() => window.history.back()}
      >
        <StepBackIcon /> Go to view Biometric Details
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            disabled
            classNames={classNameInput}
            label="First Name"
            placeholder="First Name"
            value={userDetails?.firstName}
          />
        </div>

        <div>
          <Input
            disabled
            classNames={classNameInput}
            label="Last Name"
            placeholder="Last Name"
            value={userDetails?.lastName}
          />
        </div>

        <div>
          <Input
            disabled
            classNames={classNameInput}
            label="Email"
            placeholder="Email"
            value={userDetails?.email}
          />
        </div>

        <div>
          <Input
            disabled
            classNames={classNameInput}
            label="Country"
            placeholder="Country"
            value={userDetails?.country}
          />
        </div>

        <div>
          <Input
            disabled
            type="date"
            label="Date Of Birth"
            placeholder="Date Of Birth"
            classNames={classNameInput}
            value={userDetails?.dob?.split("T")[0]}
          />
        </div>

        <div>
          <Input
            disabled
            label="Contact Number"
            placeholder="Contact Number"
            classNames={classNameInput}
            value={userDetails?.phoneNumber}
          />
        </div>

        <div>
          <Input
            disabled
            label="Gender"
            placeholder="Gender"
            classNames={classNameInput}
            value={userDetails?.gender}
          />
        </div>
      </div>

      {kycStatus !== "pending" && (
        <div className="flex justify-start">
          <Button
            type="submit"
            color="primary"
            className=" max-w-md "
            size="lg"
            onPress={handleRequestForAffiliateProgram}
          >
            {isPending
              ? "Requesting..."
              : "Confirm Details and Request for Affiliate Program"}
          </Button>
        </div>
      )}
    </div>
  );
}
