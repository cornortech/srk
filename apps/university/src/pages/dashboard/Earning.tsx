import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { EarningsChart } from "../../components/dashboard/earning/EarningCharts";
import ProfileSection from "../../components/dashboard/earning/ProfileSection";
import { Chip } from "@nextui-org/chip";
import { BookMarked, Wallet, CreditCard, Gift, Calendar } from "lucide-react";
import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEarningDetailsofUserApi } from "../../lib/apiClient";
import useAuthStore from "../../store/useAuth";
import { TEarningDetails } from "../../lib/types";

export default function EarningsDashboard() {
  const { userDetails } = useAuthStore();

  const { data: earningsData } = useQuery<TEarningDetails | null>({
    queryKey: ["earnings"],
    queryFn: async () => {
      const userId = userDetails?._id;
      if (!userId) return;
      return getEarningDetailsofUserApi(userId);
    },
    enabled: !!userDetails?._id,
  });

  if (!earningsData) return <div></div>;

  return (
    <div className="container mx-auto px-2 space-y-6">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 ">
        <Card className="lg:col-span-3 bg-bgSecondary">
          <CardBody>
            <ProfileSection walletBalance={earningsData.walletBalance} />
          </CardBody>
        </Card>
        <div className="lg:col-span-9 space-y-1 sm:space-y-3 lg:space-y-3 md:space-y-3">
          <div className="grid gap-1  sm:gap-3 lg:gap-6  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <CreditCard_
              title="Today's Credits"
              amount={earningsData.todayEarnings}
              icon={<BookMarked className="text-green-500" size={24} />}
              chipText="Today"
              chipColor="success"
            />
            <CreditCard_
              title="7-Day Credits"
              amount={earningsData.last7DaysEarnings}
              icon={<Calendar className="text-blue-500" size={24} />}
              chipText="This Week"
              chipColor="primary"
            />
            <CreditCard_
              title="30-Day Credits"
              amount={earningsData.last30DaysEarnings}
              icon={<Calendar className="text-purple-500" size={24} />}
              chipText="This Month"
              chipColor="secondary"
            />
            <CreditCard_
              title="Total Credits"
              amount={earningsData.allTimeEarnings}
              icon={<Wallet className="text-yellow-500" size={24} />}
              chipText="All Time"
              chipColor="warning"
            />
          </div>
          <div className="grid gap-1 sm:gap-3 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <CreditCard_
              title="SRK Milestone Bonus"
              amount={earningsData.srkBonus}
              icon={<Gift className="text-pink-500" size={24} />}
              chipText="Bonus"
              chipColor="danger"
            />
            <CreditCard_
              title="Available Credits"
              amount={earningsData.walletBalance}
              icon={<CreditCard className="text-green-500" size={24} />}
              chipText="Available"
              chipColor="success"
            />
            <CreditCard_
              title="TDS Deduction"
              amount={earningsData.totalTds}
              icon={<BookMarked className="text-red-500" size={24} />}
              chipText="Tax"
              chipColor="danger"
            />
          </div>
          <Card className="bg-bgSecondary">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Credits Overview</h2>
              <div className="flex gap-2">
                <Chip color="primary" variant="flat" className="text-white">
                  Weekly
                </Chip>
                <Chip color="primary" variant="flat" className="text-white">
                  Monthly
                </Chip>
                <Chip color="primary" variant="flat" className="text-white">
                  Yearly
                </Chip>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <EarningsChart />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

type TCreditCard = {
  title: string;
  amount: number;
  icon: ReactNode;
  chipText: string;
  chipColor: "success" | "primary" | "danger" | "secondary" | "warning";
};

function CreditCard_({
  title,
  amount,
  icon,
  chipText,
  chipColor,
}: TCreditCard) {
  return (
    <Card>
      <CardBody className="bg-bgSecondary flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="text-small text-default-500">{title}</p>
          <p className="text-2xl text-white font-bold">
            Rs.{amount?.toFixed(0)}
          </p>
          <Chip color={chipColor} variant="flat" size="sm" className="mt-2">
            {chipText}
          </Chip>
        </div>
        <div className="bg-default-300 p-3 rounded-full">{icon}</div>
      </CardBody>
    </Card>
  );
}
