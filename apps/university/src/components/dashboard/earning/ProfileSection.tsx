"use client";

import { Avatar } from "@nextui-org/avatar";
import { User, MapPin, CreditCard, ArrowUpRight } from "lucide-react";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import useAuthStore from "../../../store/useAuth";
import { Button } from "@nextui-org/react";
import { TUserDataReponseData } from "../../../lib/types";
import { getUserDetailsApi } from "../../../lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BalanceWithDrawModal } from "../../affiliate/Payout/WithdrawModal";
import { getUniversityAssetUrl } from "../../../lib/cdn";

export default function ProfileSection({
  walletBalance,
}: {
  walletBalance: number;
}) {
  const { userDetails } = useAuthStore();
  const [withDrawModalOpen, setWithDrawModalOpen] = useState(false);
  const { data: userData } = useQuery<TUserDataReponseData | null>({
    queryKey: ["user", userDetails?._id],
    queryFn: async () => {
      if (!userDetails?._id) return null;
      const resData = await getUserDetailsApi(userDetails._id);
      return resData;
    },
  });
  const handleCloseModal = () => {
    setWithDrawModalOpen(false);
    // setSelectedPayout(null);
  };
  if (!userDetails) {
    return <></>;
  }

  return (
    <div className="flex flex-col items-center  text-center">
      <Avatar
        src={getUniversityAssetUrl(userDetails.profilePicture)}
        className="w-24 h-24 text-large"
        fallback={<User size={24} />}
      />
      <h2 className="mt-4 text-xl text-white font-semibold">
        {userDetails.firstName} {userDetails.lastName}
      </h2>
      {/* <p className="text-small text-white">{userDetails.email}</p> */}
      <Chip color="success" variant="flat" className="mt-2">
        {userDetails.isActive ? "Active" : "Inactive"}
      </Chip>
      <Divider className="my-4" />
      <div className="w-full space-y-3 text-left">
        <p className="flex items-center text-white gap-2">
          <MapPin size={18} /> <span className="">Country:</span>{" "}
          {userDetails.country}
        </p>
        <p className="flex items-center text-white gap-2">
          <CreditCard size={18} />{" "}
          <span className="text-white">Subscription:</span>{" "}
          <Chip color="success" variant="flat" size="sm">
            {userDetails.packageId?.title}
          </Chip>
        </p>
        {userData?.bankDetails?.status==="approved" && (
          <div className="flex justify-between items-center mb-6">
            <Button
              color="primary"
              endContent={<ArrowUpRight size={20} />}
              onPress={() => setWithDrawModalOpen(true)}
            >
              Transfer Credits
            </Button>
          </div>
        )}
        {/* <p className="flex items-center text-white gap-2">
          <Users size={18} />{" "}
          <span className="text-white">Mentoring:</span> {user.mentoring}
        </p> */}
        {/* <p className="flex items-center text-white gap-2">
          <PhoneIcon size={18} />{" "}
          <span className="text-white">Phone Number:</span>{" "}
          {userDetails.phoneNumber}
        </p> */}
        {/* <p className="flex items-center text-white gap-2">
          <UserCircle size={18} />{" "}
          <span className="text-white">Gender:</span> {userDetails.gender}
        </p> */}
        {/* <p className="flex items-center text-white gap-2">
          <UserCircle size={18} />{" "}
          <span className="text-white">Dob:</span>{" "}
          {userDetails.dob.split("T")[0]}
        </p> */}
        {
          <BalanceWithDrawModal
            balance={walletBalance}
            isOpen={withDrawModalOpen}
            onClose={handleCloseModal}
          />
        }
      </div>
    </div>
  );
}
