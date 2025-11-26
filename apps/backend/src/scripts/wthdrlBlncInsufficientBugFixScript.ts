import { balanceModel } from "../model/balanceModel";
import { SrkBankModel } from "../model/srkBankModel";
import { UserModel } from "../model/userModel";

async function withDrawBalanceInsufficientBugFixScript(email: string) {
  try {
    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      throw new Error("User not found");
    }

    const balanceExist = await balanceModel.find({ userId: userExist._id });

    console.log("srkBankExist", balanceExist);
  } catch (error) {
    console.error("Error in script:", error);
  }
}

export default withDrawBalanceInsufficientBugFixScript;
