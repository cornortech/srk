import InvoiceGenerator from "../../components/dashboard/invoice/InvoiceGenerator";
import { DescriptionBanner } from "../../components/DescriptionBanner";
import useAuthStore from "../../store/useAuth";
import TaskProgramButton from "../../components/TaskProgramButton";

export const Invoice = () => {
  const { userDetails } = useAuthStore();
  const packageDetails = userDetails?.packageId;
  if (!packageDetails || !userDetails) {
    return <></>;
  }
  return (
    <div className="container mx-auto py-8">
      <DescriptionBanner pageDescription="Invoice Download" />
      
      {/* SSO Test Section */}
      <div className="w-full mb-8 p-6 bg-bgSecondary rounded-xl border border-primary/20">
        <h3 className="text-lg font-semibold mb-2 text-primary">🔗 Multi-Domain SSO Test</h3>
        <p className="text-sm text-gray-400 mb-4">
          Click the button below to test SSO redirect to Task Program. You will be authenticated automatically without logging in again.
        </p>
        <TaskProgramButton size="lg" variant="solid" />
      </div>

      <div className="w-full h-[50vh] flex items-center justify-center">
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
