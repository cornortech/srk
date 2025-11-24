import { Input, Button, Card, CardBody } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import {
  PasswordResetFormValues,
  passwordResetSchema,
} from "../../../pages/schema/PasswordResetSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordApi } from "../../../lib/apiClient";
import useAuthStore from "../../../store/useAuth";
import useAlert from "../../../hooks/useAlert";

export const UpdatePassword = () => {
  const { userDetails } = useAuthStore();
  const { show } = useAlert();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (password: string) => {
      const userId = userDetails?._id;
      if (!userId) return;
      await updatePasswordApi(userId, password);
    },
    onSuccess: () => {
      show("Password updated successfully", "success");
    },
    onError: () => {
      show("Failed to update password", "error");
    },
  });

  const onSubmit = (data: PasswordResetFormValues) => {
    mutate(data.password);
  };

  return (
    <div>
      <Card className=" w-[100%] bg-bgSecondary">
        <CardBody>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="New Password"
              type="password"
              {...register("password")}
              placeholder="Enter new password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
            <Input
              label="Confirm Password"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
            {/* <Button color="primary" className="text-black">
              Send OTP
            </Button> */}
            {/* <Input label="OTP" placeholder="Enter OTP" /> */}
            <Button color="primary" className="text-black" type="submit">
              {isPending ? "Updating..." : " Update Password"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
