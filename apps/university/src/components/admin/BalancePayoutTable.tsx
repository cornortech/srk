import { useState } from "react";
import {
  Button,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Search } from "lucide-react";
import { PayoutDetailsModal } from "./PayoutDetailsModels";
import { useQuery } from "@tanstack/react-query";
import { chipColorsStatusMap, TBalancePayout } from "../../lib/types";
import { getBalancePayoutByStatus } from "../../lib/apiClient";

export function BalancePayoutTable() {
  const [selectedPayout, setSelectedPayout] = useState<TBalancePayout | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayout(null);
  };

  const { data: payouts, refetch: refetchBalancePayoutQuery } = useQuery<
    TBalancePayout[]
  >({
    queryKey: ["payouts"],
    queryFn: async () => {
      const data = await getBalancePayoutByStatus([
        "pending",
        "approved",
        "rejected",
      ]);

      return data;
    },
  });

  const handleRefetch = () => {
    refetchBalancePayoutQuery();
  };

  if (!payouts) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Select
          placeholder="Filter by Status"
          // onChange={(e) => handleFilterChange("status", e.target.value)}
          className="max-w-xs"
        >
          <SelectItem key="all" value="all">
            All
          </SelectItem>
          <SelectItem key="pending" value="pending">
            Pending
          </SelectItem>
          <SelectItem key="completed" value="completed">
            Completed
          </SelectItem>
          <SelectItem key="rejected" value="rejected">
            Rejected
          </SelectItem>
        </Select>
        <div className="relative w-96">
          <Input
            type="text"
            placeholder="Search by username or user ID"
            // onChange={(e) => handleFilterChange("search", e.target.value)}
            classNames={{
              input: "pl-8",
            }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6" />
        </div>
      </div>
      <Table aria-label="Balance Payout table">
        <TableHeader>
          <TableColumn>SN</TableColumn>
          <TableColumn>Username</TableColumn>
          <TableColumn>Package</TableColumn>
          <TableColumn>Payout Amount</TableColumn>
          <TableColumn>Tds Amount</TableColumn>
          <TableColumn>Total Amount</TableColumn>
          <TableColumn>Transaction Number</TableColumn>
          <TableColumn>Action</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody>
          {payouts.map((payout, index) => (
            <TableRow key={payout._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{payout.username}</TableCell>
              <TableCell>{payout.packageTitle}</TableCell>
              <TableCell>{payout.amount}</TableCell>
              <TableCell>{payout.tdsAmount}</TableCell>
              <TableCell>{payout.totalAmount}</TableCell>
              <TableCell>{payout.transactionNumber}</TableCell>
              <TableCell>
                <Chip color={chipColorsStatusMap[payout.status]} variant="flat">
                  {payout.status}
                </Chip>
              </TableCell>

              <TableCell>
                <Button
                  color="primary"
                  onPress={() => {
                    setSelectedPayout(payout);
                    setIsModalOpen(true);
                  }}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedPayout && (
        <PayoutDetailsModal
          handleRefetch={handleRefetch}
          isOpen={isModalOpen}
          payout={selectedPayout}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
