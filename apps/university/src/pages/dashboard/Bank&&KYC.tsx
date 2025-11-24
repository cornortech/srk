import { Tab, Tabs } from "@nextui-org/react";
import React, { useState } from "react";
import KYCForm from "../../components/dashboard/bank && kyc/KycForm";
import PanCardForm from "../../components/dashboard/bank && kyc/PancardForm";
import BankDetailsForm from "../../components/dashboard/bank && kyc/BankDetails";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../store/useAuth";
import { getUserDetailsApi } from "../../lib/apiClient";

export const BankAndKYC = () => {
  const [selectedTab, setSelectedTab] = useState("details");
  const { userDetails } = useAuthStore();

  const { data: userData, refetch } = useQuery({
    queryKey: ["bankDetails", userDetails?._id],
    queryFn: () => {
      const userId = userDetails?._id;
      if (!userId) return;
      return getUserDetailsApi(userId);
    },
    enabled: !!userDetails?._id,
  });
  const handleTabChange = (key: React.Key) => {
    setSelectedTab(key.toString());
  };

  const handleRefetch = () => {
    refetch();
  };
  if (!userData) return <div></div>;

  return (
    <div className="w-full  mx-auto  p-4 rounded-lg">
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={handleTabChange}
        className="outline-none bg-bgSecondary"
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
        <Tab key="KYC" title="KYC Details">
          <KYCForm
            kycDetails={userData.kycDetails}
            handleRefetch={handleRefetch}
          />
        </Tab>
        <Tab key="Bank" title="Bank Details">
          <BankDetailsForm
            bankDetails={userData.bankDetails || undefined}
            handleRefetch={handleRefetch}
          />
        </Tab>
        <Tab key="panCard" title="Pan Card">
          <PanCardForm />
        </Tab>
      </Tabs>
    </div>
  );
};
