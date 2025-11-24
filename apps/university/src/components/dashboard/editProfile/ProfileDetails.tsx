import {
  // Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { countries } from "../../../Data/Countries";
import { TUser } from "../../../lib/types/entities";
import { useForm } from "react-hook-form";
import {
  UpdateProfileFormValues,
  updateProfileSchema,
} from "../../../pages/schema/UpdateProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { updateUserDetailsApi } from "../../../lib/apiClient";
import useAlert from "../../../hooks/useAlert";

interface ProfileDetailsProps {
  userDetails: TUser;
}

export const ProfileDetails = ({ userDetails }: ProfileDetailsProps) => {
  const { register, handleSubmit } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      contactDetail: userDetails.phoneNumber,
      dateOfBirth: userDetails.dob.split("T")[0],
      gender: userDetails.gender,
      country: userDetails.country,
      isActive: userDetails.isActive,
    },
  });
  const { show } = useAlert();
  const { mutate } = useMutation({
    mutationFn: async (data: UpdateProfileFormValues) => {
      const userId = userDetails._id;
      await updateUserDetailsApi({
        data: {
          country: data.country,
          email: data.email,
          dob: data.dateOfBirth,
          firstName: data.firstName,
          gender: data.gender,
          lastName: data.lastName,
          phoneNumber: data.contactDetail,
          isActive: data.isActive,
        },
        userId,
      });
    },
    onSuccess: () => {
      show("Profile updated successfully", "success");
    },
    onError: () => {
      show("Failed to update profile", "error");
    },
  });

  const onSubmit = (data: UpdateProfileFormValues) => {
    mutate(data);
  };
  return (
    <div>
      <Card className="bg-bgSecondary p-4 w-full">
        <CardBody>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register("firstName")}
                label="First Name"
                placeholder="Enter your first name "
                disabled
              />
              <Input
                {...register("lastName")}
                label="Last Name"
                placeholder="Enter your last name"
                disabled
              />
            </div>
            <Input
              {...register("email")}
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              disabled
            />
            <Input
              {...register("contactDetail")}
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              disabled
            />
            {/* <Input label="Occupation" placeholder="Enter your occupation" /> */}
            <Input
              {...register("dateOfBirth")}
              label="Date of Birth"
              type="date"
              defaultChecked
              disabled
            />
            <Select
              {...register("gender")}
              label="Gender"
              placeholder="Select your Gender"
              disabled
            >
              {["Male", "Female", "Other"].map((gender) => (
                <SelectItem isSelected key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </Select>
            <Select
              {...register("country")}
              label="Country"
              placeholder="Select your country"
              disabled
            >
              {countries.map((country) => (
                <SelectItem key={country.name} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </Select>

            {/* <Button color="primary" className="text-black" type="submit">
              Save Changes
            </Button> */}
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
