import { Card, CardBody } from "@nextui-org/react";

export default function PayoutSummary() {
  return (
    <Card className="mb-6">
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-semibold">Total Payouts</h3>
            <p className="text-2xl font-bold">$12,345.67</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Pending Payouts</h3>
            <p className="text-2xl font-bold">$1,234.56</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Next Payout Date</h3>
            <p className="text-2xl font-bold">July 15, 2023</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
