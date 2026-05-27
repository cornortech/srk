import { Card, CardBody } from "@nextui-org/card";
import { BookMarked, Users, Wallet } from "lucide-react";

export default function EarningsOverview() {
  const credits = {
    total: 10000,
    referral: 2000,
    wallet: 5000,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 ">
      <Card className="bg-bgSecondary text-textPrimary">
        <CardBody className="flex flex-row items-center gap-4">
          <div className="p-2 rounded-full">
            <BookMarked className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Credits</h3>
            <p className="text-2xl font-bold">
              Rs.{credits.total.toLocaleString()}
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
            <h3 className="text-lg font-semibold">Referral Credits</h3>
            <p className="text-2xl font-bold">
              Rs.{credits.referral.toLocaleString()}
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
            <h3 className="text-lg font-semibold">Available Credits</h3>
            <p className="text-2xl font-bold">
              Rs.{credits.wallet.toLocaleString()}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
