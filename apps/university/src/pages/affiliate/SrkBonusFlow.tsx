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
import useAuthStore from "../../store/useAuth";
import { getSrkBonusFlowOfUserApi } from "../../lib/apiClient";
import moment from "moment";
import { TSrkBonusFlow } from "../../lib/types";
import { useMediaQuery } from "@react-hook/media-query";

const columns = [
  { key: "username", label: "Store Name" },
  { key: "purpose", label: "Purpose" },
  { key: "package", label: "Package" },
  { key: "registeredUser", label: "Registered User" },
  { key: "bonusAmount", label: "Srk Bonus" },
  { key: "createdAt", label: "Registered At" },
];

export default function SrkBonusFlow() {
  const { userDetails } = useAuthStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: teams, isLoading } = useQuery<TSrkBonusFlow[]>({
    queryKey: ["teams", userDetails?._id],
    queryFn: async () => {
      if (!userDetails?._id) return null;
      const data = await getSrkBonusFlowOfUserApi(userDetails._id);
      return data;
    },
    enabled: !!userDetails?._id,
  });

  if (!teams || isLoading) {
    return <div className="p-4 w-full">Loading...</div>;
  }
  // if (teams.length === 0) {
  //   return (
  //     <div className="p-4 w-full">
  //       <h1 className="text-2xl font-bold mb-4 text-white">Srk Bonus Flow</h1>
  //       <p className="text-gray-400">No data available.</p>
  //     </div>
  //   );
  // }

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
      <h1 className="text-2xl font-bold mb-4 text-white">Srk Bonus Flow</h1>
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
              <TableCell>
                {team.username && `${team.username.split(" ")[0]} store`}
              </TableCell>
              <TableCell>{team.purpose ?? ""}</TableCell>
              <TableCell>{team.package ?? ""}</TableCell>
              <TableCell>{team.registeredUser ?? ""}</TableCell>
              <TableCell>
                {(team.bonusAmount && team.bonusAmount.toFixed(0)) ?? 0}
              </TableCell>
              <TableCell>
                {team.createdAt ? moment(team.createdAt).format("lll") : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
