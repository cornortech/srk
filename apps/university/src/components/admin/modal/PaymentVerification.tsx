import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";
import { TGetAllUsersAdmin } from "../../../lib/types";

interface IPaymentVerification {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  user: TGetAllUsersAdmin;
  isApproving: boolean;
  isRejecting: boolean;
}

export function PaymentVerification({
  isOpen,
  onClose,
  user,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: IPaymentVerification) {
  const [rejectionReason, setRejectionReason] = useState("");

  // Mutation for updating user permissions

  const displayKycActionButtons =
    user.status === "PAYMENT_VERIFICATION_PENDING";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <ModalHeader className="text-2xl font-bold">
          Course Payment Details
        </ModalHeader>
        <ModalBody className="space-y-4">
          {/* Verification Image */}
          <div className="flex flex-col items-start gap-y-2">
            <h3 className="font-semibold">Verification Image</h3>
            {user.paymentDetails?.paymentProofUrl ? (
              <a href={user.paymentDetails?.paymentProofUrl} target="_blank">
                <img
                  src={user.paymentDetails?.paymentProofUrl}
                  alt="Verification"
                  className="w-20 h-20 rounded-md object-cover"
                />
              </a>
            ) : (
              "-"
            )}
          </div>
          <Divider />

          {/* KYC Document Details */}
          <div className="space-y-3">
            <div className="flex gap-x-4">
              <div>
                <h3 className="font-semibold">Transaction Id </h3>
                <p>{user?.paymentDetails?.transactionId || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Payment Method</h3>
                <p>{user?.paymentDetails?.paymentMethod || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Payment Type</h3>
                <p>{user?.paymentDetails?.paymentType || "-"}</p>
              </div>
            </div>
            <div className="flex gap-x-4">
              <div>
                <h3 className="font-semibold">Package Type</h3>
                <p>{user?.packageId?.title || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Senior</h3>
                <p>
                  {user?.referredBy
                    ? `${user?.referredBy?.firstName} ${user?.referredBy?.lastName}`
                    : "No senior"}
                </p>
              </div>
            </div>
          </div>
          <Divider />

          {/* Rejection Reason */}
          {displayKycActionButtons && (
            <div>
              <h3 className="font-semibold mb-2">
                Rejection Reason (if applicable)
              </h3>
              <Textarea
                placeholder="Enter reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          )}
        </ModalBody>

        {/* Footer Buttons */}
        <ModalFooter className="flex justify-end gap-2">
          {displayKycActionButtons && (
            <>
              {isRejecting ? (
                <Button color="danger" disabled>
                  Rejecting...
                </Button>
              ) : (
                <Button color="danger" onPress={() => onReject(rejectionReason)}>
                  Reject
                </Button>
              )}
              {isApproving ? (
                <Button color="success" disabled>
                  Approving...
                </Button>
              ) : (
                <Button color="success" onPress={onApprove}>
                  Approve
                </Button>
              )}
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
