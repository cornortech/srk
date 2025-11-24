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

interface VerifyBankRequestModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  profilePicture: string;
  username: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: string;
  relationWithAccount: string;
  qrUrl: string;
  status: "pending" | "approved" | "rejected";
  onApprove: (userId: string) => void;
  onReject: (userId: string, reason: string) => void;
}

export function VerifyBankRequestModal({
  userId,
  isOpen,
  onClose,
  profilePicture,
  accountHolderName,
  accountNumber,
  ifscCode,
  bankName,
  branchName,
  accountType,
  relationWithAccount,
  qrUrl,
  status,
  onApprove,
  onReject,
}: VerifyBankRequestModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  //   // Mutation for updating bank request status
  //   const updateBankRequestStatus = useMutation({
  //     mutationFn: async (newStatus: "approved" | "rejected") => {
  //       return await updateBankRequestApi({
  //         requestId: requestId,
  //         data: {
  //           status: newStatus,
  //         },
  //       });
  //     },
  //     onSuccess: () => {
  //       show("Bank request updated successfully", "success");
  //     },
  //     onError: (error) => {
  //       show("Failed to update bank request", "error");
  //       console.error("Failed to update bank request:", error);
  //     },
  //   });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <ModalHeader className="text-2xl font-bold">
          Bank Request Details
        </ModalHeader>
        <ModalBody className="space-y-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-start gap-y-2">
            <h3 className="font-semibold">Profile Picture</h3>
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-20 h-20 rounded-md object-cover"
              />
            ) : (
              "-"
            )}
          </div>
          <Divider />

          {/* Bank Details */}
          <div className=" flex space-x-3">
            <div className="flex flex-col flex-2 gap-y-4 ">
              <div className="flex gap-x-4">
                <div className="flex gap-3">
                  <h3 className="font-semibold">Account Holder Name</h3>
                  <p>{accountHolderName || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Account Number</h3>
                  <p>{accountNumber || "-"}</p>
                </div>
              </div>
              <div className="flex gap-x-4">
                <div>
                  <h3 className="font-semibold">IFSC Code</h3>
                  <p>{ifscCode || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Bank Name</h3>
                  <p>{bankName || "-"}</p>
                </div>
              </div>
              <div className="flex gap-x-4">
                <div>
                  <h3 className="font-semibold">Branch Name</h3>
                  <p>{branchName || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Account Type</h3>
                  <p>{accountType || "-"}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Relation with Account</h3>
                <p>{relationWithAccount || "-"}</p>
              </div>
            </div>
            <div className=" flex-1 justify-start flex flex-col gap-2">
              <a href={qrUrl} target="_blank">
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="w-full  h-[300px] object-cover"
                />
              </a>
              <Button
                color="primary"
                onPress={() => window.open(qrUrl, "_blank")}
              >
                View QR Code
              </Button>
            </div>
          </div>
          <Divider />

          {/* Rejection Reason */}
          {status !== "rejected" && (
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
          {
            <>
              {status !== "rejected" && (
                <Button
                  color="danger"
                  onPress={() => onReject(userId, rejectionReason)}
                >
                  Reject
                </Button>
              )}

              {status !== "approved" && (
                <Button color="success" onPress={() => onApprove(userId)}>
                  Approve
                </Button>
              )}
            </>
          }
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
