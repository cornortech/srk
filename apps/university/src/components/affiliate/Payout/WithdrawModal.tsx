import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import useAuthStore from "../../../store/useAuth";
import { BanknoteIcon, Handshake, PiggyBank, User2Icon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createBalancePayoutApi } from "../../../lib/apiClient";
import useAlert from "../../../hooks/useAlert";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type PayoutDetailsModalProps = {
  isOpen: boolean;
  balance: number;
  onClose: () => void;
};

export function BalanceWithDrawModal({
  balance,
  isOpen,
  onClose,
}: PayoutDetailsModalProps) {
  const { userDetails } = useAuthStore();
  const [withDrawalAmount, setWithdrawalAmount] = useState(0);
  const navigate = useNavigate();
  const { show } = useAlert();
  const { mutate } = useMutation({
    mutationKey: ["payout"],
    mutationFn: async () => {
      const userId = userDetails?._id;
      if (!userId) return;

      await createBalancePayoutApi(userId, withDrawalAmount);
    },
    onSuccess: () => {
      show("Credit transfer request submitted", "success");
      navigate("/affiliate/bank");
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data?.message || "Credit transfer request failed", "error");
    },
  });
  const handleCompletePayout = async () => {
    if (withDrawalAmount > balance) {
      show("Insufficient balance", "error");
      return;
    }
    mutate();
  };

  const withDrawalAmountAfterTDS = (withDrawalAmount * 0.85).toFixed(2);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <ModalHeader className="text-2xl font-bold">
          Credit Transfer Details
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-row items-center gap-4">
              <PiggyBank /> <h3 className="font-semibold">Account Name</h3>
              <p className="">{userDetails?.email}</p>
            </div>
            <div className="flex flex-row items-center gap-4">
              <BanknoteIcon />
              <h3 className="font-semibold">Bank Name</h3>
              <p className="">SRK BANK LIMITED</p>
            </div>
            <div className="flex flex-row items-center gap-4">
              <User2Icon /> <h3 className="font-semibold">Account Type</h3>
              <p className="">Web Bank</p>
            </div>

            <div className="flex flex-row items-center gap-4">
              <Handshake />
              <h3 className="font-semibold">Relationship with Bank</h3>
              <p className="">Self</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <b className="text-red-500">15% TDS deducted on credit transfer.</b>
            <Input
              label="Credits available for transfer"
              type="number"
              placeholder={balance.toFixed(2)}
              disabled
            />
            <Input
              label="Transfer amount after TDS"
              type="number"
              placeholder={withDrawalAmountAfterTDS.toString()}
              disabled
            />
            <Input
              value={withDrawalAmount.toString()}
              onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
              label="Transfer Amount"
              type="number"
              placeholder="0.00"
              variant="faded"
            />
          </div>
        </ModalBody>
        {/* Footer Buttons */}
        <ModalFooter className="flex justify-end flex-col gap-2">
          <Button onPress={handleCompletePayout} color="primary">
            Request Credit Transfer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
