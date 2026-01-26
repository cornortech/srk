// services/bankStatement.service.ts

import mongoose, {  Types } from "mongoose";
import BankStatementModel, { IBankStatement } from "../model/bank/bankStatementModel";

interface CreateBankStatementInput {
  amount: number;
  description?: string;
  type: IBankStatement["type"];
  status?: IBankStatement["status"];
  bankId?: Types.ObjectId;
  receiverBankId?: Types.ObjectId;
  srkUniversityBankId?: Types.ObjectId;
  currentAmount?: number;
}

export const createBankStatement = async (
  data: CreateBankStatementInput,
  session: mongoose.mongo.ClientSession,
) => {
  const bankStatement = await BankStatementModel.create(
    [
      {
        amount: data.amount,
        description: data.description,
        type: data.type,
        status: data.status || "completed",
        bankId: data.bankId,
        receiverBankId: data.receiverBankId,
        srkUniversityBankId: data.srkUniversityBankId,
        currentAmount: data.currentAmount,
      },
    ],
    {
      session,
    },
  );

  return bankStatement;
};

export const bankStatementService = {
  createBankStatement,
};