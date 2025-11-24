import { Card, CardBody } from "@nextui-org/card";
import { DollarSign, Users, Wallet } from "lucide-react";

export default function EarningsOverview() {
  // This data would typically come from an API
  const earnings = {
    total: 10000,
    referral: 2000,
    wallet: 5000,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 ">
      <Card className="bg-bgSecondary text-textPrimary">
        <CardBody className="flex flex-row items-center gap-4">
          <div className="p-2 rounded-full">
            <DollarSign className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Earnings</h3>
            <p className="text-2xl font-bold">
              ${earnings.total.toLocaleString()}
            </p>
          </div>
        </CardBody>
      </Card>
      <Card className="bg-bgSecondary text-textPrimary">
        <CardBody className="flex flex-row items-center gap-4">
          <div className="p-2 bg-success/10 rounded-full">
            <Users className="text-success" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Referral Earnings</h3>
            <p className="text-2xl font-bold">
              ${earnings.referral.toLocaleString()}
            </p>
          </div>
        </CardBody>
      </Card>
      <Card className="bg-bgSecondary text-textPrimary">
        <CardBody className="flex flex-row items-center gap-4">
          <div className="p-2 bg-warning/10 rounded-full">
            <Wallet className="text-warning" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Wallet Balance</h3>
            <p className="text-2xl font-bold">
              ${earnings.wallet.toLocaleString()}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
