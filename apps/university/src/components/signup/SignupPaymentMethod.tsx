import { Accordion, AccordionItem, Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { TPaymentDetails } from "../SignUpComponent";
import { QrPaymentMethodContent } from "./QrPaymentContent";
import { TPaymentMethod } from "../../lib/types";
import { getAvailableQRCodesApi, TQRCode } from "../../lib/apiClient";

export const SignupPaymentMethod = ({
  paymentAmount,
  setPaymentDetails,
  prevImageUrl,
  isSubmitting,
  paymentProofUrl,
  handleSubmit,
  paymentMethod,

  transactionId,
  disableInput,
}: {
  setPaymentDetails: React.Dispatch<React.SetStateAction<TPaymentDetails>>;
  handleSubmit: () => void;
  disableInput: boolean;
  paymentProofUrl?: File | null;
  isSubmitting: boolean;
  paymentAmount: number;
  prevImageUrl?: string;
  paymentMethod?: TPaymentMethod | null;
  transactionId?: string | null;
}) => {
  // Fetch all QR codes (both available and unavailable)
  const { data: allQRCodesData, isLoading: isLoadingQRCodes } = useQuery({
    queryKey: ["allQRCodes"],
    queryFn: async () => {
      const response = await getAvailableQRCodesApi();
      return response.data;
    },
  });

  const allQRCodes: TQRCode[] = allQRCodesData || [];

  const handleQRCodeSelection = (qrCodeId: string) => {
    setPaymentDetails((prev) => ({
      ...prev,
      qrCodeId,
    }));
  };

  return (
    <div className=" w-full mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-medium">Choose the payment method</h1>
      </div>
      <div>
        {isLoadingQRCodes ? (
          <div className="flex justify-center items-center py-8">
            <Spinner label="Loading QR codes..." />
          </div>
        ) : (
          <Accordion>
            {allQRCodes.map((qrCode, index) => (
              <AccordionItem
                key={qrCode._id || index}
                aria-label={`QR Code ${index + 1}`}
                title={
                  <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => qrCode.isAvailable && handleQRCodeSelection(qrCode._id || '')}
                  >
                    <span className="font-semibold">{qrCode.name}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        qrCode.isAvailable
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {qrCode.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                }
                isDisabled={!qrCode.isAvailable}
              >
                <div className="space-y-4">
                  <div className="text-sm">
                    <p className="text-gray-300">
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          qrCode.isAvailable ? "text-green-400" : "text-red-400"
                        }
                      >
                        {qrCode.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={qrCode.qr}
                      alt={qrCode.name}
                      className="w-full max-w-sm rounded-lg"
                    />
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
      
      {/* Payment Form Section */}
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-medium">Complete Payment Details</h2>
        <QrPaymentMethodContent
          isSubmitting={isSubmitting}
          paymentAmount={paymentAmount}
          disbleInput={disableInput}
          transactionId={transactionId}
          paymentMethod={paymentMethod}
          handleSubmit={handleSubmit}
          paymentProofUrl={paymentProofUrl}
          prevImageUrl={prevImageUrl}
          setPaymentDetails={setPaymentDetails}
        />
      </div>
    </div>
  );
};
