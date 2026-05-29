// dotenv MUST be the first import so env vars are available to all other modules
import 'dotenv/config';

import mongoose from 'mongoose';
import { UserModel } from '../model/userModel';
import { KYCModel } from '../model/kycModel';

/**
 * Count eligible users for certificate sending
 *
 * Usage:
 *   tsx apps/backend/src/scripts/countEligibleUsers.ts
 */
async function countEligibleUsers() {
  const MONGODB_URI = process.env.DATABASE_URL;
  if (!MONGODB_URI) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }

  console.log('🔄 Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to database\n');

  try {
    // Calculate 3 months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    console.log(`📅 Criteria:`);
    console.log(`   • Registered before: ${threeMonthsAgo.toDateString()}`);
    console.log(`   • KYC Status: approved`);
    console.log(`   • Certificate: NOT sent yet\n`);

    // Find users registered 3+ months ago and haven't received certificate
    const users = await UserModel.find({
      createdAt: { $lt: threeMonthsAgo },
      hasSendCompletionCertificate: { $ne: true },
    }).exec();

    console.log(`🔍 Found ${users.length} users registered 3+ months ago\n`);

    if (users.length === 0) {
      console.log('⚠️  No users found meeting the criteria.\n');
      return;
    }

    // Filter users with approved KYC
    let eligibleCount = 0;
    const eligibleUsers = [];

    for (const user of users) {
      const kyc = await KYCModel.findOne({ userId: user._id });
      if (kyc && kyc.status === 'approved') {
        eligibleCount++;
        eligibleUsers.push({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          registeredAt: user.createdAt,
          kycApprovedAt: kyc.kyc_approved_date,
        });
      }
    }

    console.log(`${'='.repeat(80)}`);
    console.log(`✅ ELIGIBLE USERS FOR CERTIFICATE: ${eligibleCount}\n`);
    console.log(`${'='.repeat(80)}\n`);

    if (eligibleCount > 0) {
      console.log('📋 Users eligible to receive certificates:\n');
      eligibleUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`);
        console.log(`   Registered: ${user.registeredAt.toDateString()}`);
        console.log(`   KYC Approved: ${user.kycApprovedAt?.toDateString() || 'Not set'}\n`);
      });
    }

    console.log(`${'='.repeat(80)}`);
    console.log(`\n📊 Summary:`);
    console.log(`   Total registered 3+ months ago: ${users.length}`);
    console.log(`   With approved KYC: ${eligibleCount}`);
    console.log(`   Ready to send certificates: ${eligibleCount}\n`);
  } catch (error: any) {
    console.error('\n❌ Error:', error.message || error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

countEligibleUsers();
