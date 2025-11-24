import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  getKeyValue,
  TableCell,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getSrkBonusFlowOfUserApi } from "../../lib/apiClient";
import moment from "moment";
import { TSrkBonusFlow } from "../../lib/types";
import { useMediaQuery } from "@react-hook/media-query";
import { useParams } from "react-router-dom";

const columns = [
  { key: "username", label: "Store Name" },
  { key: "purpose", label: "Purpose" },
  { key: "package", label: "Package" },
  { key: "registeredUser", label: "Registered User" },
  { key: "bonusAmount", label: "Srk Bonus" },
  { key: "createdAt", label: "Registered At" },
];

export default function SrkBonusFlowAdminUser() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { id } = useParams<{ id: string }>();

  const { data: teams } = useQuery<TSrkBonusFlow[]>({
    queryKey: ["teams", id],
    queryFn: async () => {
      if (!id) return null;
      const data = await getSrkBonusFlowOfUserApi(id);
      return data;
    },
    enabled: !!id,
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
                  {column.key === "createdAt"
                    ? moment(getKeyValue(item, column.key)).format("lll")
                    : getKeyValue(item, column.key) ?? "N/A"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4 text-white">Srk Bonus Flow Of User</h1>
      <Table aria-label="Srk Bonus Flow Table">
        <TableHeader>
          <TableColumn>SN</TableColumn>
          <TableColumn>Store Name</TableColumn>
          <TableColumn>Purpose</TableColumn>
          <TableColumn>Package</TableColumn>
          <TableColumn>Registered User</TableColumn>
          <TableColumn>Srk Bonus</TableColumn>
          <TableColumn>Registered At</TableColumn>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow className="h-16" key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{team.username ?? "N/A"}</TableCell>
              <TableCell>{team.purpose ?? "N/A"}</TableCell>
              <TableCell>{team.package ?? "N/A"}</TableCell>
              <TableCell>{team.registeredUser ?? "N/A"}</TableCell>
              <TableCell>{team.bonusAmount ?? 0}</TableCell>
              <TableCell>
                {team.createdAt ? moment(team.createdAt).format("lll") : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
