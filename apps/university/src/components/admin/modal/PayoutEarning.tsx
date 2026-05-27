import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";

interface PayoutEarningProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (number: number) => void;
  onReject: (reason: string) => void;
  totalAmountAvailable: number;
  title: string;
  isPending?: boolean;
}

export function PayoutEarning({
  isOpen,
  onClose,
  totalAmountAvailable,
  onApprove,
  isPending = false,
  title,
}: PayoutEarningProps) {
  const [payoutAmount, setPayoutAmount] = useState(0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    if (amount > totalAmountAvailable) {
      return;
    }
    setPayoutAmount(Number(e.target.value));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <ModalHeader className="text-2xl font-bold">{title}</ModalHeader>
        <ModalBody className="space-y-4">
          <Input
            label="Amount Available"
            placeholder="Amount available"
            value={totalAmountAvailable.toString()}
          />
          <Input
            label="Transfer Amount"
            placeholder="Enter transfer amount"
            type="number"
            value={payoutAmount.toString()}
            onChange={handleAmountChange}
          />
        </ModalBody>

        {/* Footer Buttons */}
        <ModalFooter className="flex justify-end  gap-2">
          <>
            <Button color="danger" onPress={() => onClose()}>
              Cancel
            </Button>
            <Button
              color="success"
              disabled={isPending}
              onPress={() => {
                if (isPending) return;
                onApprove(payoutAmount);
              }}
            >
              {isPending ? "Processing..." : "Approve Transfer"}
            </Button>
          </>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
