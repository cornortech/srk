import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

export function TdsCalculation() {
  const totalTurnover = 45231.89;
  const tdsPercentage = 15;
  const tdsAmount = totalTurnover * (tdsPercentage / 100);
  const amountAfterTds = totalTurnover - tdsAmount;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">TDS Calculation</h3>
      </CardHeader>
      <Divider />
      <CardBody>
        <Table aria-label="TDS Calculation">
          <TableHeader>
            <TableColumn>DESCRIPTION</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>Total Turnover</TableCell>
              <TableCell>${totalTurnover.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell>TDS Percentage</TableCell>
              <TableCell>{tdsPercentage}%</TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell>TDS Amount</TableCell>
              <TableCell>${tdsAmount.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow key="4">
              <TableCell>Amount after TDS</TableCell>
              <TableCell>${amountAfterTds.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Divider className="my-4" />
        <p className="text-sm text-default-400">
          Note: TDS (Tax Deducted at Source) is calculated as {tdsPercentage}%
          of the total turnover. This amount is deducted before any other
          distributions or charges are applied.
        </p>
      </CardBody>
    </Card>
  );
}
