"use client";

import { Card, CardBody } from "@nextui-org/card";
// import { Divider } from "@nextui-org/divider";
import { DollarSign, Users, Calendar, PieChart, Landmark } from "lucide-react";
// import { Overview } from "../../components/admin/Earning/Overview";
// import { AffiliatePayments } from "../../components/admin/Earning/AffilitatePayments";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  adminBalancePayoutToSrkUniversityApi,
  getAdminEarningDetailsApi,
} from "../../lib/apiClient";
import { TAdminEarnings, TAdminEarningType } from "../../lib/types";
import { PayoutEarning } from "../../components/admin/modal/PayoutEarning";
import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import useAlert from "../../hooks/useAlert";
import { TimeBreakdownCard } from "../../components/admin/Earning/FinancialTimeBreakDownCard";

export default function DashboardPage() {
  const { data, refetch: refetchEarning } = useQuery<TAdminEarnings | null>({
    queryKey: ["earning"],
    queryFn: async () => {
      const res = await getAdminEarningDetailsApi();
      return res;
    },
  });
  const [payoutModal, setPayoutModal] = React.useState(false);
  const [payoutType, setPayoutType] = useState<TAdminEarningType | null>(null);
  const [totalAmountAvailable, setTotalAmountAvailable] = useState(0);
  const { show } = useAlert();

  const handleOnClickPayoutButton = (
    payoutType: TAdminEarningType,
    totalAmountAvailable: number
  ) => {
    setPayoutType(payoutType);
    setTotalAmountAvailable(Number(totalAmountAvailable));
    setPayoutModal(true);
  };

  const { mutate: handleCompletePayoutMutation } = useMutation({
    mutationFn: async (data: {
      payoutType: TAdminEarningType;
      amount: string;
    }) => {
      await adminBalancePayoutToSrkUniversityApi(data.payoutType, +data.amount);
    },
    onSuccess: () => {
      setPayoutModal(false);
      refetchEarning();
      show("Balance deposited to Srk university bank", "success");
    },
    onError: () => {
      show("Failed to deposit balance", "error");
    },
  });

  const handleApprovePayout = (amount: number) => {
    if (payoutType) {
      handleCompletePayoutMutation({
        payoutType: payoutType as TAdminEarningType,
        amount: amount.toString(),
      });
    }
  };

  if (!data) return <div></div>;
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TimeBreakdownCard
          title="Company Turnover"
          icon={<DollarSign className="h-4 w-4 text-default-400" />}
          data={{
            allTime: 100000,
            thirtyDays: 30000,
            sevenDays: 7000,
            today: 1000,
          }}
        />
        <TimeBreakdownCard
          title="CEO Wallet"
          icon={<Users className="h-4 w-4 text-default-400" />}
          data={{
            today: 1233,
            sevenDays: 4567,
            thirtyDays: 8900,
            allTime: 12345,
          }}
        />
        <TimeBreakdownCard
          title="Event Wallet"
          icon={<Calendar className="h-4 w-4 text-default-400" />}
          payoutFn={() =>
            handleOnClickPayoutButton("eventWallet", data.eventWallet)
          }
          data={{
            allTime: 5000,
            thirtyDays: 1500,
            sevenDays: 350,
            today: 100,
          }}
        />
        <TimeBreakdownCard
          title="Distribution Amount"
          icon={<Calendar className="h-4 w-4 text-default-400" />}
          data={{
            allTime: 5000,
            thirtyDays: 1500,
            sevenDays: 350,
            today: 100,
          }}
        />
        <TimeBreakdownCard
          title="Net Company Turnover"
          icon={<Calendar className="h-4 w-4 text-default-400" />}
          data={{
            allTime: 5000,
            thirtyDays: 1500,
            sevenDays: 350,
            today: 100,
          }}
        />

        {/* Add other cards similarly... */}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* <Card className="bg-bgSecondary">
          <CardBody>
            <div className="flex justify-between items-center">
              <p className="text-sm">Total Turnover</p>
              <DollarSign className="h-4 w-4 text-default-400" />
            </div>
            <div className="text-2xl font-bold">Rs.{data.companyTurnover}</div>
            <p className="text-xs text-default-400">+20.1% from last month</p>
          </CardBody>
        </Card> */}

        {/* <Card className="bg-bgSecondary">
          <CardBody>
            <div className="flex justify-between items-center">
              <p className="text-sm">CEO Wallet</p>
              <DollarSign className="h-4 w-4 text-default-400" />
            </div>
            <div className="text-2xl font-bold">Rs.{data.ceoSalary}</div>
            <p className="text-xs text-default-400">+19% from last month</p>
            <Button
              className="mt-4 w-fit"
              color="primary"
              size="sm"
              onPress={() =>
                handleOnClickPayoutButton("ceoSalary", data.ceoSalary)
              }
            >
              Payout
              <Landmark size={16} />
            </Button>
          </CardBody>
        </Card> */}
        <Card className="bg-bgSecondary">
          <CardBody>
            <div className="flex justify-between items-center">
              <p className="text-sm">Office Management Charge</p>
              <Calendar className="h-4 w-4 text-default-400" />
            </div>
            <div className="text-2xl font-bold">
              Rs.{data.officeManagementCharge}
            </div>
            <p className="text-xs text-default-400">+201 since last hour</p>
            <Button
              className="mt-4 w-fit"
              color="primary"
              size="sm"
              onPress={() =>
                handleOnClickPayoutButton(
                  "officeManagementCharge",
                  data.officeManagementCharge
                )
              }
            >
              Payout
              <Landmark size={16} />
            </Button>
          </CardBody>
        </Card>

        <Card className="bg-bgSecondary">
          <CardBody>
            <div className="flex justify-between items-center">
              <p className="text-sm">TDS Amount</p>
              <PieChart className="h-4 w-4 text-default-400" />
            </div>
            <div className="text-2xl font-bold">Rs.{data.tdsAmount}</div>
            <p className="text-xs text-default-400">15% of total turnover</p>
            <Button
              className="mt-4 w-fit"
              color="primary"
              size="sm"
              onPress={() =>
                handleOnClickPayoutButton("tdsAmount", data.tdsAmount)
              }
            >
              Payout
              <Landmark size={16} />
            </Button>
          </CardBody>
        </Card>
        <Card className="bg-bgSecondary">
          <CardBody>
            <div className="flex justify-between items-center">
              <p className="text-sm">Pending Distribution</p>
              <Users className="h-4 w-4 text-default-400" />
            </div>
            <div className="text-2xl font-bold">
              Rs.{data.pendingDistribution}
            </div>
            <p className="text-xs text-default-400">+180.1% from last month</p>
          </CardBody>
        </Card>
        <Card className="bg-bgSecondary">
          <CardBody>
            <div className="flex justify-between items-center">
              <p className="text-sm">Company Wallet</p>
              <Users className="h-4 w-4 text-default-400" />
            </div>
            <div className="text-2xl font-bold">
              Rs.{data.pendingDistribution}
            </div>
            <p className="text-xs text-default-400">+180.1% from last month</p>
          </CardBody>
        </Card>
      </div>
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-bgSecondary">
          <CardHeader>
            <h3 className="text-xl font-semibold">Overview</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <Overview />
          </CardBody>
        </Card>

        <Card className="col-span-3 bg-bgSecondary">
          <CardHeader>
            <h3 className="text-xl font-semibold">
              Affiliate Marketer's Event Payments
            </h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <AffiliatePayments />
          </CardBody>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-bgSecondary">
          <CardHeader>
            <h3 className="text-xl font-semibold">Financial Summary</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Turnover:</span>
                <span className="text-sm font-bold">$45,231.89</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">TDS Amount (15%):</span>
                <span className="text-sm font-bold">$6,784.78</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Amount after TDS:</span>
                <span className="text-sm font-bold">$38,447.11</span>
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Distribution:</span>
                <span className="text-sm font-bold">$12,234.56</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">CEO Wallet:</span>
                <span className="text-sm font-bold">$4,523.19</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Office Management Charge:</span>
                <span className="text-sm font-bold">$2,261.59</span>
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Net Company Turnover:
                </span>
                <span className="text-sm font-bold">$19,427.77</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div> */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"></div>
      {payoutType && (
        <PayoutEarning
          title="Payout"
          totalAmountAvailable={totalAmountAvailable}
          isOpen={payoutModal}
          onClose={() => setPayoutModal(false)}
          onApprove={handleApprovePayout}
          onReject={() => setPayoutModal(false)}
        />
      )}
    </div>
  );
}
