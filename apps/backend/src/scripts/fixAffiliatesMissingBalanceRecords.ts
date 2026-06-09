import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const envPath = path.resolve(__dirname, '../../../../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️ .env file not found at', envPath);
}

import mongoose from 'mongoose';
import { UserModel } from '../model/userModel';
import { balanceModel } from '../model/balanceModel';
import { SrkBankModel } from '../model/srkBankModel';

const DATABASE_URL = process.env.DATABASE_URL || '';

const fixAffiliatesMissingBalanceRecords = async () => {
  try {
    console.log('\n📋 SRK Affiliate Balance Records Fix Script\n');

    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL not found in .env');
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB\n');

    // Find all affiliate-enabled users
    const affiliateUsers = await UserModel.find({
      affiliateEnabled: true,
    }).select('_id firstName lastName email');

    console.log(`🔍 Found ${affiliateUsers.length} affiliate-enabled users\n`);

    if (affiliateUsers.length === 0) {
      console.log('✅ No affiliate users to process');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Fetch all existing Balance and SrkBank records in one shot
    const [existingBalances, existingSrkBanks] = await Promise.all([
      balanceModel.find({ userId: { $in: affiliateUsers.map((u) => u._id) } }).select('userId'),
      SrkBankModel.find({ userId: { $in: affiliateUsers.map((u) => u._id) } }).select('userId'),
    ]);

    const balanceUserIds = new Set(existingBalances.map((b) => b.userId.toString()));
    const srkBankUserIds = new Set(existingSrkBanks.map((b) => b.userId.toString()));

    const missingBalance = affiliateUsers.filter((u) => !balanceUserIds.has(u._id.toString()));
    const missingSrkBank = affiliateUsers.filter((u) => !srkBankUserIds.has(u._id.toString()));

    console.log(`⚠️  Missing Balance records : ${missingBalance.length} users`);
    console.log(`⚠️  Missing SrkBank records : ${missingSrkBank.length} users\n`);

    // Create missing Balance records
    if (missingBalance.length > 0) {
      await balanceModel.insertMany(
        missingBalance.map((u) => ({ userId: u._id }))
      );
      console.log(`✅ Created ${missingBalance.length} Balance records:`);
      missingBalance.forEach((u) =>
        console.log(`   - ${u.email} (${u.firstName} ${u.lastName})`)
      );
      console.log();
    }

    // Create missing SrkBank records
    if (missingSrkBank.length > 0) {
      await SrkBankModel.insertMany(
        missingSrkBank.map((u) => ({ userId: u._id, amount: 0, status: 'pending' }))
      );
      console.log(`✅ Created ${missingSrkBank.length} SrkBank records:`);
      missingSrkBank.forEach((u) =>
        console.log(`   - ${u.email} (${u.firstName} ${u.lastName})`)
      );
      console.log();
    }

    if (missingBalance.length === 0 && missingSrkBank.length === 0) {
      console.log('✅ All affiliate users already have Balance and SrkBank records. Nothing to fix.');
    }

    console.log('='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total affiliate users     : ${affiliateUsers.length}`);
    console.log(`Balance records created   : ${missingBalance.length}`);
    console.log(`SrkBank records created   : ${missingSrkBank.length}`);
    console.log('='.repeat(60));
    console.log('\n✅ Script completed successfully!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during script:', error);
    process.exit(1);
  }
};

console.log('🚀 Starting fix script...');
fixAffiliatesMissingBalanceRecords();
