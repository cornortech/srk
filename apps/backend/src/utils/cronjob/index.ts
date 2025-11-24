import cronjob from "node-cron";
import { UserModel } from "../../model/userModel";
import { balanceModel } from "../../model/balanceModel";
import { CommissionTransactionModel } from "../../model/commissionTransactionModel";

async function addSrkBonusToSenior(
  referringUserId: string,
  referredToUserId: string,
  amount?: number
) {
  try {
    const commissionTransactionExist = await CommissionTransactionModel.findOne(
      {
        referredBy: referringUserId,
        referredTo: referredToUserId,
      }
    );

    if (!commissionTransactionExist) {
      console.log("Commission transaction not found.");
      return;
    }
    // Find the user who referred the new user
    const referringUser = await UserModel.findById(referringUserId);

    if (!referringUser) {
      console.log("Referred user not found.");
      return;
    }

    if (!referringUser.referredBy) {
      console.log("Referred user has no senior.");
      return;
    }

    const seniorUser = await UserModel.findById(referringUser.referredBy);
    if (!seniorUser) {
      console.log("Senior of referring user not found.");
      return;
    }

    await balanceModel.findOneAndUpdate(
      {
        userId: seniorUser._id,
      },
      {
        $inc: {
          srkBonus: commissionTransactionExist.srkBonus,
        },
      }
    );

    referringUser.hasSrkBonusDeposited = true;

    await referringUser.save();

    console.log(
      `Added ${commissionTransactionExist.srkBonus} SRK bonus to senior user ${seniorUser._id} ${seniorUser.email}`
    );
  } catch (error) {
    console.error("Error adding referral reward:", error);
  }
}

const depositSrkBonus = async () => {
  const now = Date.now();
  const users = await UserModel.find({
    referredBy: { $ne: null }, // Ensure the user was referred
    hasSrkBonusDeposited: false,
    createdAt: { $lte: new Date(now - 24 * 60 * 60 * 1000) }, // Created more than 24 hours ago
  });

  // Process each user who is eligible for the reward
  for (const user of users) {
    if (user.referredBy) {
      await addSrkBonusToSenior(
        user.referredBy.toString(),
        user._id.toString()
      );
    }
  }
};

const runTaskEveryMinute = async () => {
  await depositSrkBonus();
};

const cronJobInit = () => {
  // cronjob.schedule("* * * * *", runTaskEveryMinute);
};

export default cronJobInit;
