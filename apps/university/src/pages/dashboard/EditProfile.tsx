"use client";

import React, { useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { ProfileDetails } from "../../components/dashboard/editProfile/ProfileDetails";
import { UpdatePassword } from "../../components/dashboard/editProfile/UpdatePassword";
import { UpdateProfilePicture } from "../../components/dashboard/editProfile/UpdateProfilePicture";
import { useQuery } from "@tanstack/react-query";
import { getUserDetailsApi } from "../../lib/apiClient";
import useAuthStore from "../../store/useAuth";
import { TUserDataReponseData } from "../../lib/types";

export default function EditProfileTabs() {
  const [selectedTab, setSelectedTab] = useState("details");
  const { userDetails } = useAuthStore();

  const handleTabChange = (key: React.Key) => {
    setSelectedTab(key.toString());
  };

  const { data: userData } = useQuery<TUserDataReponseData | null>({
    queryKey: ["user", userDetails?._id],
    queryFn: async () => {
      if (!userDetails?._id) return null;
      const resData = await getUserDetailsApi(userDetails._id);
      return resData;
    },
  });

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
        <Tab key="details" title="Details">
          <ProfileDetails userDetails={userData.userDetails} />
        </Tab>
        <Tab key="picture" title="Picture">
          <UpdateProfilePicture userData={userData.userDetails} />
        </Tab>
        <Tab key="password" title="Password">
          <UpdatePassword />
        </Tab>
        {/* <Tab key="status" title="Account Status">
          <AccountStatus  userDetails={userData.userDetails}/>
        </Tab> */}
      </Tabs>
    </div>
  );
}
