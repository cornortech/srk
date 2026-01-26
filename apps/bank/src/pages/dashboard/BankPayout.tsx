import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Card,
    Chip,
    Input,
    Select,
    SelectItem,
    Pagination,
    Tooltip,
} from "@nextui-org/react";
import {
    FileText,
    Calendar,
    Search,
    QrCode, 
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import useAuthStore from "../../../store/useAuth";
import { getPayoutOfUserApi } from "../../../lib/apiClient";
import { TBalancePayout } from "../../../lib/types";

const BankPayout = () => {
    const { userDetails } = useAuthStore();
    const userId = userDetails?._id;

    const { data, isLoading } = useQuery<TBalancePayout[]>({
        queryKey: ["payouts", userId],
        queryFn: async () => {
            if (!userId) return [];
            return await getPayoutOfUserApi(userId);
        },
        enabled: !!userId,
    });

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [sortBy, setSortBy] = useState("Newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useMemo(() => {
        setCurrentPage(1);
    }, [search, filterStatus, sortBy]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const formatTime = (date: string) =>
        new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });

    // Filter + sort
    const filteredAndSorted = useMemo(() => {
        if (!data) return [];

        let result = [...data];

        if (search) {
            const lower = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.packageTitle.toLowerCase().includes(lower) ||
                    p.transactionNumber.toLowerCase().includes(lower) ||
                    (p.paymentMethod || "").toLowerCase().includes(lower)
            );
        }

        if (filterStatus !== "All") {
            result = result.filter((p) => p.status === filterStatus.toLowerCase());
        }

        if (sortBy === "Newest") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        } else if (sortBy === "Oldest") {
            result.sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
        } else if (sortBy === "High") {
            result.sort((a, b) => b.amount - a.amount);
        } else if (sortBy === "Low") {
            result.sort((a, b) => a.amount - b.amount);
        }

        return result;
    }, [data, search, filterStatus, sortBy]);

    const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredAndSorted.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    if (isLoading) {
        return (
            <div className="min-h-screen w-full bg-black flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="w-8 h-8 rounded-full border-2 mx-auto mb-4 animate-spin"
                        style={{ borderColor: "#b68938", borderTopColor: "transparent" }}
                    />
                    <p className="text-white text-sm sm:text-base">
                        Loading payouts...
                    </p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center text-gray-400 p-6">
                <FileText className="h-16 w-16 text-gray-600 mb-3" />
                <h2 className="text-lg font-semibold text-white">
                    No Payouts Yet
                </h2>
                <p className="text-sm text-gray-500">
                    Once you request or receive a payout, it will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-black p-4 sm:p-6 mt-32">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: "#b68938" }} />
                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                            Payout History
                        </h1>
                    </div>
                    <Chip
                        size="sm"
                        style={{
                            backgroundColor: "rgba(182, 137, 56, 0.2)",
                            color: "#b68938",
                            border: "1px solid rgba(182, 137, 56, 0.4)",
                        }}
                    >
                        {filteredAndSorted.length} Payout
                        {filteredAndSorted.length !== 1 ? "s" : ""}
                    </Chip>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <Input
                        startContent={<Search className="text-gray-400 w-4 h-4" />}
                        placeholder="Search by transaction or package..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-white"
                        classNames={{
                            input: "text-white bg-[#1a1a1a]",
                            inputWrapper:
                                "h-14 bg-[#1a1a1a] border border-[#b68938]/20 hover:border-[#b68938]/40",
                        }}
                    />
                    <Select
                        label="Filter by Status"
                        selectedKeys={[filterStatus]}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full"
                        classNames={{
                            trigger:
                                "h-14 bg-[#1a1a1a] border border-[#b68938]/20 hover:border-[#b68938]/40",
                            value: "text-white",
                            label: "text-gray-400",
                        }}
                    >
                        <SelectItem key="All">All</SelectItem>
                        <SelectItem key="pending">Pending</SelectItem>
                        <SelectItem key="approved">Approved</SelectItem>
                        <SelectItem key="rejected">Rejected</SelectItem>
                    </Select>
                    <Select
                        label="Sort by"
                        selectedKeys={[sortBy]}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full"
                        classNames={{
                            trigger:
                                "h-14 bg-[#1a1a1a] border border-[#b68938]/20 hover:border-[#b68938]/40",
                            value: "text-white",
                            label: "text-gray-400",
                        }}
                    >
                        <SelectItem key="Newest">Date: Newest → Oldest</SelectItem>
                        <SelectItem key="Oldest">Date: Oldest → Newest</SelectItem>
                        <SelectItem key="High">Amount: High → Low</SelectItem>
                        <SelectItem key="Low">Amount: Low → High</SelectItem>
                    </Select>
                </div>

                {/* Table */}
                <Card className="bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 rounded-2xl overflow-hidden">
                    <Table
                        aria-label="Payout table"
                        classNames={{
                            th: "bg-[#2a2520] text-white font-semibold text-sm border-b border-[#b68938]/20",
                            td: "text-white border-b border-[#b68938]/10",
                            tr: "hover:bg-[#2a2520]/50 transition-colors",
                        }}
                    >
                        <TableHeader>
                            <TableColumn>
                                <Calendar className="w-4 h-4 inline mr-2" style={{ color: "#b68938" }} />
                                Date & Time
                            </TableColumn>
                            <TableColumn>Amount</TableColumn>
                            <TableColumn>Tds Amount</TableColumn>
                            <TableColumn>Transaction Number</TableColumn>
                            <TableColumn>Status</TableColumn>
                            <TableColumn>Method</TableColumn>
                            <TableColumn>Payment Proof</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((payout) => (
                                <TableRow key={payout._id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {formatDate(payout.createdAt.toString())}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {formatTime(payout.createdAt.toString())}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-green-400">
                                            NPR {payout.amount.toLocaleString()}
                                        </span>
                                    </TableCell>
                                         <TableCell>
                                        <span className="font-semibold text-green-400">
                                            NPR {payout.tdsAmount.toLocaleString()}
                                        </span>
                                    </TableCell>
                                    <TableCell>{payout.transactionNumber}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="sm"
                                            color={
                                                payout.status === "approved"
                                                    ? "success"
                                                    : payout.status === "pending"
                                                        ? "warning"
                                                        : "danger"
                                            }
                                            variant="flat"
                                        >
                                            {payout.status.toUpperCase()}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>{payout.paymentMethod || "N/A"}</TableCell>
                                    <TableCell>
                                        {payout.paymentProofUrl ? (
                                            <Tooltip content="View Payment Proof">
                                                <a
                                                    href={payout.paymentProofUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <QrCode className="w-5 h-5 text-[#b68938]" />
                                                </a>
                                            </Tooltip>
                                        ) : (
                                            <span className="text-gray-500">—</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <Pagination
                            total={totalPages}
                            page={currentPage}
                            onChange={setCurrentPage}
                            showControls
                            classNames={{
                                item: "bg-[#1a1a1a] border border-[#b68938]/20 text-white hover:bg-[#2a2520]",
                                cursor: "bg-[#b68938] text-white font-semibold",
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BankPayout;
