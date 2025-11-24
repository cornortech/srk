import { BalancePayoutTable } from "../../components/admin/BalancePayoutTable";

export default function BalancePayouts() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5 text-white">Balance Payouts</h1>
      <BalancePayoutTable />
    </div>
  );
}
