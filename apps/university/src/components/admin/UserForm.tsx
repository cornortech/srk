import { useForm, Controller } from "react-hook-form";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { applyPromocodeApi, getAllPackagesApi } from "../../lib/apiClient";
import { TPackage } from "../../lib/types/entities";
import { TAddUserPayload, TPromoCodeDetails } from "../../lib/types";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import useAlert from "../../hooks/useAlert";
import { PurposeOptions } from "../SignUpComponent";

interface UserFormProps {
  onAddUser: (user: TAddUserPayload) => void;
  isAdding: boolean;
}

export default function UserForm({ onAddUser, isAdding }: UserFormProps) {
  const { control, handleSubmit, getValues, watch } =
    useForm<TAddUserPayload>();
  const { show } = useAlert();
  const [promocodeError, setPromocodeError] = useState<string | null>(null);

  const [promoCodeDetails, setPromoCodeDetails] =
    useState<null | TPromoCodeDetails>(null);

  const { mutate: mutatePromocode } = useMutation({
    mutationFn: async (promocode: string) => {
      const res = await applyPromocodeApi(promocode);
      return res;
    },
    onSuccess(data) {
      setPromoCodeDetails({ ...data });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      setPromocodeError(error.response?.data?.message || "Invalid promocode");
    },
  });

  const { data: packages } = useQuery<TPackage[] | undefined>({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await getAllPackagesApi();
      return res;
    },
  });
  const onSubmit = (data: TAddUserPayload) => {
    onAddUser(data);
  };

  const handleApplyPromoCode = () => {
    const promoCode = getValues("referredBy");
    if (promoCode) {
      mutatePromocode(promoCode);
    } else {
      show("Please enter promocode", "error");
      setPromoCodeDetails(null);
    }
  };

  const promoCode = watch("referredBy");
  useEffect(() => {
    console.log("inside useeffect", promoCode, promoCodeDetails);
    if (promoCodeDetails && promoCode !== promoCodeDetails.referralCode) {
      setPromoCodeDetails(null);
    }
  }, [promoCode, promoCodeDetails]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <Controller
          name="firstName"
          control={control}
          defaultValue=""
          rules={{ required: "First name is required" }}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label="First Name"
              placeholder="Enter your first name"
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          defaultValue=""
          rules={{ required: "Last name is required" }}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label="Last Name"
              placeholder="Enter your last name"
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              type="email"
              label="Email"
              placeholder="Enter your email"
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          name="referredBy"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              label="Referral Code"
              placeholder="Enter referral code (optional)"
            />
          )}
        />
        <Controller
          name="dob"
          control={control}
          defaultValue=""
          rules={{ required: "Date is required" }}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              type="date"
              label="Date"
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          name="country"
          control={control}
          defaultValue=""
          rules={{ required: "Country is required" }}
          render={({ field, fieldState: { error } }) => (
            <Select
              {...field}
              label="Country"
              placeholder="Select gender"
              isInvalid={!!error}
              errorMessage={error?.message}
            >
              <SelectItem key="Nepal" value="Nepal">
                Nepal
              </SelectItem>
              <SelectItem key="India" value="India">
                India
              </SelectItem>
              <SelectItem key="Bangladesh" value="Bangladesh">
                Bangladesh
              </SelectItem>
            </Select>
          )}
        />
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          rules={{ required: "Gender is required" }}
          render={({ field, fieldState: { error } }) => (
            <Select
              {...field}
              label="Gender"
              placeholder="Select gender"
              isInvalid={!!error}
              errorMessage={error?.message}
            >
              <SelectItem key="male" value="male">
                Male
              </SelectItem>
              <SelectItem key="female" value="female">
                Female
              </SelectItem>
              <SelectItem key="other" value="other">
                Other
              </SelectItem>
            </Select>
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          defaultValue=""
          rules={{
            required: "Contact number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Invalid contact number",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              type="tel"
              label="Contact Number"
              placeholder="Enter your contact number"
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          )}
        />
        {packages && (
          <Controller
            name="packageId"
            control={control}
            defaultValue=""
            rules={{ required: "At least one Package is required" }}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                label="Packages"
                placeholder="Select Packages"
                isInvalid={!!error}
                errorMessage={error?.message}
              >
                {packages.map((pkg) => (
                  <SelectItem key={pkg._id} value={pkg._id}>
                    {pkg.title}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        )}
        <Controller
          name="purpose"
          control={control}
          defaultValue="study"
          rules={{ required: "Purpose is required" }}
          render={({ field, fieldState: { error } }) => (
            <Select
              {...field}
              label="Purposes"
              placeholder="Select Purpose"
              isInvalid={!!error}
              errorMessage={error?.message}
            >
              {PurposeOptions.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </div>
      {promoCodeDetails && (
        <div className="space-y-1 text-gray-300">
          <div className="text-green-500">Code applied successfully!</div>
          <div>
            Name: {`${promoCodeDetails.firstName} ${promoCodeDetails.lastName}`}
          </div>
          <div>
            Mobile:{" "}
            {promoCodeDetails.phoneNumber.slice(0, -3).replace(/\d/g, "*") +
              promoCodeDetails.phoneNumber.slice(-3)}
          </div>
        </div>
      )}
      {promocodeError && (
        <div className="space-y-1 text-red-600">
          <div>{promocodeError}</div>
        </div>
      )}
      <div className="flex gap-x-2 items-center">
        <Button
          className="px-6 py-4 bg-yellow-600"
          onPress={handleApplyPromoCode}
        >
          Apply Promocode
        </Button>
        <Button
          type="submit"
          className="px-6 py-4 bg-yellow-600"
          disabled={isAdding}
        >
          {!isAdding ? " Add User" : "Addingg..."}
        </Button>
      </div>
    </form>
  );
}
