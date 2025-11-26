import { SrkBankModel } from "../model/srkBankModel";
import { UserModel } from "../model/userModel";

async function createSrkBankScript(email: string) {
  try {
    const userExist = await UserModel.findOne({ email: email });
    if (!userExist) {
      throw new Error("User not found");
    }

    const srkBankExist = await SrkBankModel.findOne({ userId: userExist._id });

    if (!srkBankExist) {
      // throw new Error("SRK Bank account not found");
      const newSrkBank = await SrkBankModel.create({
        userId: userExist._id,
      });
      userExist.srkBankId = newSrkBank._id;
      await userExist.save();
      console.log("SRK Bank account created for user:", userExist.email);
    }
  } catch (error) {
    console.error("Error creating SRK Bank account:", error);
    throw new Error("Failed to create SRK Bank account");
  }
}

export default createSrkBankScript;
