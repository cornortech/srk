import { useMutation, useQuery } from "@tanstack/react-query";
import { SignupContent } from "../../components/signup/SignupContent";
import { AuthLayout } from "../AuthLayout";
import {
  getPackageDetailsApi,
  getUserDetailsApi,
  makeCoursePaymentApi,
} from "../../lib/apiClient";
import { TPackage } from "../../lib/types/entities";
import { useLocation } from "react-router-dom";
import { getQueryParam } from "../SignUp";
import { SignupPaymentMethod } from "../../components/signup/SignupPaymentMethod";
import useAuthStore from "../../store/useAuth";
import { TUserDataReponseData } from "../../lib/types";
import { useEffect, useState } from "react";
import { TPaymentDetails } from "../../components/SignUpComponent";
import useAlert from "../../hooks/useAlert";
import AlertBanner from "../../components/AlertBanner";
import { useSRKFileUpload } from '@srk/shared/hooks';


const PaymentVerificationAuthPage = () => {
  const location = useLocation();
  const packageId = getQueryParam(location, "packageId");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadFile } = useSRKFileUpload('university');
  const { show } = useAlert();
  const [paymentDetails, setPaymentDetails] = useState<TPaymentDetails>({
    paymentMethod: undefined,
    transactionId: "",
    paymentProof: null,
  });
  const { userDetails } = useAuthStore();

  const { data: packageDetails } = useQuery<TPackage | null>({
    queryKey: ["packageById", packageId],
    queryFn: async () => {
      if (!packageId) return null;
      const data = await getPackageDetailsApi(packageId);
      return data;
    },
  });
  const { data: userDetailsData, refetch } =
    useQuery<TUserDataReponseData | null>({
      queryKey: ["user", userDetails?._id],
      queryFn: async () => {
        if (!userDetails?._id) return null;
        const resData = await getUserDetailsApi(userDetails._id);
        return resData;
      },
    });
  const { mutate: makePaymentMutation } = useMutation({
    mutationFn: async (paymentProofUrl: string) => {
      if (!userDetails?._id) return null;
      const data = await makeCoursePaymentApi({
        userId: userDetails?._id || "",
        transactionId: paymentDetails.transactionId,
        paymentMethod: paymentDetails.paymentMethod || "",
        paymentProofUrl: paymentProofUrl,
      });
      return data;
    },
    onSuccess: () => {
      setIsSubmitting(false);
      refetch();
      show("Payment details updated successful", "success");
    },
    onError: () => {
      refetch();
      setIsSubmitting(false);
      show("Payment details update failed", "error");
    },
  });

  useEffect(() => {
    if (userDetailsData?.paymentDetails) {
      setPaymentDetails((prev) => ({
        ...prev,
        paymentMethod: userDetailsData?.paymentDetails?.paymentMethod,
        transactionId: userDetailsData?.paymentDetails?.transactionId || "",
      }));
    }
  }, [userDetailsData?.paymentDetails]);

  const handleSubmit = async () => {
    if (!paymentDetails.paymentMethod) {
      show("Please select a payment method", "error");
      return;
    }
    setIsSubmitting(true);
    let paymentProofUrl =
      userDetailsData?.paymentDetails?.paymentProofUrl || "";
    if (paymentDetails.paymentProof) {
      // const { url } = await uploadFile(paymentDetails.paymentProof, "image");
      const { key } = await uploadFile(paymentDetails.paymentProof, "image");
      paymentProofUrl = key;
    }
    makePaymentMutation(paymentProofUrl);
  };

  if (!packageDetails) return;
  const paymentAmount = userDetails?.referredBy
    ? userDetails?.packageId?.discountedPrice
    : userDetails?.packageId?.price;

  return (
    <AuthLayout
      leftChildren={<SignupContent packageDetails={packageDetails} />}
      rightChildren={
        <div className="w-[95%] mx-auto  ">
          {userDetailsData?.userDetails?.status ===
            "PAYMENT_VERIFICATION_PENDING" && (
            <AlertBanner
              message="Payment verification pending. Please wait for the system to approve your payment details."
              type="warning"
            />
          )}
          {userDetailsData?.userDetails?.status ===
            "PAYMENT_VERIFICATION_REJECTED" && (
            <AlertBanner
              message={`Rejected : ${userDetailsData?.paymentDetails?.rejectionReason}. Please update your payment details`}
              type="danger"
            />
          )}
          <SignupPaymentMethod
            isSubmitting={isSubmitting}
            paymentAmount={paymentAmount as number}
            disableInput={
              userDetails?.status === "PAYMENT_VERIFICATION_PENDING"
            }
            handleSubmit={handleSubmit}
            transactionId={paymentDetails.transactionId}
            paymentMethod={paymentDetails.paymentMethod}
            prevImageUrl={userDetailsData?.paymentDetails?.paymentProofUrl}
            paymentProofUrl={paymentDetails.paymentProof}
            setPaymentDetails={setPaymentDetails}
          />
        </div>
      }
    />
  );
};

export default PaymentVerificationAuthPage;
