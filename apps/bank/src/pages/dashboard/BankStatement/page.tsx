import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Card,
    CardBody,
    Chip,
    Input,
    Select,
    SelectItem,
    Pagination,
} from "@nextui-org/react";

import {
    FileText,
    TrendingUp,
    TrendingDown,
    Calendar,
    DollarSign,
    Search,
} from "lucide-react";
import { getBankStatementOfUserApi } from "@srk/shared/api";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@srk/shared/hooks";
import { TBankStatement } from "@srk/shared/types";
import { useMemo, useState } from "react";


const BankStatement = () => {
    const { userDetails } = useAuthStore();
    const userId = userDetails?._id;

    const { data: bankStatementData, isLoading } = useQuery<TBankStatement[] | undefined>({
        queryKey: ["getBankStatementOfUserApi", userId],
        queryFn: () => {
            if (!userId) return;
            return getBankStatementOfUserApi(userId);
        },
        enabled: !!userId,
    });

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [sortBy, setSortBy] = useState("Newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredAndSorted = useMemo(() => {
        let result = [...bankStatementData || []];

        // 🔸 Filter by type
        if (filterType !== "All") {
            result = result.filter(
                (item) => item.type.toLowerCase() === filterType.toLowerCase()
            );
        }

        // 🔸 Search by description or type
        if (search.trim() !== "") {
            const lower = search.toLowerCase();
            result = result.filter(
                (item) =>
                    item.description?.toLowerCase().includes(lower) ||
                    item.type.toLowerCase().includes(lower)
            );
        }

        // 🔸 Sort by chosen criteria
        result.sort((a, b) => {
            if (sortBy === "Newest")
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sortBy === "Oldest")
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            if (sortBy === "High")
                return b.amount - a.amount;
            if (sortBy === "Low")
                return a.amount - b.amount;
            return 0;
        });

        return result;
    }, [bankStatementData, search, filterType, sortBy]);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [search, filterType, sortBy]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredAndSorted.slice(startIndex, endIndex);


    if (isLoading) {
        return (
            <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
                <div className="text-center">
                    <div
                        className="w-8 h-8 rounded-full border-2 mx-auto mb-4 animate-spin"
                        style={{
                            borderColor: "#b68938",
                            borderTopColor: "transparent",
                        }}
                    />
                    <p className="text-white text-sm sm:text-base">Loading statements...</p>
                </div>
            </div>
        );
    }

    // 🕓 Helpers
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTransactionStyle = (type: string) => {
        const isCredit =
            type.toLowerCase() === "credit" || type.toLowerCase() === "deposit";
        return {
            color: isCredit ? "#10b981" : "#ef4444",
            bgColor: isCredit ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            icon: isCredit ? (
                <TrendingUp className="w-4 h-4" />
            ) : (
                <TrendingDown className="w-4 h-4" />
            ),
            sign: isCredit ? "+" : "-",
        };
    };

    //if no transaction is done then this should be shown , otherwise the below information will be shown according to the user's activity
    //   if (!bankStatement || bankStatement.length === 0) {
    //   return (
    //     <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center text-gray-400 p-6">
    //       <div className="flex flex-col items-center gap-3">
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           className="h-16 w-16 text-gray-600"
    //           fill="none"
    //           viewBox="0 0 24 24"
    //           stroke="currentColor"
    //           strokeWidth={1.5}
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             d="M3 10h18M7 10v10m10-10v10M4 6h16M2 20h20"
    //           />
    //         </svg>

    //         <h2 className="text-lg font-semibold text-white">No Transactions Yet</h2>
    //         <p className="text-sm text-gray-500">
    //           Once you make a transaction, it will appear here.
    //         </p>

    //         <button
    //           className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
    //           onClick={() => window.location.reload()}
    //         >
    //           Refresh
    //         </button>
    //       </div>
    //     </div>
    //   );
    // }


    if (!bankStatementData) {
        return <>loading..</>
    }

    return (
        <div className="min-h-screen w-full bg-black p-4 sm:p-6 mt-32">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <FileText
                            className="w-6 h-6 sm:w-7 sm:h-7"
                            style={{ color: "#b68938" }}
                        />
                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                            Bank Statement
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
                        {filteredAndSorted.length} Transaction
                        {filteredAndSorted.length !== 1 ? "s" : ""}
                    </Chip>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <Input
                        startContent={<Search className="text-gray-400 w-4 h-4" />}
                        placeholder="Search by description or type..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-white"
                        classNames={{
                            input: "text-white bg-[#1a1a1a]",
                            inputWrapper: "h-14 bg-[#1a1a1a] border border-[#b68938]/20 hover:border-[#b68938]/40",
                        }}
                    />
                    <Select
                        label="Filter by Type"
                        selectedKeys={[filterType]}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full"
                        classNames={{
                            trigger: "h-14 bg-[#1a1a1a] border border-[#b68938]/20 hover:border-[#b68938]/40",
                            value: "text-white",
                            label: "text-gray-400",
                        }}
                    >
                        <SelectItem key="All">All</SelectItem>
                        <SelectItem key="Credit">Credit</SelectItem>
                        <SelectItem key="Debit">Debit</SelectItem>
                    </Select>
                    <Select
                        label="Sort by"
                        selectedKeys={[sortBy]}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full"
                        classNames={{
                            trigger: "h-14 bg-[#1a1a1a] border border-[#b68938]/20 hover:border-[#b68938]/40",
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

                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <Card className="bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 rounded-2xl overflow-hidden">
                        <Table
                            aria-label="Bank statement table"
                            className="bg-transparent"
                            classNames={{
                                wrapper: "bg-transparent",
                                th: "bg-[#2a2520] text-white font-semibold text-sm border-b border-[#b68938]/20",
                                td: "text-white border-b border-[#b68938]/10",
                                tr: "hover:bg-[#2a2520]/50 transition-colors",
                            }}
                        >
                            <TableHeader>
                                <TableColumn>
                                    <div className="flex items-center gap-2">
                                        <Calendar
                                            className="w-4 h-4"
                                            style={{ color: "#b68938" }}
                                        />
                                        DATE & TIME
                                    </div>
                                </TableColumn>
                                <TableColumn>TYPE</TableColumn>
                                <TableColumn>
                                    <div className="flex items-center gap-2">
                                        <DollarSign
                                            className="w-4 h-4"
                                            style={{ color: "#b68938" }}
                                        />
                                        AMOUNT
                                    </div>
                                </TableColumn>
                                <TableColumn>DESCRIPTION</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.map((statement, index) => {
                                    const style = getTransactionStyle(statement.type);
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {formatDate(statement.createdAt)}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {formatTime(statement.createdAt)}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="sm"
                                                    startContent={style.icon}
                                                    style={{
                                                        backgroundColor: style.bgColor,
                                                        color: style.color,
                                                        border: `1px solid ${style.color}40`,
                                                    }}
                                                >
                                                    {statement.type}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className="font-semibold text-base"
                                                    style={{ color: style.color }}
                                                >
                                                    {style.sign}$
                                                    {Math.abs(statement.amount).toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-300">
                                                    {statement.description || "No description"}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Pagination for Desktop */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <Pagination
                                total={totalPages}
                                page={currentPage}
                                onChange={setCurrentPage}
                                showControls
                                classNames={{
                                    wrapper: "gap-2",
                                    item: "bg-[#1a1a1a] border border-[#b68938]/20 text-white hover:bg-[#2a2520]",
                                    cursor: "bg-[#b68938] text-white font-semibold",
                                    prev: "bg-[#1a1a1a] border border-[#b68938]/20 text-white hover:bg-[#2a2520]",
                                    next: "bg-[#1a1a1a] border border-[#b68938]/20 text-white hover:bg-[#2a2520]",
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {paginatedData.map((statement, index) => {
                        const style = getTransactionStyle(statement.type);
                        return (
                            <Card
                                key={index}
                                className="bg-[#1a1a1a] border border-[#b68938]/40 shadow-lg shadow-[#b68938]/5"
                            >
                                <CardBody className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="p-2 rounded-lg"
                                                style={{ backgroundColor: style.bgColor }}
                                            >
                                                {style.icon}
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    {formatDate(statement.date)}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatTime(statement.date)}
                                                </p>
                                            </div>
                                        </div>
                                        <Chip
                                            size="sm"
                                            style={{
                                                backgroundColor: style.bgColor,
                                                color: style.color,
                                                border: `1px solid ${style.color}40`,
                                            }}
                                        >
                                            {statement.type}
                                        </Chip>
                                    </div>

                                    <div className="text-center py-2">
                                        <span
                                            className="text-2xl font-bold"
                                            style={{ color: style.color }}
                                        >
                                            {style.sign}$
                                            {Math.abs(statement.amount).toLocaleString()}
                                        </span>
                                    </div>

                                    {statement.description && (
                                        <div
                                            className="p-3 rounded-lg"
                                            style={{ backgroundColor: "#2a2520" }}
                                        >
                                            <p className="text-xs text-gray-400 mb-1">Description</p>
                                            <p className="text-sm text-white">
                                                {statement.description}
                                            </p>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        );
                    })}

                    {/* Pagination for Mobile */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <Pagination
                                total={totalPages}
                                page={currentPage}
                                onChange={setCurrentPage}
                                showControls
                                size="sm"
                                classNames={{
                                    wrapper: "gap-1",
                                    item: "bg-[#1a1a1a] border border-[#b68938]/20 text-white hover:bg-[#2a2520] min-w-8 w-8 h-8",
                                    cursor: "bg-[#b68938] text-white font-semibold",
                                    prev: "bg-[#1a1a1a] border border-[#b68938]/20 text-white hover:bg-[#2a2520]",
                                    next: "bg-[#1a1a1a] border border-[#b68938]/20 text-white hover:bg-[#2a2520]",
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BankStatement;