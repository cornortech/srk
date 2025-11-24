import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
} from "@nextui-org/react";
import { useState } from "react";
import { ViewIcon } from "lucide-react";
import { TGetAllUsersAdmin, userStatusColorMap } from "../../../lib/types";
import { PaymentVerification } from "../modal/PaymentVerification";
import useAlert from "../../../hooks/useAlert";
import { useMutation } from "@tanstack/react-query";
import {
  approvePaymentDetailsApi,
  rejectPaymentDetailsApi,
} from "../../../lib/apiClient";

interface UserTableProps {
  users: TGetAllUsersAdmin[];
  refetch: () => void;
}

export default function PaymentVerificationPendingUsersTable({
  refetch,
  users,
}: UserTableProps) {
  const [activeUser, setActiveUser] = useState<TGetAllUsersAdmin | null>(null);
  const { show } = useAlert();

  const { mutate: approvePaymentDetailsMutation } = useMutation({
    mutationFn: async (userId: string) => {
      const res = await approvePaymentDetailsApi(userId);
      return res;
    },
    onSuccess: () => {
      refetch();
      show("Payment approved successfully", "success");
      setActiveUser(null);
    },
    onError: () => {
      show("Something went wrong", "error");
    },
  });

  const { mutate: rejectPaymentDetailsMutation } = useMutation({
    mutationFn: async (data: { userId: string; reason: string }) => {
      const res = await rejectPaymentDetailsApi(data.userId, data.reason);
      return res;
    },
    onSuccess: () => {
      setActiveUser(null);
      refetch();
      show("Payment rejected successfully", "success");
    },
    onError: () => {
      show("Something went wrong", "error");
    },
  });

  const handleReject = (reason: string) => {
    if (activeUser) {
      rejectPaymentDetailsMutation({
        userId: activeUser?._id,
        reason,
      });
    }
  };

  const handleApprove = () => {
    if (activeUser) {
      approvePaymentDetailsMutation(activeUser._id);
    }
  };
  return (
    <>
      <Table aria-label="User table">
        <TableHeader>
          <TableColumn>Username</TableColumn>
          <TableColumn>Package</TableColumn>
          <TableColumn>Referred By</TableColumn>
          <TableColumn>Senior </TableColumn>
          <TableColumn>Email</TableColumn>
          {/* <TableColumn>Gender</TableColumn> */}
          <TableColumn>Contact Number</TableColumn>
          <TableColumn>status</TableColumn>
          <TableColumn>
            <span className="sr-only">Actions</span>
          </TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.packageId?.title || "-"}</TableCell>
              <TableCell>
                {user.referredBy?.firstName} {user.referredBy?.lastName}
              </TableCell>
              <TableCell>
                {user.seniorUser?.firstName} {user.seniorUser?.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              {/* <TableCell>{user.gender}</TableCell> */}
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>
                <Chip variant="flat" color={userStatusColorMap[user.status]}>
                  {user.status}
                </Chip>
              </TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  size="sm"
                  onPress={() => setActiveUser(user)}
                >
                  <ViewIcon size={12} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {activeUser ? (
        <PaymentVerification
          isOpen={!!activeUser}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setActiveUser(null)}
          user={activeUser}
        />
      ) : null}
    </>
  );
}
