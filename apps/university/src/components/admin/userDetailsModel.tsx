import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Divider,
  Textarea,
} from "@nextui-org/react";
import { TAffiliateRequest } from "../../lib/types";
import { useState } from "react";
import { getUniversityAssetUrl } from "../../lib/cdn";

interface UserDetailsModalProps {
  user: TAffiliateRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (user: TAffiliateRequest) => void;
  onDecline: (user: TAffiliateRequest, reason: string) => void;
}

export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onAccept,
  onDecline,
}: UserDetailsModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">User Details</ModalHeader>
        <ModalBody>
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={getUniversityAssetUrl(user.profilePicture)}
              alt={`${user.firstName} ${user.lastName}`}
              className="rounded-full object-cover"
              width={60}
              height={60}
            />
            <div>
              <h3 className="text-lg font-semibold">{`${user.firstName} ${user.lastName}`}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Gender:</strong> {user.gender}
            </p>
            <p>
              <strong>User Status:</strong> {user.userStatus}
            </p>
            <p>
              <strong>Affiliate Status:</strong> {user.status}
            </p>
            <p>
              <strong>Requested At:</strong> {user.requestedAt}
            </p>
            <p>
              <strong>Agreement:</strong>{" "}
              <a
                href={user.affiliateAgreementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Agreement
              </a>
            </p>
          </div>
          <Divider />
          {/* add here verification image and biometric left thumb print image and right thumb print */}
          <div className="space-y-2">
            <p>
              <strong>Verification Image:</strong>
            </p>
            <Image
              src={getUniversityAssetUrl(user.verificationImage)}
              alt="Verification"
              className="w-20 h-20 rounded-md object-cover"
            />
          </div>
          <div>
            <p className="my-2">
              <strong>Thumb prints</strong>
            </p>
            <div className="flex gap-x-2">
              <div className="space-y-2">
                <p>
                  <strong>Left :</strong>
                </p>
                <Image
                  src={getUniversityAssetUrl(user.leftThumbPrint)}
                  alt="Left Thumb Print"
                  className="w-20 h-20 rounded-md object-cover"
                />
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Right :</strong>
                </p>
                <Image
                  src={getUniversityAssetUrl(user.rightThumbPrint)}
                  alt="Right Thumb Print"
                  className="w-20 h-20 rounded-md object-cover"
                />
              </div>
            </div>
          </div>
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
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-red-600"
            onPress={() => onDecline(user, rejectionReason)}
          >
            Decline
          </Button>
          <Button className="bg-blue-700" onPress={() => onAccept(user)}>
            Accept
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
