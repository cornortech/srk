import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../store/useAuth";
import { getSrkBonusFlowAdminApi } from "../../lib/apiClient";
import moment from "moment";
import { useMediaQuery } from "@react-hook/media-query";
import { useNavigate } from "react-router-dom";
import { TSrkBonusFlowAdmin } from "../../lib/types";

const columns = [
  { key: "storeName", label: "Store Name" },
  { key: "purpose", label: "Purpose" },
  { key: "email", label: "Email" },
  { key: "noOfSrkBonus", label: "No. of Srk Bonus" },
  { key: "totalSrkBonus", label: "Total Srk Bonus" },
  { key: "registeredAt", label: "Registered At" },
];

export default function AdminSrkBonusFlow() {
  const { userDetails } = useAuthStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  const { data: teams } = useQuery<TSrkBonusFlowAdmin[]>({
    queryKey: ["teams", userDetails?._id],
    queryFn: async () => {
      const data = await getSrkBonusFlowAdminApi();
      return data;
    },
  });

  if (!teams) {
    return <div className="p-4 w-full">Loading...</div>;
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 w-full">
        {teams.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-bgTernary rounded-lg shadow-lg border border-gray-700"
          >
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-400">
                  {column.label}:
                </span>
                <span>
                  {column.key === "registeredAt"
                    ? moment(item.registeredAt).format("lll")
                    : column.key === "storeName"
                    ? item.storeName ?? "N/A"
                    : column.key === "purpose"
                    ? item.purpose ?? "N/A"
                    : column.key === "email"
                    ? item.email ?? "N/A"
                    : column.key === "noOfSrkBonus"
                    ? item.totalSrkBonus && item.totalSrkBonus.toFixed(0)
                    : column.key === "totalSrkBonus"
                    ? item.totalSrkBonus && `Rs.${item.noOfSrkBonus.toFixed(0)}`
                    : "N/A"}
                    
                </span>
              </div>
            ))}
            <Button>
              <span
                className="text-blue-500 hover:underline"
                onClick={() => {
                  // Handle action here, e.g., view details
                  navigate(`/admin/srk-bonus/${item._id}`);
                  console.log("View details for:", item);
                }}
              >
                View Details
              </span>
            </Button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4 text-white">Srk Bonus Flow</h1>
      <Table aria-label="Srk Bonus Flow Table">
        <TableHeader>
          {/* {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))} */}
          <TableColumn>SN</TableColumn>
          <TableColumn>Store Name</TableColumn>
          <TableColumn>Purpose</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>No. of Srk Bonus</TableColumn>
          <TableColumn>Total Srk Bonus</TableColumn>
          <TableColumn>Registered At</TableColumn>
          {/* Add action column for View Details */}
          <TableColumn> Action</TableColumn>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow className="h-16" key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{team.storeName ?? "N/A"}</TableCell>
              <TableCell>{team.purpose ?? "N/A"}</TableCell>
              <TableCell>{team.email ?? "N/A"}</TableCell>
              <TableCell>{team.totalSrkBonus.toFixed(0) ?? 0}</TableCell>
              <TableCell>{team.noOfSrkBonus.toFixed(0) ?? 0}</TableCell>
              <TableCell>
                {team.registeredAt
                  ? moment(team.registeredAt).format("lll")
                  : "N/A"}
              </TableCell>
              <TableCell>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => {
                    // Handle action here, e.g., view details
                    navigate(`/admin/srk-bonus/${team._id}`);
                    console.log("View details for:", team);
                  }}
                >
                  View Details
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
