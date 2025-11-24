import { Accordion, AccordionItem } from "@nextui-org/react";
import { TPaymentDetails } from "../SignUpComponent";
import { QrPaymentMethodContent } from "./QrPaymentContent";
import { TPaymentMethod } from "../../lib/types";

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
  return (
    <div className=" w-full mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-medium">Choose the payment method</h1>
      </div>
      <div>
        <Accordion>
          <AccordionItem key="1" aria-label="Accordion 1" title="QR Payment">
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
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            disabled
            title="Online Payment (This feature is under development)"
          >
            {/* {defaultContent} */}
            <></>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
