import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Table } from "lucide-react";
import { getBankStatementOfUserApi } from "../../../lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../../store/useAuth";
import { TBankStatement } from "../../../lib/types";

const BankStatement = () => {
  const { userDetails } = useAuthStore();
  const userId = userDetails?._id;

  const { data: bankStatement } = useQuery<TBankStatement[] | undefined>({
    queryKey: ["getBankStatementOfUserApi", userId],
    queryFn: () => {
      if (!userId) return;
      return getBankStatementOfUserApi(userId);
    },
    enabled: !!userId,
  });
  if (!bankStatement) return <></>;

  //   console.log("bankStatement", bankStatement);

  console.log("bankStatement", bankStatement);

  return (
    <Table aria-label="User table">
      <TableHeader>
        <TableColumn>Date</TableColumn>
        <TableColumn> Type</TableColumn>
        <TableColumn>Amount</TableColumn>
        <TableColumn> Description</TableColumn>
      </TableHeader>
      <TableBody>
        {/* {bankStatement.map((statement, index) => ( */}
          <TableRow >
            <TableCell>hey</TableCell>
            <TableCell>hey</TableCell>
            <TableCell>hey</TableCell>
            <TableCell>"hey</TableCell>
          </TableRow>
        {/* ))} */}
      </TableBody>
    </Table>
  );
};

export default BankStatement;
