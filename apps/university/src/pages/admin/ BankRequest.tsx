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
  Card,
  CardHeader,
  CardBody,
  Input,
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
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<TBankRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = (user: TBankRequest) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const { data: bankRequest, refetch, isLoading } = useQuery<
    TBankRequestByStatus | undefined
  >({
    queryKey: ['bank-requests', page, search],
    queryFn: async () => {
      const data = await getBankRequestApi(
        ['pending', 'approved', 'rejected'],
        page,
        10,
        search || undefined
      );
      return data;
    },
  });

  console.log('bankRequest', bankRequest);

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
    <div className="container mx-auto py-4">
      <Card>
        <CardHeader className="text-xl font-bold flex flex-row gap-x-4">
          <h1>Bank Details Requests</h1>
          <Input
            placeholder="Search by name, bank, or account"
            className="w-1/2 self-end ml-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardHeader>
        <CardBody>
          {isLoading && !bankRequest ? (
            <div className="flex justify-center items-center py-10">
              <div>Loading...</div>
            </div>
          ) : (
            <>
              <Table aria-label="Bank Request table">
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

              {bankRequest && bankRequest.data && bankRequest.data.length >= 10 && (
                <TablePagination
                  page={bankRequest.page}
                  totalPages={bankRequest.totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              )}
            </>
          )}
        </CardBody>
      </Card>

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
    </div>
  );
}
