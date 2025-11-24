import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

const affiliatePayments = [
  { name: "John Doe", event: "Summer Sale", amount: 1500 },
  { name: "Jane Smith", event: "Black Friday", amount: 2200 },
  { name: "Bob Johnson", event: "New Year's Eve", amount: 1800 },
  { name: "Alice Brown", event: "Spring Festival", amount: 1300 },
  { name: "Charlie Davis", event: "Cyber Monday", amount: 2500 },
];

export function AffiliatePayments() {
  return (
    <Table
      aria-label="Affiliate Payments "
      classNames={{
        table: "bg-bgSecondary",
        wrapper: "bg-bgSecondary",
      }}
    >
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>EVENT</TableColumn>
        <TableColumn>AMOUNT</TableColumn>
      </TableHeader>
      <TableBody>
        {affiliatePayments.map((payment) => (
          <TableRow key={payment.name}>
            <TableCell>{payment.name}</TableCell>
            <TableCell>{payment.event}</TableCell>
            <TableCell>${payment.amount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
