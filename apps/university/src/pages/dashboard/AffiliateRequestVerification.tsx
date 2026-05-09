import { Button, Tab, Tabs } from "@nextui-org/react";
import WebcamCapture from "../../components/affiliate/PortalActivation/FaceCapture";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUserDetailsApi,
  upsertAffiliateBiometricDataApi,
} from "../../lib/apiClient";
import useAuthStore from "../../store/useAuth";
import useAlert from "../../hooks/useAlert";
import AlertBanner from "../../components/AlertBanner";
import { TUserDataReponseData } from "../../lib/types";
import { methods } from "../../lib/methods";
import { useSRKFileUpload } from '@srk/shared/hooks';

const AffiliateRequestVerification = () => {
  const [selectedTab, setSelectedTab] = useState("details");
  const [verificationImage, setVerficationImage] = useState<string | null>(
    null
  );
  const { show } = useAlert();
  const navigate = useNavigate();
  const { uploadFile } = useSRKFileUpload('university');
  const { userDetails } = useAuthStore();

  const { data: userData } = useQuery<TUserDataReponseData | null>({
    queryKey: ["userDetails"],
    queryFn: async () => {
      if (!userDetails?._id) return null;
      const res = await getUserDetailsApi(userDetails?._id);
      return res;
    },
    enabled: !!userDetails?._id,
  });

  const { mutate: upsertAffiliateBiometricDataMutation } = useMutation({
    mutationFn: async (data: {
      userId: string;
      verificationImage: string;
      leftThumbPrint: string;
      rightThumbPrint: string;
    }) => {
      const res = await upsertAffiliateBiometricDataApi(data.userId, {
        leftThumbPrint: data.leftThumbPrint,
        rightThumbPrint: data.rightThumbPrint,
        verificationImage: data.verificationImage,
      });
      return res;
    },
    onSuccess: () => {
      navigate("/study/request");
      show("Affiliate biometric data updated successfully", "success");
    },
    onError: () => {
      show("Failed to update biometric data", "error");
    },
  });

  const handleTabChange = (key: React.Key) => {
    setSelectedTab(key.toString());
  };

  const handleAffiliateActivationSubmit = async () => {
    const userId = userDetails?._id;
    if (!userId) return;

    let verificationImageUrl =
      userData?.affiliateBiometricDetails?.verificationImage || "";

    if (verificationImage) {
      // remove whitespaces
      const firstName = (userDetails?.firstName || "User").replace(/\s/g, "");
      const { key } = await uploadFile(
        methods.base64ToFile(
          verificationImage,
          `${Date.now()}-${firstName}-v-image.png`,
          "image/png"
        ),
        "image"
      );

      verificationImageUrl = key;
    }

    upsertAffiliateBiometricDataMutation({
      userId: userId,
      verificationImage: verificationImageUrl,
      leftThumbPrint: "-",
      rightThumbPrint: "-",
    });
  };

  const kycStatus = userData?.affiliateRequestDetails?.status;

  const showKycAlertBanner =
    kycStatus === "pending" || kycStatus === "rejected";

  const affiliateRequestReason =
    userData?.affiliateRequestDetails?.rejectionReason || "";

  return (
    <>
      <div className="relative w-full   bg-cover bg-no-repeat bg-center ">
        {showKycAlertBanner && kycStatus ? (
          <AlertBanner
            type={kycStatus === "pending" ? "warning" : "danger"}
            message={` ${kycStatus === "pending"
              ? "Affiliate request is pending . Admin will verify details soon."
              : `Affiliate request is rejected . Reason : ${affiliateRequestReason}`
              } `}
          />
        ) : (
          ""
        )}
        <div>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={handleTabChange}
            className="outline-none  "
            size="lg"
            fullWidth
            classNames={{
              base: "bg-bgSecondary text-white rounded-2xl", // Background and text color for the entire tabs container
              tabList: "bg-bgSecondary text-white", // Style the tab list container
              tab: "text-white  hover:bg-gray-800 ", // Style each tab
              tabContent: "text-white", // Text inside the tab
              cursor: "bg-white", // Active tab underline or cursor
            }}
          >
            <Tab key="details" title="Photo Verification" className="">
              <WebcamCapture
                disableActions={kycStatus === "pending"}
                // if affiliate biometric details doesnot exist show initial video
                isInitialVideoOpen={
                  !userData?.affiliateBiometricDetails?.verificationImage &&
                  !verificationImage
                }
                previousVerificationImage={
                  userData?.affiliateBiometricDetails?.verificationImage || null
                }
                verificationImage={verificationImage}
                setVerificationImage={setVerficationImage}
                handleTabChange={() => {
                  handleTabChange("FingerPrints");
                }}
              />
            </Tab>
            <Tab
              key="FingerPrints"
              title="FingerPrint Verification"
              className=""
            >
              {/* <WebcamCapture verificationImage={verificationImage} setVerificationImage={setVerficationImage}  handleTabChange={handleTabChange}/> */}
              <div>
                <h1 className="text-2xl font-bold text-white mb-4">
                  FingerPrint Verification
                </h1>
                <p className="text-white">
                  <span className="font-bold">Step 1:</span> Place your finger
                  on the sensor
                </p>
                <p className="text-white">
                  <span className="font-bold">Step 2:</span> Wait for the
                  verification to complete
                </p>
                <p className="text-white">
                  <span className="font-bold">Step 3:</span> Click the "Submit"
                  button to complete the verification process
                </p>
              </div>
              <div className="flex  gap-x-2 my-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Left Thumb
                  <div className="w-[130px] h-[150px] bg-white rounded-md">
                    <img />
                  </div>
                </h3>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 ">
                    Right Thumb
                    <div className="w-[130px] h-[150px] bg-white rounded-md">
                      <img />
                    </div>
                  </h3>
                </div>
              </div>
              <Button color="primary" onPress={handleAffiliateActivationSubmit}>
                SUBMIT
              </Button>
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AffiliateRequestVerification;
