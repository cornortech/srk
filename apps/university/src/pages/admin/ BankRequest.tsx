import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Image,
  Chip,
} from '@nextui-org/react';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import {
  chipColorsStatusMap,
  TBankRequest,
  TBankRequestByStatus,
} from '../../lib/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  approveBankRequestApi,
  getBankRequestApi,
  rejectBankRequestApi,
} from '../../lib/apiClient';
import { VerifyBankRequestModal } from '../../components/admin/modal/BankRequestModal';
import TablePagination from '../../components/admin/Pagination';

export default function BankRequest() {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<TBankRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = (user: TBankRequest) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const { data: bankRequest, refetch } = useQuery<
    TBankRequestByStatus | undefined
  >({
    queryKey: ['bank-requests', page],
    queryFn: async () => {
      const data = await getBankRequestApi(
        [
          'pending',
          'approved',
          'rejected',
        ],
        page,
        10
      );
      return data;
    },
  });

  const { mutate: approveMutation } = useMutation({
    mutationFn: async (userId: string) => {
      if (!userId) return;
      await approveBankRequestApi(userId);
    },
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
      setSelectedUser(null);
    },
  });
  const { mutate: rejectMutation } = useMutation({
    mutationFn: async (data: { userId: string; reason: string }) => {
      if (!data.userId || !data.reason) return;
      await rejectBankRequestApi(data.userId, data.reason);
    },
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
      setSelectedUser(null);
    },
  });

  const handleApprove = (userId: string) => {
    approveMutation(userId);
  };

  const handleReject = (userId: string, reason: string) => {
    rejectMutation({
      reason,
      userId,
    });
    console.log(`rejecting ${userId}`);
  };

  // if (!bankRequest?.data) {
  //   return <div></div>;
  // }

  const bankRequestList = bankRequest?.data || [];

  return (
    <>
      <Table aria-label="Affiliate Request table">
        <TableHeader>
          <TableColumn>S.</TableColumn>
          <TableColumn>Image</TableColumn>
          <TableColumn>Username</TableColumn>
          <TableColumn>Package</TableColumn>
          <TableColumn>Bank Name</TableColumn>
          <TableColumn>Branch Name</TableColumn>
          <TableColumn>Account Number</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {bankRequestList.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
              <TableCell>
                <Image
                  src={user.profilePicture}
                  width={30}
                  height={30}
                  className="object-cover"
                />
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.packageTitle || '-'}</TableCell>
              <TableCell>{user.bankName}</TableCell>
              <TableCell>{user.branchName}</TableCell>
              <TableCell>{user.accountNumber}</TableCell>
              <TableCell>
                <Chip color={chipColorsStatusMap[user.status]} variant="flat">
                  {user.status}
                </Chip>
              </TableCell>

              <TableCell>
                <Button
                  isIconOnly
                  size="sm"
                  onPress={() => handleOpenModal(user)}
                >
                  <EllipsisVertical size={15} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {bankRequestList.length >= 10 && (
        <TablePagination
          page={bankRequest?.page || 1}
          totalPages={bankRequest?.totalPages || 1}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {selectedUser ? (
        <VerifyBankRequestModal
          userId={selectedUser?.userId}
          accountHolderName={selectedUser?.accountHolderName}
          accountNumber={selectedUser?.accountNumber}
          ifscCode={selectedUser?.ifscCode}
          bankName={selectedUser?.bankName}
          branchName={selectedUser?.branchName}
          accountType={selectedUser?.accountType}
          isOpen={isModalOpen}
          onApprove={handleApprove}
          onClose={() => setIsModalOpen(false)}
          onReject={handleReject}
          profilePicture={selectedUser?.profilePicture}
          qrUrl={selectedUser?.qrUrl}
          relationWithAccount={selectedUser?.relationWithAccount}
          status={selectedUser?.status}
          username={selectedUser?.username}
        />
      ) : null}
    </>
  );
}
