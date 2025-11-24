import { useState } from "react";
import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { TGetAllUsersAdmin } from "../../lib/types";
import { getUsersByStatus } from "../../lib/apiClient";
import PaymentVerificationPendingUsersTable from "../../components/admin/users/VerificationPending";

export const VerificatinPendingPage = () => {
  const { data: users, refetch } = useQuery<TGetAllUsersAdmin[]>({
    queryKey: ["verificaitonPendingUsers"],
    queryFn: async () => {
      const res = await getUsersByStatus(["PAYMENT_VERIFICATION_PENDING"]);
      return res;
    },
  });

  const [search, setSearch] = useState("");

  if (!users) {
    return <div></div>;
  }

  // Filter users based on email, firstName, or lastName
  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchTerm) ||
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm)
    );
  });

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
          <PaymentVerificationPendingUsersTable
            users={filteredUsers}
            refetch={() => refetch()}
          />
        </CardBody>
      </Card>
    </div>
  );
};
