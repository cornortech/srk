import { Card, CardBody, CardHeader } from "@nextui-org/react";
import AffiliateRequestTable from "../../components/admin/AffiliateRequestTable";
import { TAffiliateRequest } from "../../lib/types";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getAllAffiliateRequestsByStatusApi } from "../../lib/apiClient";

export const AffilateRequestList = () => {
  const queryClient = useQueryClient();

  const { data: affiliateRequestData } = useQuery<TAffiliateRequest[]>({
    queryKey: ["affiliate-requests"],
    queryFn: async () => {
      return getAllAffiliateRequestsByStatusApi([
        "pending",
        "approved",
        "rejected",
      ]);
    },
  });
  const refetchData = () => {
    queryClient.invalidateQueries({ queryKey: ["affiliate-requests"] });
  };
  if (!affiliateRequestData) return <>...</>;
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="text-xl font-bold">
          Affiliate Request List
        </CardHeader>
        <CardBody>A list of accounts that have affiliate requests.</CardBody>
        <div>
          <AffiliateRequestTable refetchData={refetchData} users={affiliateRequestData} />
        </div>
      </Card>
    </div>
  );
};
