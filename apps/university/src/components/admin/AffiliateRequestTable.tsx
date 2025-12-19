import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  // Image,
  Chip,
  // Tab,
} from '@nextui-org/react';
import { EllipsisVertical, SquareArrowOutUpRight } from 'lucide-react';
import UserDetailsModal from './userDetailsModel';
import { useState } from 'react';
import { chipColorsStatusMap, TAffiliateRequest } from '../../lib/types';
import { useMutation } from '@tanstack/react-query';
import {
  approveAffiliateRequestApi,
  rejectAffiliateRequestApi,
} from '../../lib/apiClient';
import useAlert from '../../hooks/useAlert';
import { AxiosError } from 'axios';
import moment from 'moment';
import TablePagination from './Pagination';

interface UserTableProps {
  users: TAffiliateRequest[];
  refetchData: () => void;
  page: number; // current page
  totalPages: number; // total pages
  onPageChange: (page: number) => void; // callback
}

export default function AffiliateRequestTable({
  users,
  refetchData,
  page,
  totalPages,
  onPageChange,
}: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<TAffiliateRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { show } = useAlert();
  const handleOpenModal = (user: TAffiliateRequest) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const { mutate: acceptMutation } = useMutation({
    mutationFn: async (user: TAffiliateRequest) => {
      const userId = user.userId;
      if (!userId) return;
      await approveAffiliateRequestApi(userId);
    },
    onSuccess: () => {
      show('Affiliate request approved successfully', 'success');
      handleCloseModal();
      refetchData();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      show(error.response?.data?.message || 'Failed to approve', 'error');
    },
  });
  const { mutate: rejectMutation } = useMutation({
    mutationFn: async (data: { userId: string; reason: string }) => {
      await rejectAffiliateRequestApi(data.userId, data.reason);
    },
    onSuccess: () => {
      show('Affiliate request rejected successfully', 'success');
      handleCloseModal();
      refetchData();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      show(error.response?.data?.message || 'Failed to reject', 'error');
    },
  });
  const handleAccept = (user: TAffiliateRequest) => {
    acceptMutation(user);
  };

  const handleDecline = (user: TAffiliateRequest, reason: string) => {
    rejectMutation({
      userId: user.userId,
      reason,
    });
  };

  return (
    <>
      <Table aria-label="Affiliate Request table">
        <TableHeader>
          <TableColumn>SN</TableColumn>
          <TableColumn>Requested Date</TableColumn>
          {/* <TableColumn>Image</TableColumn> */}
          <TableColumn>Username</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Gender</TableColumn>
          <TableColumn>Affiliate Status</TableColumn>
          <TableColumn>Agreement</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
              <TableCell>{moment(user.requestedAt).format('lll')}</TableCell>
              {/* <TableCell>
                <Image
                  src={user.profilePicture}
                  width={30}
                  height={30}
                  className="object-cover"
                />
              </TableCell> */}
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>
                <Chip color={chipColorsStatusMap[user.status]} variant="flat">
                  {user.status}
                </Chip>
              </TableCell>
              <TableCell>
                <a href={user.affiliateAgreementUrl} target="_blank">
                  <SquareArrowOutUpRight size={15} />
                </a>
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
      {users.length >= 10 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </>
  );
}
