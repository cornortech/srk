// services/transaction.service.ts
import mongoose from "mongoose";
import { SrkBankModel } from "../model/srkBankModel";
import { bankStatementService } from "./bankStatement.service";

export const sendMoneyTransaction = async ({
  amount,
  senderAccountNumber,
  receiverAccountNumber,
  transactionPIN,
}: {
  amount: number;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  transactionPIN: string;
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Validate sender
    const sender = await SrkBankModel.findOne({
      accountNumber: senderAccountNumber,
    }).session(session);
    if (!sender) {
      throw new Error("INVALID_SENDER");
    }

    if (sender.transactionPIN !== transactionPIN) {
      throw new Error("INVALID_PIN");
    }

    // 2. Validate receiver
    const receiver = await SrkBankModel.findOne({
      accountNumber: receiverAccountNumber,
    }).session(session);
    if (!receiver) {
      throw new Error("INVALID_RECEIVER");
    }

    // 3. Check balance
    if (sender.amount < amount) {
      throw new Error("INSUFFICIENT_BALANCE");
    }

    // 4. Perform transfer
    sender.amount -= amount;
    receiver.amount += amount;

    await sender.save({ session });
    await receiver.save({ session });

    
    bankStatementService.createBankStatement(
      {
        amount,
        type: "send",
        bankId: sender._id,
        receiverBankId: receiver._id,
        currentAmount: sender.amount,
      },
      session
    );

    bankStatementService.createBankStatement(
      {
        amount,
        type: "receive",
        bankId: receiver._id,
        receiverBankId: sender._id,
        currentAmount: receiver.amount,
      },
      session
    );

    // 6. Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (err) {
    // Abort transaction if any error occurs
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
