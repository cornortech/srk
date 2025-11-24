import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/react";
import { Landmark } from "lucide-react";

export const TimeBreakdownCard = ({
  title,
  icon,
  data,
  payoutFn,
}: {
  title: string;
  icon: React.ReactNode;
  payoutFn?: () => void;
  data: {
    today: number;
    sevenDays: number;
    thirtyDays: number;
    allTime: number;
  };
}) => {
  return (
    <Card className="bg-bgSecondary">
      <CardBody>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold">{title}</p>
          {icon}
        </div>
        {["today", "sevenDays", "thirtyDays", "allTime"].map((key) => (
          <div key={key} className="flex justify-between text-sm py-1">
            <span className="capitalize">
              {key
                .replace("sevenDays", "7 Days")
                .replace("thirtyDays", "30 Days")}
            </span>
            <span className="font-medium">
              Rs.{data[key as keyof typeof data]}
            </span>
          </div>
        ))}
        {payoutFn && (
          <Button
            className="mt-4 w-fit"
            color="primary"
            size="sm"
            onPress={payoutFn}
          >
            Payout
            <Landmark size={16} />
          </Button>
        )}
      </CardBody>
    </Card>
  );
};
