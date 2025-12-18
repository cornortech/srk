import { toast } from "sonner";

export const useSRKAlert = () => {
  const show = (message: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };
  return { show };
};

