import { useState } from 'react';
import { Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import UserTable from '../../components/admin/UserTable';
import { useQuery } from '@tanstack/react-query';
import { TGetUserByStatusByResponse } from '../../lib/types';
import { getUsersByStatus } from '../../lib/apiClient';

export const ListOfUsers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: users } = useQuery<TGetUserByStatusByResponse>({
    queryKey: ['users', page, search],
    queryFn: async () =>
      getUsersByStatus(
        [
          'REGISTERED',
          'PORTAL_ACTIVATED',
          'PORTAL_DEACTIVATED',
          'KYC_VERIFICATION_PENDING',
          'KYC_VERIFICATION_REJECTED',
        ],
        page,
        10,
        search || undefined
      ),
  });

  if (!users?.data) return <div>Loading...</div>;

  const userLists = users?.data || [];

  return (
    <div className="container mx-auto py-4">
      <Card>
        <CardHeader className="text-xl font-bold flex flex-row gap-x-4">
          <h1>Users</h1>
          <Input
            placeholder="Search users"
            className="w-1/2 self-end ml-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardHeader>
        <CardBody>
          <UserTable
            users={userLists}
            page={users.page}
            totalPages={users.totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </CardBody>
      </Card>
    </div>
  );
};
