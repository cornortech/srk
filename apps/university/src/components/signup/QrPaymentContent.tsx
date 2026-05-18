import { useRef } from "react";
import { TPaymentMethod } from "../../lib/types";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { TPaymentDetails } from "../SignUpComponent";
import { getUniversityAssetUrl } from "../../lib/cdn";

export const QrPaymentMethodContent = ({
  setPaymentDetails,
  handleSubmit,
  paymentMethod,
  isSubmitting,
  paymentAmount,
  transactionId,
  disbleInput,
  prevImageUrl,
  paymentProofUrl,
}: {
  setPaymentDetails: React.Dispatch<React.SetStateAction<TPaymentDetails>>;
  handleSubmit: () => void;
  prevImageUrl?: string;
  disbleInput: boolean;
  isSubmitting: boolean;
  paymentAmount: number;
  transactionId?: string | null;
  paymentMethod?: TPaymentMethod | null;
  paymentProofUrl?: File | null;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prevPaymentDetails) => ({
      ...prevPaymentDetails,
      [name]: value,
    }));
  };

  const handleOnSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value as TPaymentMethod;
    setPaymentDetails((prevPaymentDetails) => ({
      ...prevPaymentDetails,
      paymentMethod: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setPaymentDetails((prev) => ({
        ...prev,
        paymentProof: files[0],
      }));
    }
  };

  return (
    <div className="w-full space-y-6">
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <div className="flex flex-col gap-y-2">
        <Input
          placeholder="Enter transaction ID"
          label="Transaction ID"
          onChange={handleOnInputChange}
          value={transactionId || ""}
          disabled={disbleInput}
          name="transactionId"
        />
        <Select
          defaultSelectedKeys={[paymentMethod || ""]}
          label="Select Payment Method"
          onChange={handleOnSelectChange}
          disabled={disbleInput}
          name="paymentMethod"
        >
          <SelectItem key="" value="" isDisabled >
            --
          </SelectItem>
          <SelectItem key="bankTransfer" value="bankTransfer">
            Bank Transfer
          </SelectItem>
          <SelectItem key="esewa" value="esewa">
            Esewa
          </SelectItem>
          <SelectItem key="khalti" value="khalti">
            Khalti
          </SelectItem>
        </Select>
        {(prevImageUrl || paymentProofUrl) && (
          <img
            src={
              paymentProofUrl
                ? URL.createObjectURL(paymentProofUrl)
                : getUniversityAssetUrl(prevImageUrl || "")
            }
            alt="payment-proof"
            className="w-[200px] h-[200px] object-cover"
          />
        )}
        {!disbleInput && (
          <>
            <Button
              variant="bordered"
              onPress={() => fileInputRef.current?.click()}
            >
              Upload payment proof
            </Button>
            {/* <PrimaryButton
              disabled={isSubmitting}
              label={isSubmitting ? "Submitting..." : "Confirm and register"}
              type="button"
              onclick={handleSubmit}
            /> */}
            <Button
              variant="flat"
              color="primary"
              onPress={handleSubmit}
              disabled={isSubmitting}
              isLoading={isSubmitting}
              aria-disabled={isSubmitting}
              disableRipple={isSubmitting}
              disableAnimation={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm and register"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
