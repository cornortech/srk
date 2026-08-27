import cronjob from "node-cron";
import { UserModel } from "../../model/userModel";
import { balanceModel } from "../../model/balanceModel";
import { CommissionTransactionModel } from "../../model/commissionTransactionModel";
import { KYCModel } from "../../model/kycModel";
import EmailService from "../../services/emailService";
import { generateAndUploadCertificate } from "../../services/pdfService";
import { downloadFileFromR2, getR2AssetUrl } from "../../services/r2Service";

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



const sendCompletionCertificates = async () => {
  try {
    console.log('=== Sending Completion Certificates ===');
    console.log('Current time:', new Date());

    // Calculate the date 10 days ago
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    console.log('Looking for KYC approvals from:', tenDaysAgo);

    // Find all KYCs that were approved exactly 10 days ago (with some tolerance)
    // Status should be approved and kyc_approved_date should be around 10 days ago
    const kycRecords = await KYCModel.find({
      status: 'approved',
      kyc_approved_date: {
        $gte: new Date(tenDaysAgo.getTime() - 24 * 60 * 60 * 1000), // 11 days ago
        $lte: new Date(tenDaysAgo.getTime() + 24 * 60 * 60 * 1000), // 9 days ago
      },
    });

    console.log(`Found ${kycRecords.length} KYC records approved around 10 days ago`);

    for (const kyc of kycRecords) {
      try {
        const user = await UserModel.findById(kyc.userId);

        if (!user) {
          console.log(`User not found for KYC: ${kyc._id}`);
          continue;
        }

        // Check if certificate has already been sent
        if (user.hasSendCompletionCertificate) {
          console.log(`Certificate already sent to user: ${user.email}`);
          continue;
        }

        console.log(`Sending certificate to: ${user.email}`);

        // Generate participant ID (random number)
        const participantId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

        // Generate certificate
        const certificateKey = await generateAndUploadCertificate(
          `${user.firstName} ${user.lastName}`,
          new Date(),
          participantId
        );

        console.log(`Certificate generated: ${certificateKey}`);

        // Download certificate from R2 for email attachment
        const certificateBuffer = await downloadFileFromR2(certificateKey);

        // Send email with certificate attachment
        await EmailService.sendEmail({
          subject: 'Your SRK Industries Digital Empowerment Certificate',
          message: `
            <p>Dear ${user.firstName},</p>
            <p>Congratulations! You have successfully completed the SRK Industries Digital Empowerment Program.</p>
            <p>Your completion certificate has been generated and is attached to this email. This certificate recognizes your achievement in:</p>
            <ul>
              <li>Personal Branding</li>
              <li>Communication Skills</li>
              <li>Affiliate Marketing</li>
              <li>Growth Mindset & Online Business</li>
              <li>Building a Digital Presence</li>
            </ul>
            <p>Certificate Number: ${participantId}</p>
            <p>Wishing you continued success and growth in the digital world!</p>
            <p>Best regards,</p>
            <p>SRK Industries</p>
          `,
          email: user.email,
          attachment: [
            {
              filename: `certificate-${user.firstName}-${user.lastName}.pdf`,
              content: certificateBuffer,
            }
          ]
        });

        // Mark certificate as sent
        user.hasSendCompletionCertificate = true;
        await user.save();

        console.log(`Certificate successfully sent to: ${user.email}`);
      } catch (error) {
        console.error(`Error sending certificate for KYC ${kyc._id}:`, error);
        // Continue with next user if there's an error
      }
    }

    console.log('=== Completion Certificate Sending Finished ===');
  } catch (error) {
    console.error('Error in sendCompletionCertificates:', error);
  }
};



const cronJobInit = () => {
  // Run completion certificate sending job once a day at 2 AM
  cronjob.schedule("0 2 * * *", sendCompletionCertificates);
  console.log('Certificate sending cron job scheduled to run daily at 2:00 AM');
};

export default cronJobInit;
