import React, { useState } from "react";
import {
  Card,
  Spacer,
  Table,
  CardBody,
  TableBody,
  TableColumn,
  TableHeader,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { Mail, Banknote } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TAdminEarnings, TBankStatement } from "../../lib/types";
import {
  createSrkUniversityBankPayoutApi,
  getAdminEarningDetailsApi,
  getAllSrkUniversityBankStatementApi,
} from "../../lib/apiClient";
import { PayoutEarning } from "../../components/admin/modal/PayoutEarning";
import useAlert from "../../hooks/useAlert";

const SrkUniversityBank: React.FC = () => {
  const [openBankExtractModal, setOpenBankExtractModal] = useState(false);
  const { show } = useAlert();

  const { data: earningDetails } = useQuery<TAdminEarnings | null>({
    queryKey: ["getAdminSrkEarningDetails"],
    queryFn: () => {
      return getAdminEarningDetailsApi();
    },
  });

  const { data: bankStatementData } = useQuery<TBankStatement[] | undefined>({
    queryKey: ["getAllSrkUniversityBankStatement"],
    queryFn: () => {
      return getAllSrkUniversityBankStatementApi();
    },
  });

  const { mutate: handleExtractMutation } = useMutation({
    mutationFn: async (amount: number) => {
      console.log(amount);
      const res = await createSrkUniversityBankPayoutApi(amount);
      return res;
    },
    onSuccess: () => {
      show("Extract request successful", "success");
      setOpenBankExtractModal(false);
    },
    onError: () => {
      show("Extract request failed", "error");
    },
  });

  const handleCofirmExtract = (ExtractAmount: number) => {
    if (ExtractAmount <= 0) {
      show("Extract amount must be greater than 0", "error");
      return;
    }
    handleExtractMutation(ExtractAmount);
  };

  if (!bankStatementData) return <>loading..</>;

  return (
    <div className="p-4 w-full ">
      <Card className=" text-white bg-bgSecondary">
        <CardBody className="flex flex-col gap-y-1">
          <h3 className="text-2xl font-semibold mb-3">
            Srk Univeristy Bank Details
          </h3>
          <Spacer y={0.5} />
          <div className="flex items-center">
            <Banknote size={20} className="mr-2" />
            <>
              <strong className="text-green-500">
                Amount: Rs.{earningDetails?.srkUniversityAmount?.toFixed(2)}
              </strong>
            </>
          </div>
          <Spacer y={0.5} />
          <div className="flex items-center">
            <Banknote size={20} className="mr-2" />
            <h1>
              <strong className="text-yellow-500">
                Pending Extract Amount: Rs.
                {earningDetails?.srkUniversityPendingAmount?.toFixed(2)}
              </strong>
            </h1>
          </div>
          <Spacer y={0.5} />
          <div className="flex items-center">
            <Banknote size={20} className="mr-2" />
            <>
              <strong>Bank Name:</strong> SRK University Bank
            </>
          </div>

          <Spacer y={0.5} />
          <div className="flex items-center">
            <Mail size={20} className="mr-2" />
            <strong>Email:</strong> srkuniversity@gmail.com
          </div>
          <Spacer y={0.5} />
          <div className="flex items-center">
            <Banknote size={20} className="mr-2" />
            <strong>Relation with Account:</strong> self
          </div>
          <Spacer y={1} />
          {/* <Button onPress={handleExtract} color="primary">
            Request Extract
          </Button> */}
          <Button onPress={() => setOpenBankExtractModal(true)}>
            Ask for Extract
          </Button>
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
              <TableColumn>Activity Amount</TableColumn>
              <TableColumn>Description</TableColumn>
            </TableHeader>
            <TableBody className="">
              {bankStatementData?.map((statement, index) => (
                <TableRow key={index} className="text-white">
                  <TableCell className="">
                    {statement.createdAt?.toString().split("T")[0]}
                  </TableCell>
                  <TableCell>{statement.type}</TableCell>
                  <TableCell
                    className={`${statement.type === "Extract_request"
                      ? "text-yellow-500"
                      : statement.type === "Extract"
                        ? "text-red-500"
                        : "text-green-500"
                      }`}
                  >
                    Rs.{statement.amount.toFixed(2)}
                  </TableCell>

                  <TableCell className="">{statement.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <PayoutEarning
        isOpen={openBankExtractModal}
        onApprove={handleCofirmExtract}
        onClose={() => setOpenBankExtractModal(false)}
        onReject={() => {
          setOpenBankExtractModal(false);
        }}
        title="Srk Bank Extract Request"
        totalAmountAvailable={earningDetails?.srkUniversityAmount || 0}
      />
    </div>
  );
};

export default SrkUniversityBank;
