import { Button, Card, CardBody } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getAvailableQRCodesApi, TQRCode } from "../lib/apiClient";
import { getUniversityAssetUrl } from "../lib/cdn";

const PaymentGateway = () => {
  const { data, isLoading, isError } = useQuery<TQRCode[]>({
    queryKey: ["available-qrcodes"],
    queryFn: async () => {
      const res = await getAvailableQRCodesApi();
      return res?.data || res || [];
    },
  });

  const available = (data || []).filter((q) => q.isAvailable);
  const todays = available.length > 0 ? available[0] : null;

  return (
    <div className="w-full my-8">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold">Payment Gateway</h2>
        <p className="mt-2 text-muted-foreground">
          Today's payment gateway is this, you can use this QR for purchasing the
          courses.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {isLoading && <p>Loading available QR codes...</p>}
        {isError && <p className="text-danger">Failed to load QR codes.</p>}

        {todays ? (
          <Card isHoverable className="mx-auto w-full max-w-2xl p-6 sm:p-10">
            <CardBody className="flex flex-col items-center gap-6 text-center">
              <div className="rounded-3xl bg-white/5 p-4 sm:p-6 shadow-lg shadow-black/10">
                <img
                  src={getUniversityAssetUrl(todays.qr)}
                  alt={todays.name}
                  className="h-72 w-72 sm:h-[28rem] sm:w-[28rem] object-contain"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-semibold">{todays.name}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {todays.type || "Payment QR"}
                </p>
              </div>

              <Button
                onClick={() => window.open(getUniversityAssetUrl(todays.qr))}
                size="lg"
              >
                Open Full Size QR
              </Button>
            </CardBody>
          </Card>
        ) : (
          !isLoading && !isError && (
            <Card className="mx-auto w-full max-w-2xl p-6">
              <CardBody className="text-center">
                <p className="text-muted-foreground">No payment QR is available right now.</p>
              </CardBody>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;
