import { toast } from "sonner";

const useAlert = () => {
  const show = (message: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };
  return { show };
};

export default useAlert;
