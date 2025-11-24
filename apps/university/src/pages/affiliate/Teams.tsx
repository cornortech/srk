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
import { getTeamsOfUserApi } from "../../lib/apiClient";
import moment from "moment";
import { TAffiliateTeam } from "../../lib/types";
import { useMediaQuery } from "@react-hook/media-query";

// Dummy data for the table

const columns = [
  { key: "firstName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phoneNumber", label: "phone Number" },
  { key: "packageName", label: "Package Name" },
  { key: "createdAt", label: "Date of join" },
];

export default function TeamsPage() {
  const { userDetails } = useAuthStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // const paginatedData = teamsData.slice(
  //   (page - 1) * rowsPerPage,
  //   page * rowsPerPage
  // );

  const { data: teams } = useQuery<TAffiliateTeam[]>({
    queryKey: ["teams", userDetails?._id],
    queryFn: async () => {
      if (!userDetails?._id) return null;
      const data = await getTeamsOfUserApi(userDetails?._id);
      return data;
    },
    enabled: !!userDetails?._id,
  });

  if (!teams) {
    return <div className="p-4 w-full"></div>;
  }

  if (isMobile) {
    // Render cards for mobile view
    return (
      <div className="flex flex-col gap-4 w-full">
        {teams.map((item) => (
          <div
            key={item._id}
            className="p-4 bg-bgTernary rounded-lg shadow-lg border border-gray-700"
          >
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-400">
                  {column.label}:
                </span>
                {column.key === "createdAt"
                  ? moment(getKeyValue(item, column.key)).format("lll")
                  : getKeyValue(item, column.key)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4 text-white">My Teams</h1>
      <Table
        aria-label="Teams Table"
        bottomContent={
          <div className="flex w-full justify-center">
            {/* <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={Math.ceil(teamsData.length / rowsPerPage)}
              onChange={(newPage) => setPage(newPage)}
            /> */}
          </div>
        }
      >
        <TableHeader>
          <TableColumn>SN</TableColumn>
          <TableColumn>Name</TableColumn>

          <TableColumn>Package</TableColumn>
          <TableColumn>Purpose</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Phone</TableColumn>
          <TableColumn>Package</TableColumn>
          <TableColumn>DOJ</TableColumn>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow className="h-16" key={team._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {team.firstName} {team.lastName}
              </TableCell>
              <TableCell>
                {team.packageName ? team.packageName : "N/A"}
              </TableCell>
              <TableCell>{team.purpose ? team.purpose : "N/A"}</TableCell>
              <TableCell>{team.email}</TableCell>
              <TableCell>{team.phoneNumber}</TableCell>
              <TableCell>{team.packageName}</TableCell>
              <TableCell>{moment(team.createdAt).format("lll")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
