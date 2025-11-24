import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormValues, signupSchema } from "../pages/schema/SignUpSchema";
import { Button, Checkbox } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { PrimaryButton } from "./ReusableComponents";
import { useMutation } from "@tanstack/react-query";
import { applyPromocodeApi, registerApi } from "../lib/apiClient";
import { AxiosError } from "axios";
import {
  TPaymentMethod,
  TPromoCodeDetails,
  TRegisterPayload,
} from "../lib/types";
import { TPackage } from "../lib/types/entities";
import useAlert from "../hooks/useAlert";
import { SignupPaymentMethod } from "./signup/SignupPaymentMethod";
import useUploadFile from "../hooks/useFileUpload";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];
export const PurposeOptions = [
  { value: "study", label: "Study" },
  { value: "affiliate", label: "Affiliate" },
];

interface OrderDetails {
  quantity: number;
  basePrice: number;
  discount: number;
  total: number;
}

const inputStyle =
  "w-full bg-bgPrimary text-textPrimary px-4 py-4 text-xs rounded-md outline-none border border-slate-50 border-opacity-50 focus:border-primary focus:ring-0 focus:ring-primary";

const labelStyle =
  "absolute -top-2 left-2 bg-bgSecondary px-1 text-xs text-textPrimary";

interface SignupComponentProps {
  packageDetails: TPackage;
  referralCode?: string;
}

export type TPaymentDetails = {
  paymentProof: File | null;
  transactionId: string;
  paymentMethod?: TPaymentMethod;
};

export function SignupComponent({
  packageDetails,
  referralCode,
}: SignupComponentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [promoCodeDetails, setPromoCodeDetails] =
    useState<null | TPromoCodeDetails>(null);
  const [promocodeError, setPromocodeError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<TPaymentDetails>({
    paymentProof: null,
    transactionId: "",
    paymentMethod: undefined,
  });
  const [isRegisterring, setIsRegisterring] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [paymentView, setPaymentView] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    quantity: 1,
    basePrice: 0,
    discount: 0,
    total: 0,
  });
  const { show } = useAlert();
  const navigate = useNavigate();
  const { uploadFile } = useUploadFile();

  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      dateOfBirth: "",
      gender: undefined,
      promoCode: "",
      terms: false,
      contactDetail: "",
    },
  });

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const { mutate: mutateRegister } = useMutation({
    mutationFn: async (data: TRegisterPayload) => {
      const res = await registerApi(data);
      return res;
    },
    onSuccess: () => {
      setIsRegisterring(false);
      show(
        "Registration successful. System will verify your payment details soon.",
        "success"
      );
      navigate("/auth/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setIsRegisterring(false);
      show(error.response?.data?.message || "Failed to register", "error");
      setPromocodeError(error.response?.data?.message || "Failed to register");
    },
  });

  const { mutate: mutatePromocode } = useMutation({
    mutationFn: async (promocode: string) => {
      const res = await applyPromocodeApi(promocode);
      return res;
    },
    onSuccess(data) {
      setPromoCodeDetails(data);
      setPromocodeError(null);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setPromocodeError(error.response?.data?.message || "Invalid promocode");
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    if (!paymentDetails.paymentMethod || !paymentDetails.transactionId) {
      show("Please complete payment details", "error");
      return;
    }

    if (paymentDetails.paymentProof) {
      setIsRegisterring(true);
      try {
        const { url } = await uploadFile(paymentDetails.paymentProof, "image");
        mutateRegister({
          paymentType: "qr",
          email: data.email,
          gender: data.gender,
          paymentProofUrl: url,
          dob: data.dateOfBirth,
          country: data.country,
          lastName: data.lastName,
          password: data.password,
          firstName: data.firstName,
          referredBy: data.promoCode,
          phoneNumber: data.contactDetail,
          packageId: packageDetails._id || "",
          paymentMethod: paymentDetails.paymentMethod,
          transactionId: paymentDetails.transactionId,
          purpose: data.purpose,
        });
      } catch (err) {
        console.log(err);

        setIsRegisterring(false);
        show("Registration failed", "error");
      }
    }
  };

  const handleApplyPromoCode = (promoCode: string) => {
    if (promoCode) {
      mutatePromocode(promoCode);
    }
  };

  const updateOrderDetails = (data: OrderDetails) => {
    setOrderDetails({
      basePrice: data.basePrice,
      discount: data.discount,
      quantity: data.quantity,
      total: data.total,
    });
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleProceedToPayment = async () => {
    const isValid = await trigger();
    const termsAccepted = getValues("terms");

    if (!isValid || !termsAccepted) {
      show("Please fill all required fields and accept terms", "error");
      console.log("Validation errors:", errors);
      return;
    }

    if (getValues("password") !== getValues("confirmPassword")) {
      show("Passwords do not match", "error");
      return;
    }

    setPaymentView(true);
  };

  useEffect(() => {
    if (!referralCode) {
      updateOrderDetails({
        basePrice: packageDetails.price,
        discount: 0,
        quantity: 1,
        total: packageDetails.price,
      });
    }
  }, [packageDetails, referralCode]);

  useEffect(() => {
    if (referralCode) {
      handleApplyPromoCode(referralCode);
      setValue("promoCode", referralCode);
    }
  }, [referralCode]);

  if (paymentView) {
    return (
      <SignupPaymentMethod
        isSubmitting={isRegisterring}
        disableInput={false}
        paymentMethod={paymentDetails.paymentMethod}
        paymentProofUrl={paymentDetails.paymentProof}
        prevImageUrl=""
        transactionId={paymentDetails.transactionId}
        paymentAmount={
          promoCodeDetails
            ? packageDetails.discountedPrice
            : packageDetails.price
        }
        handleSubmit={handleSubmit(onSubmit)}
        setPaymentDetails={setPaymentDetails}
      />
    );
  }

  return (
    <div className="w-[95%] h-full px-6 py-8 rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="text-textPrimary text-4xl font-semibold">
          Register your Account
        </h1>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <label htmlFor="firstName" className={labelStyle}>
                First Name
              </label>
              <input
                {...register("firstName")}
                id="firstName"
                className={inputStyle}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-danger text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex-1 relative">
              <label htmlFor="lastName" className={labelStyle}>
                Last Name
              </label>
              <input
                {...register("lastName")}
                className={inputStyle}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-danger text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <label htmlFor="email" className={labelStyle}>
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className={inputStyle}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-danger text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <label htmlFor="password" className={labelStyle}>
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
            <div className="flex-1 relative">
              <label htmlFor="confirmPassword" className={labelStyle}>
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                className={inputStyle}
                placeholder="Confirm your password"
              />
              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <Eye size={20} className="text-textPrimary" />
                ) : (
                  <EyeOff size={20} className="text-textPrimary" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-danger text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <label htmlFor="country" className={labelStyle}>
                Country
              </label>
              <input
                {...register("country")}
                className={inputStyle}
                placeholder="Enter your country"
              />
              {errors.country && (
                <p className="text-danger text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div className="flex-1 relative">
              <label htmlFor="dateOfBirth" className={labelStyle}>
                Date of Birth
              </label>
              <input
                {...register("dateOfBirth")}
                type="date"
                className={inputStyle}
              />
              {errors.dateOfBirth && (
                <p className="text-danger text-xs mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <label htmlFor="contactDetail" className={labelStyle}>
                Contact Number
              </label>
              <input
                {...register("contactDetail")}
                className={inputStyle}
                placeholder="Enter your contact number"
              />
              {errors.contactDetail && (
                <p className="text-danger text-xs mt-1">
                  {errors.contactDetail.message}
                </p>
              )}
            </div>
            <div className="flex-1 relative">
              <label htmlFor="gender" className={labelStyle}>
                Gender
              </label>
              <select {...register("gender")} className={inputStyle}>
                <option value="" disabled selected>
                  Select Gender
                </option>
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="text-danger text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div className="relative flex gap-2">
            <label htmlFor="promoCode" className={labelStyle}>
              Promo Code
            </label>
            <input
              {...register("promoCode")}
              className={inputStyle}
              placeholder="Enter promo code"
            />
            {errors.promoCode && (
              <p className="text-danger text-xs mt-1">
                {errors.promoCode.message}
              </p>
            )}
            <Button
              size="lg"
              radius="sm"
              className="px-8"
              color="primary"
              onPress={() => {
                if (!getValues("promoCode")) {
                  show("Please enter a promo code", "error");
                  return;
                }
                handleApplyPromoCode(getValues("promoCode") || "");
              }}
            >
              Apply
            </Button>
          </div>
          <div className="flex-1 relative">
            <label htmlFor="purpose" className={labelStyle}>
              Purpose
            </label>
            <select {...register("purpose")} className={inputStyle}>
              <option value="" disabled selected>
                Select Purpose
              </option>
              {PurposeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-danger text-xs mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>
          {promoCodeDetails && (
            <div className="space-y-1 text-gray-300">
              <div className="text-green-500">Code applied successfully!</div>
              <div>
                Name:{" "}
                {`${promoCodeDetails.firstName} ${promoCodeDetails.lastName}`}
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
          <div className="py-6 rounded-lg shadow-md space-y-6 text-gray-300">
            <h2 className="text-xl font-semibold">Your Order Details</h2>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 font-medium">Package Name:</td>
                  <td className="py-3">{packageDetails?.title}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium">Quantity:</td>
                  <td className="py-3">{orderDetails.quantity}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium">Price:</td>
                  <td className="py-3">
                    {!promoCodeDetails && (
                      <span>
                        {packageDetails?.currency}.{packageDetails?.price}
                      </span>
                    )}
                    {promoCodeDetails && (
                      <>
                        <span
                          className={
                            packageDetails
                              ? "line-through mr-2 text-red-500"
                              : ""
                          }
                        >
                          {packageDetails?.currency}.{packageDetails?.price}
                        </span>
                        <span className="text-green-500">
                          {`${packageDetails?.currency}.${packageDetails?.discountedPrice}`}
                        </span>
                      </>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium">Discount:</td>
                  <td className="py-3 text-green-500">
                    {promoCodeDetails
                      ? `${packageDetails.currency}.${packageDetails.discountedPrice}`
                      : ``}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">Total:</td>
                  <td className="py-3">
                    Rs.
                    {promoCodeDetails
                      ? packageDetails.discountedPrice
                      : packageDetails.price}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <Checkbox
              isRequired
              {...register("terms")}
              classNames={{ label: "text-white" }}
            >
              <span className="text-sm">
                I agree to the terms and conditions
              </span>
            </Checkbox>
            {errors.terms && (
              <p className="text-danger text-xs mt-1">{errors.terms.message}</p>
            )}
          </div>
        </div>

        <PrimaryButton
          label="Proceed to payment"
          className="w-full"
          type="button"
          onclick={handleProceedToPayment}
        />

        <p className="text-textPrimary text-center text-sm">
          Already have an account?{" "}
          <Link to="/auth/login">
            <span className="text-primary">Login!</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
