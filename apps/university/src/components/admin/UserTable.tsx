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
import { TGetAllUsersAdmin, userStatusColorMap } from "../../lib/types";
import { useState } from "react";
import { VerifyKYCModal } from "./modal/VerifyKYCModal";
import { useMutation } from "@tanstack/react-query";
import { rejectKycApi, verifyKycApi } from "../../lib/apiClient";
import useAlert from "../../hooks/useAlert";
import { AxiosError } from "axios";
import { ViewIcon } from "lucide-react";

interface UserTableProps {
  users: TGetAllUsersAdmin[];
}

export default function UserTable({ users }: UserTableProps) {
  const [activeUser, setActiveUser] = useState<TGetAllUsersAdmin | null>(null);
  const { show } = useAlert();

  const { mutate: approveKycMutation } = useMutation({
    mutationFn: async (data: { userId: string }) => {
      if (!data.userId) return;
      await verifyKycApi(data.userId);
    },
    onSuccess: () => {
      show("KYC approved successfully", "success");
      setActiveUser(null);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      show(error.response?.data?.message || "Failed to approve", "error");
    },
  });

  const { mutate: rejectKycMutation } = useMutation({
    mutationKey: ["payout"],
    mutationFn: async (data: { reason: string; userId: string }) => {
      await rejectKycApi(data.userId, data.reason);
    },
    onSuccess: () => {
      show("KYC rejected successfully", "success");
      setActiveUser(null);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      show(error.response?.data?.message || "Failed to reject", "error");
    },
  });

  const handleOnApprove = () => {
    const userId = activeUser?._id;
    if (!userId) {
      show("User not found", "error");
      return;
    }
    approveKycMutation({
      userId,
    });
  };

  const handleOnClose = () => {
    setActiveUser(null);
  };
  const handleOnReject = (reason: string) => {
    if (!reason) {
      show("Please enter rejection reason", "error");
      return;
    }
    const userId = activeUser?._id;
    if (!userId) {
      show("User not found", "error");
      return;
    }
    rejectKycMutation({ reason, userId });
  };

  return (
    <>
      <VerifyKYCModal
        userId={activeUser?._id || ""}
        isAllowedToAddUser={activeUser?.allowedToAddUsers || false}
        status={activeUser?.status}
        isOpen={!!activeUser}
        backImage={activeUser?.kycDetails?.backImage || ""}
        frontImage={activeUser?.kycDetails?.frontImage || ""}
        documentType={activeUser?.kycDetails?.documentType || ""}
        documentName={activeUser?.kycDetails?.documentNumber || ""}
        verificationImage={activeUser?.kycDetails?.verificationImage || ""}
        onApprove={handleOnApprove}
        onClose={handleOnClose}
        onReject={handleOnReject}
        data={activeUser}
        courseEnrollAgreementUrl={activeUser?.courseEnrollAgreementUrl}
      />
      <Table aria-label="User table">
        <TableHeader>
          <TableColumn>SN</TableColumn>
          <TableColumn>Username</TableColumn>
          <TableColumn>Package</TableColumn>
          <TableColumn>Referred By</TableColumn>
          <TableColumn>Senior </TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Purpose</TableColumn>
          <TableColumn>Contact Number</TableColumn>
          <TableColumn>status</TableColumn>
          <TableColumn>
            <span className="sr-only">Actions</span>
          </TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.packageId?.title || "N/A"} </TableCell>
              <TableCell>
                {user.referredBy?.firstName} {user.referredBy?.lastName}
              </TableCell>
              <TableCell>
                {user.seniorUser?.firstName} {user.seniorUser?.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.purpose || "-"}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>
                <Chip variant="flat" color={userStatusColorMap[user.status]}>
                  {user.status} {user.isSelfSignup ? " (web)" : ""}
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
    </>
  );
}
