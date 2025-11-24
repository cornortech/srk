import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserDetailsApi } from "../../../lib/apiClient";
import useAlert from "../../../hooks/useAlert";
import { TGetAllUsersAdmin, TUpdateUserDetails } from "../../../lib/types";
import { TUser } from "../../../lib/types/entities";

interface VerifyKYCModalProps {
  userId: string;
  isAllowedToAddUser: boolean;
  courseEnrollAgreementUrl?: string;
  isOpen: boolean;
  onClose: () => void;
  verificationImage: string;
  documentType: string;
  documentName: string;
  frontImage: string;
  backImage: string;
  onApprove: () => void;
  onReject: (reason: string) => void;
  status?:
    | "REGISTERED"
    | "PAYMENT_VERIFICATION_PENDING"
    | "PAYMENT_VERIFICATION_APPROVED"
    | "PAYMENT_VERIFICATION_REJECTED"
    | "KYC_VERIFICATION_REJECTED"
    | "KYC_VERIFICATION_PENDING"
    | "PORTAL_ACTIVATED"
    | "PORTAL_DEACTIVATED";
  data: TGetAllUsersAdmin | null;
}

export function VerifyKYCModal({
  data,
  userId,
  isOpen,
  onClose,
  verificationImage,
  documentType,
  documentName,
  frontImage,
  backImage,
  onApprove,
  onReject,
  status,
  courseEnrollAgreementUrl,
  isAllowedToAddUser,
}: VerifyKYCModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isAllowed, setIsAllowed] = useState(isAllowedToAddUser);
  const { show } = useAlert();
  const queryClient = useQueryClient();

  const userDetails = {
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    phoneNumber: data?.phoneNumber || "",
    gender: data?.gender || "Male",
    dob: data?.dob,
    country: data?.country || "",
    email: data?.email || "",
    purpose: data?.purpose || "",
    packageId: data?.packageId?._id || "",
    status: data?.status || "",
    referredBy: data?.referredBy
      ? `${data.referredBy.firstName} ${data.referredBy.lastName}`
      : "",
    hasSrkBonusDeposited: false,
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<TUpdateUserDetails>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      gender: undefined, // Set default value for gender
      dob: "",
      country: "",
      email: "",
      purpose: undefined,
    },
  });

  useEffect(() => {
    if (isOpen && data) {
      reset({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber || "",
        gender: data.gender || undefined, // Fallback to "Male" if data.gender is empty
        dob: data.dob.toString() || "",
        country: data.country || "",
        email: data.email || "",
        purpose: data.purpose || undefined,
      });
    }
  }, [isOpen, data, reset]);

  useEffect(() => {
    setIsAllowed(isAllowedToAddUser);
  }, [isAllowedToAddUser]);

  const updateUserPermission = useMutation({
    mutationFn: async (allowed: boolean) => {
      return await updateUserDetailsApi({
        userId,
        data: {
          allowedToAddUsers: allowed,
        },
      });
    },
    onSuccess: () => {
      show("User permission updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (error) => {
      show("Failed to update user permission", "error");
      console.error(error);
    },
  });

  const updateUserDetailsMutation = useMutation({
    mutationFn: async (data: TUpdateUserDetails) => {
      return await updateUserDetailsApi({ userId, data });
    },
    onSuccess: () => {
      show("User details updated", "success");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
      onClose();
    },
    onError: () => {
      show("Failed to update user details", "error");
    },
  });

  const handleSwitchChange = (checked: boolean) => {
    setIsAllowed(checked);
    updateUserPermission.mutate(checked);
  };

  const handleFormSubmit = (formData: Partial<TUser>) => {
    const filteredData = { ...formData };
    delete filteredData.packageId;
    delete filteredData.status;
    delete filteredData.hasSrkBonusDeposited;
    delete filteredData.referredBy;

    updateUserDetailsMutation.mutate(filteredData);
  };

  const displayKycActionButtons =
    status === "KYC_VERIFICATION_PENDING" ||
    status === "KYC_VERIFICATION_REJECTED";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="text-2xl font-bold">KYC Details</ModalHeader>
        <ModalBody className="space-y-4">
          <div className="flex flex-col items-start gap-y-2">
            <h3 className="font-semibold">Verification Image</h3>
            {verificationImage ? (
              <a href={verificationImage} target="_blank">
                <img
                  src={verificationImage}
                  alt="Verification"
                  className="w-20 h-20 rounded-md object-cover"
                />
              </a>
            ) : (
              "-"
            )}
          </div>
          <Divider />

          <div className="space-y-3">
            <div className="flex gap-x-4">
              <div>
                <h3 className="font-semibold">KYC Document Type</h3>
                <p>{documentType || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold">KYC Document Name</h3>
                <p>{documentName || "-"}</p>
              </div>
            </div>
            <div className="flex flex-row justify-start gap-x-4">
              <div className="flex flex-col items-center gap-y-2">
                <h3 className="font-semibold">Front Image</h3>
                {frontImage ? (
                  <a href={frontImage} target="_blank">
                    <img
                      src={frontImage}
                      alt="Front"
                      className="w-20 h-20 rounded-md object-cover"
                    />
                  </a>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex flex-col items-center gap-y-2">
                <h3 className="font-semibold">Back Image</h3>
                {backImage ? (
                  <a href={backImage} target="_blank">
                    <img
                      src={backImage}
                      alt="Back"
                      className="w-20 h-20 rounded-md object-cover"
                    />
                  </a>
                ) : (
                  "-"
                )}
              </div>
            </div>
            {courseEnrollAgreementUrl && (
              <Button
                color="primary"
                as="a"
                target="_blank"
                href={courseEnrollAgreementUrl}
              >
                View Enrollment Agreement
              </Button>
            )}
          </div>
          <Divider />

          {displayKycActionButtons && (
            <div>
              <h3 className="font-semibold mb-2">Rejection Reason</h3>
              <Textarea
                placeholder="Enter reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          )}

          <div>
            <h3 className="font-semibold">Allow to add user</h3>
            <Switch
              isSelected={isAllowed}
              onValueChange={handleSwitchChange}
              isDisabled={updateUserPermission.isPending}
            />
          </div>

          <Divider />
          <h2 className="font-bold">User Details</h2>
          <form
            className="grid grid-cols-2 gap-4"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => <Input label="First Name" {...field} />}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => <Input label="Last Name" {...field} />}
            />
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => <Input label="Phone Number" {...field} />}
            />
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <label htmlFor="gender" className="text-sm font-medium">
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="mt-1 block w-full rounded-md  bg-transparent shadow-sm"
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
            />
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  label="DOB"
                  {...field}
                  value={field.value || ""}
                />
              )}
            />
            <Controller
              name="country"
              control={control}
              render={({ field }) => <Input label="Country" {...field} />}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input label="Email" {...field} />}
            />
            <Controller
              name="purpose"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <label htmlFor="purpose" className="text-sm font-medium">
                    Purpose
                  </label>
                  <select
                    id="purpose"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-transparent  focus:ring-opacity-50"
                  >
                    <option value="" disabled>
                      Choose purpose
                    </option>
                    <option value="affiliate">Affiliate</option>
                    <option value="study">Study</option>
                  </select>
                </div>
              )}
            />
            <Input
              label="Package Name"
              value={data?.packageId?.title || "N/A"}
              isReadOnly
            />
            <Input label="Status" value={userDetails.status} isReadOnly />
            <Input
              label="Referred By"
              value={userDetails.referredBy}
              isReadOnly
            />
            <Input
              label="SRK Bonus Deposited"
              value={userDetails.hasSrkBonusDeposited ? "Yes" : "No"}
              isReadOnly
            />
            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <Button
                type="submit"
                color="primary"
                isDisabled={!isDirty || updateUserDetailsMutation.isPending}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          {displayKycActionButtons && (
            <>
              <Button color="danger" onPress={() => onReject(rejectionReason)}>
                Reject
              </Button>
              <Button color="success" onPress={onApprove}>
                Approve
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
