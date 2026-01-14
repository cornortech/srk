import { Card, CardBody, CardHeader } from '@nextui-org/react';
import AffiliateRequestTable from '../../components/admin/AffiliateRequestTable';
import { TGetAffiliateRequestByStatus } from '../../lib/types';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { getAllAffiliateRequestsByStatusApi } from '../../lib/apiClient';
import { useState } from 'react';

export const AffilateRequestList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: affiliateRequestData } = useQuery<TGetAffiliateRequestByStatus>(
    {
      queryKey: ['affiliate-requests', page, search],
      queryFn: async () => {
        return getAllAffiliateRequestsByStatusApi(
          ['pending', 'approved', 'rejected'],
          page,
          10,
          search || undefined
        );
      },
    }
  );
  const refetchData = () => {
    queryClient.invalidateQueries({ queryKey: ['affiliate-requests'] });
  };

  const affiliateRequestList = affiliateRequestData?.data || [];

  // if (!affiliateRequestData?.data) return <div>Loading...</div>;

  // if (!affiliateRequestData) return <>...</>;
  if (!affiliateRequestData?.data) return <div>Loading...</div>;

  if (!affiliateRequestData) return <>...</>;
  return (
    <div className="container mx-auto py-4">
      <Card>
        <CardHeader className="text-xl font-bold flex flex-row gap-x-4">
          <h1>Affiliate Request List</h1>
          <Input
            placeholder="Search by name or email"
            className="w-1/2 self-end ml-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardHeader>
        <CardBody>A list of accounts that have affiliate requests.</CardBody>
        <div>
          <AffiliateRequestTable
            refetchData={refetchData}
            users={affiliateRequestList}
            page={affiliateRequestData?.page || 1}
            totalPages={affiliateRequestData?.totalPages || 1}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </Card>
    </div>
  );
};
