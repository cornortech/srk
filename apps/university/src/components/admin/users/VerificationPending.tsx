import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
} from '@nextui-org/react';
import { useState } from 'react';
import { isAxiosError } from 'axios';
import { ViewIcon } from 'lucide-react';
import { TGetAllUsersAdmin, userStatusColorMap } from '../../../lib/types';
import { PaymentVerification } from '../modal/PaymentVerification';
import useAlert from '../../../hooks/useAlert';
import { useMutation } from '@tanstack/react-query';
import {
  approvePaymentDetailsApi,
  rejectPaymentDetailsApi,
} from '../../../lib/apiClient';
import TablePagination from '../Pagination';

interface UserTableProps {
  users: TGetAllUsersAdmin[];
  refetch: () => void;
}

interface UserTableProps {
  users: TGetAllUsersAdmin[];
  page: number; 
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaymentVerificationPendingUsersTable({
  users,
  page,
  totalPages,
  onPageChange,
  refetch,
}: UserTableProps) {
  const [activeUser, setActiveUser] = useState<TGetAllUsersAdmin | null>(null);
  const { show } = useAlert();

  const { mutate: approvePaymentDetailsMutation, isPending: isApproving } = useMutation({
    mutationFn: async (userId: string) => {
      const res = await approvePaymentDetailsApi(userId);
      return res;
    },
    onSuccess: () => {
      refetch();
      show('Payment approved successfully', 'success');
      setActiveUser(null);
    },
    onError: (error) => {
      refetch();
      const message =
        (isAxiosError(error) && error.response?.data?.message) ||
        'Something went wrong';
      show(message, 'error');
    },
  });

  const { mutate: rejectPaymentDetailsMutation, isPending: isRejecting } = useMutation({
    mutationFn: async (data: { userId: string; reason: string }) => {
      const res = await rejectPaymentDetailsApi(data.userId, data.reason);
      return res;
    },
    onSuccess: () => {
      setActiveUser(null);
      refetch();
      show('Payment rejected successfully', 'success');
    },
    onError: (error) => {
      refetch();
      const message =
        (isAxiosError(error) && error.response?.data?.message) ||
        'Something went wrong';
      show(message, 'error');
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
              <TableCell>{user.packageId?.title || '-'}</TableCell>
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
      {users.length >= 10 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
      {activeUser ? (
        <PaymentVerification
          isApproving={isApproving}
          isRejecting={isRejecting}
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
