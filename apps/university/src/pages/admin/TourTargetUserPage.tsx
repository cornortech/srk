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
import { useMediaQuery } from "@react-hook/media-query";
import { useNavigate } from "react-router-dom";
import { tourApi, TActiveTourAchievement } from "../../lib/api/tour/tour.api";

const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "collectedAmount", label: "Collected Amount (Nrs.)" },
];

export default function AdminTourTargetUserPage() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const navigate = useNavigate();

    const { data: users } = useQuery<TActiveTourAchievement[]>({
        queryKey: ["getActiveTourAchievements"],
        queryFn: async () => {
            const data = await tourApi.getActiveTourAchievements();
            return data;
        },
    });

    if (!users) {
        return <div className="p-4 w-full">Loading...</div>;
    }

    // ------------------- 📱 Mobile view -------------------
    if (isMobile) {
        return (
            <div className="flex flex-col gap-4 w-full">
                {users.map((item, index) => (
                    <div
                        key={index}
                        className="p-4 bg-bgTernary rounded-lg shadow-lg border border-gray-700"
                    >
                        {columns.map((column) => (
                            <div
                                key={column.key}
                                className="flex justify-between mb-2 text-sm"
                            >
                                <span className="font-semibold text-gray-400">
                                    {column.label}:
                                </span>
                                <span>
                                    {column.key === "firstName"
                                        ? item.firstName
                                        : column.key === "lastName"
                                            ? item.lastName
                                            : column.key === "email"
                                                ? item.email
                                                : column.key === "phoneNumber"
                                                    ? item.phoneNumber
                                                    : column.key === "collectedAmount"
                                                        ? `Nrs. ${item.collectedAmount.toFixed(2)}`
                                                        : "N/A"}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    // ------------------- 💻 Desktop view -------------------
    return (
        <div className="p-4 w-full">
            <h1 className="text-2xl font-bold mb-4 text-white">Active Tour Target Achievements</h1>
            <Table aria-label="Active Tour Target Achievements Table">
                <TableHeader>
                    <TableColumn>SN</TableColumn>
                    <TableColumn>First Name</TableColumn>
                    <TableColumn>Last Name</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Phone Number</TableColumn>
                    <TableColumn>Collected Amount (Nrs.)</TableColumn>
                </TableHeader>
                <TableBody>
                    {users.map((user, index) => (
                        <TableRow className="h-16" key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{user.firstName ?? "N/A"}</TableCell>
                            <TableCell>{user.lastName ?? "N/A"}</TableCell>
                            <TableCell>{user.email ?? "N/A"}</TableCell>
                            <TableCell>{user.phoneNumber ?? "N/A"}</TableCell>
                            <TableCell>Nrs. {user.collectedAmount.toFixed(2) ?? "0.00"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
