import React from "react";
import {
  Card,
  Button,
  Spacer,
  Table,
  CardBody,
  TableBody,
  TableColumn,
  TableHeader,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Mail, Banknote } from "lucide-react";
import { TBankStatement, TEarningDetails } from "../../../lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAuthStore from "../../../store/useAuth";
import {
  getBankStatementOfUserApi,
  getEarningDetailsofUserApi,
  srkBankPayoutRequestApi,
} from "../../../lib/apiClient";
import useAlert from "../../../hooks/useAlert";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@react-hook/media-query"; // For mobile detection
import { PayoutEarning } from "../../admin/modal/PayoutEarning";

const BankPage: React.FC = () => {
  const { userDetails } = useAuthStore();
  const { show } = useAlert();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)"); // Detect mobile screen

  const { data: earningDetails, refetch: refetchEarningDetails } = useQuery<
    TEarningDetails | undefined
  >({
    queryKey: ["getEarningDetailsofUserApi", userDetails?._id],
    queryFn: () => {
      if (!userDetails?._id) return;
      return getEarningDetailsofUserApi(userDetails?._id);
    },
    enabled: !!userDetails?._id,
  });

  const bankDetails = {
    accountType: "Savings",
    bankName: "SRK Bank Limited",
    amount: earningDetails?.srkBankAmount || 0,
    email: userDetails?.email,
    relation: "Self",
  };

  const { mutate: srkBankPayoutMutation, isPending } = useMutation({
    mutationFn: async (data: { userId: string; amount: number }) => {
      await srkBankPayoutRequestApi(data.userId, data.amount);
    },
    onSuccess: () => {
      refetchEarningDetails();
      navigate("/affiliate/payout");
      setIsModalOpen(false);
      show("Credit transfer request submitted", "success");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data?.message || "Credit transfer request failed", "error");
    },
  });

  const handlePayout = (amount: number) => {
    if (amount < 500) {
      show("Minimum credit transfer amount is Rs.500", "error");
      return;
    }
    if (userDetails?._id) {
      srkBankPayoutMutation({
        userId: userDetails?._id,
        amount: amount,
      });
    }
  };

  const { data: bankStatementData } = useQuery<TBankStatement[] | undefined>({
    queryKey: ["getBankStatementOfUserApi", userDetails?._id],
    queryFn: () => {
      if (!userDetails?._id) return;
      return getBankStatementOfUserApi(userDetails?._id);
    },
    enabled: !!userDetails?._id,
  });

  if (!bankStatementData) return <></>;

  if (isMobile) {
    // Render mobile view with cards for Bank Details and Bank Statements
    return (
      <div className="p-4 w-full ">
        {/* Bank Details Card */}
        <Card className=" text-white bg-bgSecondary">
          <CardBody className="flex flex-col gap-y-1">
            <h3 className="text-2xl font-semibold mb-3">Bank Details</h3>
            <Spacer y={0.5} />
            <div className="flex items-center">
              <Banknote size={20} className="mr-2" />
              <strong className="text-green-500">
                Amount: Rs.{bankDetails.amount.toFixed(2)}
              </strong>
            </div>
            <Spacer y={0.5} />
            <div className="flex items-center ">
              <Banknote size={20} className="mr-2" />
              <strong className="text-yellow-500">
                Transfer Pending: Rs.{" "}
                {earningDetails?.totalBankPayout?.toFixed(2)}
              </strong>
            </div>
            <Spacer y={0.5} />
            <div className="flex items-center">
              <Banknote size={20} className="mr-2" />
              <strong>Bank Name:</strong> {bankDetails.bankName}
            </div>
            <Spacer y={0.5} />
            <div className="flex items-center">
              <Mail size={20} className="mr-2" />
              <strong>Email:</strong> {bankDetails.email}
            </div>
            <Spacer y={0.5} />
            <div className="flex items-center">
              <Banknote size={20} className="mr-2" />
              <strong>Relation with Account:</strong> {bankDetails.relation}
            </div>
            <Spacer y={1} />
            {(earningDetails?.srkBankAmount || 0) > 0 && (
              <Button onPress={() => setIsModalOpen(true)} color="primary">
                Request Credit Transfer
              </Button>
            )}
          </CardBody>
        </Card>

        <PayoutEarning
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Request Credit Transfer"
          totalAmountAvailable={earningDetails?.srkBankAmount || 0}
          onApprove={handlePayout}
          isPending={isPending}
          onReject={() => setIsModalOpen(false)}
        />

        {/* Bank Statement Cards */}
        <Spacer y={1} />
        <h3 className="text-xl font-semibold text-white mb-4">
          Bank Statements
        </h3>
        <div className="space-y-4">
          {bankStatementData.map((statement, index) => (
            <Card key={index} className="bg-bgSecondary text-white">
              <CardBody className="flex flex-col gap-y-2">
                <div className="flex justify-between">
                  <strong>Date:</strong>
                  <span>{statement.createdAt?.toString().split("T")[0]}</span>
                </div>
                <div className="flex justify-between">
                  <strong>Type:</strong>
                  <span>{statement.type}</span>
                </div>
                <div className="flex justify-between">
                  <strong>Transaction Amount:</strong>
                  <span
                    className={`${statement.type === "payout_request"
                      ? "text-yellow-500"
                      : statement.type === "payout"
                        ? "text-red-500"
                        : "text-green-500"
                      }`}
                  >
                    Rs.{statement.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong>Bank Amount:</strong>
                  <span>Rs.{statement.currentAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <strong>Description:</strong>
                  <span>{statement.description}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // If not mobile, render the default table layout
  return (
    <div className="p-4 w-full ">
      <Card className=" text-white bg-bgSecondary">
        <CardBody className="flex flex-col gap-y-1">
          <h3 className="text-2xl font-semibold mb-3">Bank Details</h3>
          <Spacer y={0.5} />
          <div className="flex items-center">
            <Banknote size={20} className="mr-2" />
            <strong className="text-green-500">
              Amount: Rs.{bankDetails.amount.toFixed(2)}
            </strong>
          </div>
          <Spacer y={0.5} />
          <div className="flex items-center ">
            <Banknote size={20} className="mr-2" />
            <strong className="text-yellow-500">
              Payout Pending: Rs. {earningDetails?.totalBankPayout?.toFixed(2)}
            </strong>
          </div>
          <Spacer y={0.5} />
          <div className="flex items-center">
            <Banknote size={20} className="mr-2" />
            <strong>Bank Name:</strong> {bankDetails.bankName}
          </div>
          <Spacer y={0.5} />
          <div className="flex items-center">
            <Mail size={20} className="mr-2" />
            <strong>Email:</strong> {bankDetails.email}
          </div>
          <Spacer y={0.5} />
          <div className="flex items-center">
            <Banknote size={20} className="mr-2" />
            <strong>Relation with Account:</strong> {bankDetails.relation}
          </div>
          <Spacer y={1} />
          {(earningDetails?.srkBankAmount || 0) > 0 && (
            <Button onPress={() => setIsModalOpen(true)} color="primary">
              Request Credit Transfer
            </Button>
          )}
        </CardBody>
      </Card>

      <Spacer y={1} />

      <Card className="w-full  text-default-100">
        <CardBody className="bg-bgSecondary text-white flex flex-col gap-y-2">
          <h3 className="text-xl font-semibold">Bank Statement</h3>
          <Spacer y={0.5} />
          <Table
            aria-label="Bank Statement"
            color="default"
            className=" bg-transparent text-white "
          >
            <TableHeader className="">
              <TableColumn>Date</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Transaction Amount</TableColumn>
              <TableColumn>Bank Amount</TableColumn>
              <TableColumn>Description</TableColumn>
            </TableHeader>
            <TableBody className="">
              {bankStatementData.map((statement, index) => (
                <TableRow key={index} className="text-white">
                  <TableCell className="">
                    {statement.createdAt?.toString().split("T")[0]}
                  </TableCell>
                  <TableCell>{statement.type}</TableCell>
                  <TableCell
                    className={`${statement.type === "payout_request"
                      ? "text-red-500"
                      : statement.type === "payout"
                        ? "text-red-500"
                        : "text-green-500"
                      }`}
                  >
                    Rs.{statement.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="">
                    Rs.{statement.currentAmount?.toFixed(2)}
                  </TableCell>
                  <TableCell className="">{statement.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <PayoutEarning
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request Credit Transfer"
        totalAmountAvailable={earningDetails?.srkBankAmount || 0}
        onApprove={handlePayout}
        isPending={isPending}
        onReject={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BankPage;
