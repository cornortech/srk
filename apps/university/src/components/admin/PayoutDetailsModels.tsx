import { useState } from "react";
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { TBalancePayout } from "../../lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  approveBalancePayoutApi,
  getUserDetailsApi,
  rejectBalancePayoutApi,
} from "../../lib/apiClient";
import { AxiosError } from "axios";
import useAlert from "../../hooks/useAlert";
import { getUniversityAssetUrl } from "../../lib/cdn";

type PayoutDetailsModalProps = {
  isOpen: boolean;
  payout: TBalancePayout;
  onClose: () => void;
  handleRefetch: () => void;
};

export function PayoutDetailsModal({
  isOpen,
  payout,
  onClose,
  handleRefetch,
}: PayoutDetailsModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");
  const { show } = useAlert();

  const { data: payoutUserDetails } = useQuery({
    queryKey: ["userDetails", payout.userId],
    queryFn: async () => {
      const data = await getUserDetailsApi(payout.userId);
      return data;
    },
  });

  const { mutate: approveMutation } = useMutation({
    mutationFn: () => {
      return approveBalancePayoutApi(payout._id, "bank", transactionNumber);
    },
    onSuccess: () => {
      handleRefetch();
      show("Payout approved successfully", "success");
      setRejectionReason("");
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      show(error.response?.data?.message || "Failed to approve", "error");
    },
  });
  const { mutate: rejectMutation } = useMutation({
    mutationFn: () => {
      return rejectBalancePayoutApi(payout._id, rejectionReason);
    },
    onSuccess: () => {
      handleRefetch();
      show("Payout rejected successfully", "success");
      setRejectionReason("");
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      show(error.response?.data?.message || "Failed to reject", "error");
    },
  });
  const handleCompletePayout = async () => {
    approveMutation();
  };

  const handleRejectPayout = async () => {
    if (!rejectionReason) {
      alert("Please provide a reason for rejection");
      return;
    }
    rejectMutation();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <ModalHeader className="text-lg font-bold">Payout Details</ModalHeader>
        <ModalBody className="space-y-4">
          {/* User & Payment Details */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="User ID" value={payout.userId} readOnly />
            <Input label="Username" value={payout.username} readOnly />
            <Input
              label="User Email"
              value={payoutUserDetails?.userDetails?.email}
              readOnly
            />
            <Input label="Amount" value={`Rs.${payout.amount}`} readOnly />
            <Input
              label="Account Number"
              value={payoutUserDetails?.bankDetails?.accountNumber}
              readOnly
            />
            <Input
              label="Bank Name"
              value={payoutUserDetails?.bankDetails?.bankName}
              readOnly
            />
          </div>

          {/* Rejection Reason (Only Visible When Rejecting) */}
          {isRejecting && (
            <Textarea
              label="Rejection Reason"
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          )}
          <Input
            label="Transaction Number"
            type="text"
            value={transactionNumber}
            onChange={(e) => setTransactionNumber(e.target.value)}
          />

          {payout.qrUrl ? (
            <div className="cursor-pointer">
              <h1 className="font-medium text-medium">QR Code</h1>
              <Image
                onClick={() => window.open(getUniversityAssetUrl(payout.qrUrl), "_blank")}
                width={100}
                height={100}
                className="object-cover"
                src={getUniversityAssetUrl(payout.qrUrl)}
              />
            </div>
          ) : (
            <h1 className="font-medium text-medium text-red-500">No QR Code</h1>
          )}
        </ModalBody>

        {/* Footer Buttons */}
        {payout.status === "pending" ? (
          <ModalFooter className="flex justify-end gap-2">
            <Button onPress={handleCompletePayout} className="bg-blue-700">
              Complete Payout
            </Button>
            <Button
              // color={isRejecting ? "danger" : "primary"}
              className="bg-red-600"
              onPress={() => {
                if (isRejecting) {
                  handleRejectPayout();
                } else {
                  setIsRejecting(true);
                }
              }}
            >
              {isRejecting ? "Confirm Rejection" : "Reject Payout"}
            </Button>
          </ModalFooter>
        ) : (
          ""
        )}
      </ModalContent>
    </Modal>
  );
}
