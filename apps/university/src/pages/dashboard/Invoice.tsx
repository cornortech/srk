import InvoiceGenerator from "../../components/dashboard/invoice/InvoiceGenerator";
import { DescriptionBanner } from "../../components/DescriptionBanner";
import useAuthStore from "../../store/useAuth";

export const Invoice = () => {
  const { userDetails } = useAuthStore();
  const packageDetails = userDetails?.packageId;
  if (!packageDetails || !userDetails) {
    return <></>;
  }
  return (
    <div className="container mx-auto py-8 h-[50vh] ">
      <DescriptionBanner pageDescription="Invoice Download" />
      <div className="w-full h-full flex items-center justify-center">
        <InvoiceGenerator
          data={{
            amount: packageDetails.price,
            customerAddress: userDetails.country,
            customerEmail: userDetails.email,
            customerName: `${userDetails.firstName} ${userDetails.lastName}`,
            invoiceDate:
              new Date(userDetails.createdAt as Date).toLocaleDateString() ||
              "",
            customerPhone: userDetails.phoneNumber,
            invoiceNumber: Date.now().toString(),
            transactionId: `tnx-${Date.now().toString()}`,
            unitPrice: +(0.87 * packageDetails.price).toFixed(2),
            subscription: packageDetails.title,
            vat: +(0.13 * packageDetails.price).toFixed(2),
          }}
        />
      </div>
    </div>
  );
};
