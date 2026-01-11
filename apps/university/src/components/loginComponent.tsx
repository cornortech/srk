"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "../pages/schema/SignUpSchema";
import { Image } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { PrimaryButton } from "./ReusableComponents";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../lib/apiClient";
import AuthLocalStorage from "../lib/localstorage/auth";
import useAlert from "../hooks/useAlert";
import { AxiosError } from "axios";

export function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const { show } = useAlert();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const { mutate } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await loginApi(data);
      if (res.success) {
        AuthLocalStorage.storeUserData("user", {
          _id: res.user._id,
          email: res.user.email,
          role: res.user.role,
          redirectionUrl: res.user.redirectionUrl,
        });
        show("Login successfull", "success");
        
        // Handle cross-domain redirects for multi-domain admin SSO
        if (res.user.redirectionUrl.startsWith('http://') || res.user.redirectionUrl.startsWith('https://')) {
          window.location.href = res.user.redirectionUrl;
        } else {
          navigate(res.user.redirectionUrl);
        }
        // if (res.user.status === "PORTAL_ACTIVATED") {
        //   navigate("/study");
        // } else if (
        //   res.user.status === "KYC_VERIFICATION_REJECTED" ||
        //   res.user.status === "KYC_VERIFICATION_PENDING" ||
        //   res.user.status === "REGISTERED"
        // ) {
        //   navigate("/auth/kyc-verification");
        // }
      }
      return res;
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      show(error.response?.data?.message || "Failed to login", "error");
    },
  });

  async function onSubmit(data: LoginFormValues) {
    mutate(data);
  }

  const inputStyle =
    "w-full bg-bgPrimary text-textPrimary px-4 py-4 text-xs rounded-md outline-none border border-slate-50 border-opacity-50";

  const labelStyle =
    "absolute -top-2 left-2 bg-bgSecondary px-1 text-xs text-textPrimary";
  return (
    <div className="absolute top-0  w-full h-screen flex justify-center items-center  px-6 py-8  rounded-lg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" lg:w-1/3 space-y-6 bg-bgSecondary py-6 px-10 rounded-xl"
      >
        <h1 className="text-textPrimary text-xl font-semibold">Login</h1>

        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="email" className={labelStyle}>
              Email Address
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="w-full bg-bgPrimary text-textPrimary px-4 py-4 text-xs rounded-md outline-none border border-slate-50 border-opacity-50 focus:border-primary focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-danger text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="flex-1 relative">
            <label htmlFor="firstName" className={labelStyle}>
              Password
            </label>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className={inputStyle}
              placeholder="Enter your password"
            />
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <Eye size={20} className="text-textPrimary" />
              ) : (
                <EyeOff size={20} className="text-textPrimary" />
              )}
            </div>
            {errors.password && (
              <p className="text-danger text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
        <PrimaryButton label="Login" className="w-full " type="submit" />

        <p className="text-textPrimary">
          If you don’t have an account{" "}
          <Link to="/packages">
            <span className="text-primary underline">Signup</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export const LoginContent = () => {
  return (
    <div>
      <Image src="/login.png" alt="login" width={600} />
    </div>
  );
};
