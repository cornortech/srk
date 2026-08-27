import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import UserTable from '../../components/admin/UserTable';
import { useQuery } from '@tanstack/react-query';
import { TGetUserByStatusByResponse } from '../../lib/types';
import { getUsersByStatus } from '../../lib/apiClient';

export const ListOfUsers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search]);

  const { data: users, isLoading } = useQuery<TGetUserByStatusByResponse>({
    queryKey: ['users', page, debouncedSearch],
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
        debouncedSearch || undefined
      ),
  });

  const userLists = users?.data || [];

  return (
    <div className="container mx-auto py-4">
      <Card>
        <CardHeader className="text-xl font-bold flex flex-row gap-x-4">
          <h1>Users</h1>
          <Input
            placeholder="Search by email, name"
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
            <UserTable
              users={userLists}
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
