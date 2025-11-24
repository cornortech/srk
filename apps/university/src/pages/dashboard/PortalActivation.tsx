import { Tab, Tabs } from "@nextui-org/react";
import WebcamCapture from "../../components/affiliate/PortalActivation/FaceCapture";
import KYCForm from "../../components/dashboard/bank && kyc/KycForm";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TUserDataReponseData } from "../../lib/types";
import useAuthStore from "../../store/useAuth";
import { getUserDetailsApi } from "../../lib/apiClient";
import { LogoNavbar } from "../../components/logoNavbar";
import { methods } from "../../lib/methods";
import AlertBanner from "../../components/AlertBanner";

const PortalActivationPage = () => {
  const [selectedTab, setSelectedTab] = useState("details");
  const { userDetails } = useAuthStore();
  const [verificationImage, setVerficationImage] = useState<string | null>(
    null
  );

  const handleTabChange = (key: React.Key) => {
    setSelectedTab(key.toString());
  };

  const { data: userData, refetch } = useQuery<TUserDataReponseData | null>({
    queryKey: ["user", userDetails?._id],
    queryFn: async () => {
      if (!userDetails?._id) return null;
      const resData = await getUserDetailsApi(userDetails._id);
      return resData;
    },
  });

  const userStatus = userData?.userDetails?.status;
  const showKycAlertBanner =
    userDetails?.status === "KYC_VERIFICATION_PENDING" ||
    userDetails?.status === "KYC_VERIFICATION_REJECTED";

  return (
    <>
      <div className="relative w-full  bg-cover bg-no-repeat bg-center ">
        <div>
          <LogoNavbar />
        </div>
        <div>
          {showKycAlertBanner && userStatus ? (
            <AlertBanner
              type={
                userStatus === "KYC_VERIFICATION_PENDING" ? "warning" : "danger"
              }
              message={` ${userStatus === "KYC_VERIFICATION_PENDING"
                ? "Kyc verification is pending . Admin will verify your kyc soon"
                : `Kyc verification is rejected . Reason : ${userData?.kycDetails?.rejectionReason}`
                } `}
            />
          ) : (
            ""
          )}
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={handleTabChange}
            className="outline-none"
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
                isInitialVideoOpen={!userData?.kycDetails?.verificationImage}
                disableActions={userData?.kycDetails?.status === "pending"}
                previousVerificationImage={
                  userData?.kycDetails?.verificationImage || null
                }
                verificationImage={verificationImage}
                setVerificationImage={setVerficationImage}
                handleTabChange={() => {
                  handleTabChange("Kyc_Details");
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
              </div>
            </Tab>
            <Tab key="Kyc_Details" title="KYC Details" className="">
              <KYCForm
                handleRefetch={() => refetch()}
                kycDetails={userData?.kycDetails || null}
                newVerificationImageFile={
                  verificationImage
                    ? methods.base64ToFile(
                      verificationImage || "",
                      // remove spaces and special characters
                      `${userData?.userDetails?.firstName
                        .replace(/\s+/g, "-")
                        .replace(/[^a-zA-Z0-9-_]/g, "")}-kyc-verification-image.png`,
                      "image/png"
                    )
                    : undefined
                }
              />
            </Tab>
          </Tabs>
        </div>
        {/* <div className="absolute w-full  h-20 bg-bgPrimary bottom-0"></div> */}
      </div>
    </>
  );
};

export default PortalActivationPage;
