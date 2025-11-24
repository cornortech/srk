import { Alert } from "@heroui/react";

export default function AlertBanner({
  type,
  message,
}: {
  type: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  message: string;
}) {
  return (
    <div className="flex items-center justify-center w-full ">
      <div className="flex flex-col w-full">
        <div key={type} className="w-full flex items-center my-3">
          <Alert color={type} title={`${message}`} />
        </div>
      </div>
    </div>
  );
}
