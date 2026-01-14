import { useState } from 'react';
import { Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { TGetUserByStatusByResponse } from '../../lib/types';
import { getUsersByStatus } from '../../lib/apiClient';
import PaymentVerificationPendingUsersTable from '../../components/admin/users/VerificationPending';

export const VerificatinPendingPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data: users, refetch, isLoading } = useQuery<TGetUserByStatusByResponse>({
    queryKey: ['verificaitonPendingUsers', page, search],
    queryFn: async () => {
      const res = await getUsersByStatus(
        ['PAYMENT_VERIFICATION_PENDING'],
        page,
        10,
        search || undefined
      );
      return res;
    },
  });

  const userLists = users?.data || [];

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="text-xl font-bold flex flex-row gap-x-4">
          <h1>Payment Verification Pending Users</h1>
          <Input
            placeholder="Search users"
            className="w-1/2 self-end ml-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardHeader>
        <CardBody>
          {isLoading && !users ? (
            <div className="flex justify-center items-center py-10">
              <div>Loading...</div>
            </div>
          ) : (
            <PaymentVerificationPendingUsersTable
              users={userLists}
              refetch={() => refetch()}
              page={users?.page || 1}
              totalPages={users?.totalPages || 1}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};
