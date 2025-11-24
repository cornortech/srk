import { Card, CardBody, CardHeader } from "@nextui-org/react";
import UserForm from "./UserForm";
import { useMutation } from "@tanstack/react-query";
import { createUserApi } from "../../lib/apiClient";
import { TAddUserPayload } from "../../lib/types";
import useAlert from "../../hooks/useAlert";
import { AxiosError } from "axios";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
  date: string;
  gender: string;
  contactNumber: string;
}

export function AddUsersSection() {
  const { show } = useAlert();
  const { mutate: addUserMutation, isPending } = useMutation({
    mutationFn: async (data: TAddUserPayload) => {
      await createUserApi({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        dob: data.dob,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        referredBy: data.referredBy,
        packageId: data.packageId,
        isAddedByUser: true,
        purpose: data.purpose,
      });
    },
    onSuccess: () => {
      show("User added successfully", "success");
      // reload window
      window.location.reload();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      show(error.response?.data?.message || "Failed to add user", "error");
    },
  });
  const handleAddUser = (data: TAddUserPayload) => {
    addUserMutation({
      country: data.country,
      dob: data.dob,
      email: data.email,
      firstName: data.firstName,
      gender: data.gender,
      isAddedByUser: true,
      lastName: data.lastName,
      packageId: data.packageId,
      phoneNumber: data.phoneNumber,
      referredBy: data.referredBy,
      purpose: data.purpose,
    });
  };

  return (
    <div className="space-y-8">
      <Card className="bg-bgSecondary">
        <CardHeader className="text-xl font-bold text-white">
          Add New User
        </CardHeader>
        <CardBody className="text-white">
          Fill out the form below to add a new user to your organization.
        </CardBody>
        <div>
          <UserForm isAdding={isPending} onAddUser={handleAddUser} />
        </div>
      </Card>
    </div>
  );
}
