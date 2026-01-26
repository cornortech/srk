import { create } from "zustand";

type TSendMoneyStore = {
  receiverAccountName: string;
  receiverAccountNumber: string;
  description: string;
  amount: number;
  intentId?: string;
  setSendMoneyDetails: (state: Partial<TSendMoneyStore>) => void;
};
const useSendMoneyStore = create<TSendMoneyStore>((set) => ({
  receiverAccountName: "",
  receiverAccountNumber: "",
  description: "",
  amount: 0,
  intentId: undefined,
  setSendMoneyDetails: (state: Partial<TSendMoneyStore>) =>
    set((prev) => ({ ...prev, ...state })),
}));

export default useSendMoneyStore;
