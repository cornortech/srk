"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Copy } from "lucide-react";
import { useState } from "react";
import { Snippet } from "@nextui-org/react";
import { DescriptionBanner } from "../../DescriptionBanner";
import useAuthStore from "../../../store/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getAllPackagesApi } from "../../../lib/apiClient";
import { TPackage } from "../../../lib/types/entities";

export default function ReferralPage() {
  const { userDetails } = useAuthStore();

  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const referralCode = userDetails?.referralCode || "";

  const { data: packages } = useQuery<TPackage[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      const data = await getAllPackagesApi();
      return data;
    },
  });

  const getReferralUrl = () => {
    return selectedPackage
      ? `${
          import.meta.env.VITE_FRONTEND_ROOT_URL
        }/auth/sign-up?packageId=${selectedPackage}&referralCode=${referralCode}`
      : "";
  };

  console.log("pakcages", packages);

  return (
    <div className="min-h-screen bg-bgPrimary w-full px-4">
      <DescriptionBanner pageDescription="Referral Details" />

      {/* Main Content */}
      <div className="mx-auto w-full  py-8">
        <Card className="bg-bgSecondary p-8 text-white">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-2xl font-semibold">Your Partner Link</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* Referral Code Section */}
            <div className="space-y-2">
              <p className="text-sm font-medium">My Referral Code:</p>
              <div className="flex gap-4">
                <Snippet
                  symbol=""
                  variant="bordered"
                  className="w-full text-white"
                >
                  {referralCode}
                </Snippet>
                <Button
                  color="warning"
                  className="min-w-[120px]"
                  onPress={() => navigator.clipboard.writeText(referralCode)}
                >
                  Promocode
                </Button>
              </div>
            </div>

            {/* Generate Link Section */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Generate Link For:</p>
              <div className="flex gap-4">
                {packages && (
                  <Select
                    placeholder="Please select a package"
                    selectedKeys={selectedPackage ? [selectedPackage] : []}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="max-w-xs"
                  >
                    {packages.map((pkg) => (
                      <SelectItem key={pkg._id} value={pkg._id}>
                        {pkg.title}
                      </SelectItem>
                    ))}
                  </Select>
                )}
                <Snippet
                  symbol=""
                  variant="bordered"
                  className="w-full text-white"
                >
                  {`${getReferralUrl()}`}
                </Snippet>
                <Button
                  color="warning"
                  isDisabled={!selectedPackage}
                  className="min-w-[120px] text-default-100"
                  startContent={<Copy size={16} />}
                  onPress={() =>
                    navigator.clipboard.writeText(getReferralUrl())
                  }
                >
                  Copy URL
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
