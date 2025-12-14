import { initServer } from "@ts-rest/express";
import { bankContract } from "@srk/shared/contracts";
import { bankQueryHandlers } from "./query";
import { bankMutationHandlers } from "./mutation";

const s = initServer();

export const bankRouter = s.router(bankContract, {
  getBankDetails: bankQueryHandlers.getBankDetails,
  createBankDetails: bankMutationHandlers.createBankDetails,
  getSrkBankRequestByStatus: bankQueryHandlers.getSrkBankRequestByStatus,
});
