import React from "react";
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
  Avatar,
} from "@nextui-org/react";
import { Mail, Banknote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TBankStatement } from "../../lib/types";
import {
  getAdminSrkBankDetailsApi,
  getAdminSrkBankStatementApi,
} from "../../lib/apiClient";
import { TAdminSrkBank } from "../../lib/types/entities";

const AdminSrkBankPage: React.FC = () => {
  const { data: bankDetailsData } = useQuery<TAdminSrkBank | null>({
    queryKey: ["getAdminBankDetailsForAdmin"],
    queryFn: () => {
      return getAdminSrkBankDetailsApi();
    },
  });

  const bankDetails = {
    accountType: "Savings",
    bankName: "SRK Bank Limited",
    email: "contact.thesrkuniversity@gmail.com",
    relation: "Self",
  };

  const { data: bankStatementData } = useQuery<TBankStatement[] | undefined>({
    queryKey: ["getAdminBankStatementForAdmin"],
    queryFn: () => {
      return getAdminSrkBankStatementApi();
    },
  });

  if (!bankStatementData) return <></>;

  console.log("bankStatementData", bankStatementData);

  return (
    <div className="p-4 w-full ">
      <Card className=" text-white bg-bgSecondary">
        <CardBody className="flex flex-col gap-y-1">
          <h3 className="text-2xl font-semibold mb-3">SRK Bank Details</h3>
          <Spacer y={0.5} />
          <div className="flex items-center">
            <Banknote size={20} className="mr-2" />
            <>
              <strong className="text-green-500">
                Amount: Rs.{bankDetailsData?.amount?.toFixed(2)}
              </strong>
            </>
          </div>
          <Spacer y={0.5} />
          <div className="flex items-center">
            <Banknote size={20} className="mr-2" />
            <h1>
              <strong className="text-yellow-500">
                Pending Payout Amount: Rs.
                {bankDetailsData?.totalPendingPayout?.toFixed(2)}
              </strong>
            </h1>
          </div>
          <Spacer y={0.5} />
          <div className="flex items-center">
            <Banknote size={20} className="mr-2" />
            <>
              <strong>Bank Name:</strong> {bankDetails.bankName}
            </>
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
          {/* <Button onPress={handlePayout} color="primary">
            Request Payout
          </Button> */}
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
              <TableColumn>Profile</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Transaction Amount</TableColumn>
              <TableColumn>Description</TableColumn>
            </TableHeader>
            <TableBody className="">
              {bankStatementData?.map((statement, index) => (
                <TableRow key={index} className="text-white">
                  <TableCell className="">
                    {statement.createdAt?.toString().split("T")[0]}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-x-2 items-center">
                      <Avatar src={statement?.profilePicture} />
                      {statement?.username}
                    </div>
                  </TableCell>
                  <TableCell>{statement.type}</TableCell>
                  <TableCell
                    className={`${
                      statement.type === "payout_request"
                        ? "text-yellow-500"
                        : statement.type === "payout" ||
                          statement.type === "refunded"
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
    </div>
  );
};

export default AdminSrkBankPage;
