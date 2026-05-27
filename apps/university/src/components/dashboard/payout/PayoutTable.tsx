import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  getKeyValue,
  Chip,
} from "@nextui-org/react";
import { columns, payouts } from "../../../Data/payoutData";
import { useMediaQuery } from "@react-hook/media-query";
import { useQuery } from "@tanstack/react-query";
import { getPayoutOfUserApi } from "../../../lib/apiClient";
import { TBalancePayout } from "../../../lib/types";
import useAuthStore from "../../../store/useAuth";
import { Link } from "lucide-react";
import moment from "moment";

export default function PayoutTable() {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const pages = Math.ceil(payouts.length / rowsPerPage);
  const { userDetails } = useAuthStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data } = useQuery<TBalancePayout[]>({
    queryKey: ["payouts", userDetails?._id],
    queryFn: async () => {
      const userId = userDetails?._id;
      if (!userId) return;
      const data = await getPayoutOfUserApi(userId);
      return data;
    },
    enabled: !!userDetails?._id,
  });

  const getStatusColor = (status: string) => {
    // status?.toLowerCase is not a function
    console.log("debugstatus", status);
    if (!status) return "default";
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      case "rejected":
        return "danger";
      case "approved":
        return "success";
      default:
        return "default";
    }
  };

  if (!data) {
    return <>..</>;
  }
  if (isMobile) {
    // Render cards for mobile view
    return (
      <div className="flex flex-col gap-4">
        {data.map((item) => (
          <div
            key={item._id}
            className="p-4 bg-bgTernary rounded-lg shadow-lg border border-gray-700"
          >
            {columns.map((column) => {
              const value = getKeyValue(item, column.key);
              const columnKey = column.key;
              const statusChipColor = getStatusColor(
                getKeyValue(item, columnKey)?.toString()
              );
              return (
                <div key={column.key} className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-400">
                    {column.label}:
                  </span>
                  {columnKey === "createdAt" ? (
                    <>{moment(value).format("lll")}</>
                  ) : columnKey === "paymentProofUrl" ? (
                    value && value.startsWith("https") ? (
                      <Link onClick={() => window.open(value, "_blank")} />
                    ) : (
                      ""
                    )
                  ) : columnKey === "status" ? (
                    <Chip color={statusChipColor} variant="flat">
                      {value}
                    </Chip>
                  ) : (
                    value
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <Pagination
          isCompact
          showControls
          showShadow
          color="default"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
          className="self-center"
        />
      </div>
    );
  }

  // Render table for larger viewports
  return (
    <Table
      aria-label="Credit transfer history table"
      bottomContent={
        <div className="flex w-full justify-center">
          {/* <Pagination
            isCompact
            showControls
            showShadow
            color="default"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          /> */}
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.key === "actions" ? "center" : "start"}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data} loadingContent={<Spinner />}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => {
              const value = getKeyValue(item, columnKey)
                ? getKeyValue(item, columnKey)
                : "-";

              return (
                <TableCell>
                  {columnKey === "createdAt" ? (
                    <>{moment(value).format("lll")}</>
                  ) : columnKey === "paymentProofUrl" ? (
                    value && value.startsWith("https") ? (
                      <Link onClick={() => window.open(value, "_blank")} />
                    ) : (
                      ""
                    )
                  ) : columnKey === "status" ? (
                    <Chip
                      color={getStatusColor(getKeyValue(item, columnKey))}
                      variant="flat"
                    >
                      {value}
                    </Chip>
                  ) : (
                    value
                  )}
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
