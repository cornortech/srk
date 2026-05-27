import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { useMediaQuery } from "@react-hook/media-query";
import { Avatar } from "@nextui-org/react";
import React from "react";
import { TLeaderBoardData } from "../../../lib/types";
import { getUniversityAssetUrl } from "../../../lib/cdn";

interface LeaderboardProps {
  users: TLeaderBoardData[];
}
export const TableBoard = ({ users }: LeaderboardProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const columns = isMobile
    ? [
        { key: "position", label: "RANK" },
        { key: "profile", label: "NAME" },
        { key: "amount", label: "CREDITS" },
      ]
    : [
        { key: "position", label: "PLACE" },
        { key: "profile", label: "PROFILE" },
        { key: "country", label: "COUNTRY" },
        { key: "amount", label: "CREDITS" },
      ];

  const [page] = React.useState(1);
  const rowsPerPage = 10; // Number of rows per page
  // const pages = Math.ceil(users.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return users.slice(start, end);
  }, [page, users]);

  const renderCell = (performer: TLeaderBoardData, columnKey: string) => {
    switch (columnKey) {
      case "position":
        return (
          <div className="w-8 h-8 rounded-full bg-bgSecondary flex items-center justify-center text-white">
            {performer.position}
          </div>
        );
      case "profile":
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={getUniversityAssetUrl(performer.profilePicture)}
              className="w-10 h-10"
              alt={performer.username}
            />
            <span className="text-gray-200">{performer.username}</span>
          </div>
        );
      case "country":
        return <span className="text-gray-400">{performer.country}</span>;

      case "amount":
        return (
          <span className="text-gray-200 font-bold">
            {performer.totalEarnings}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full mt-6 ">
      <Table aria-label="Leaderboard table" className="bg-black">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(performer) => (
            <TableRow key={performer.userId}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(performer, columnKey.toString())}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
