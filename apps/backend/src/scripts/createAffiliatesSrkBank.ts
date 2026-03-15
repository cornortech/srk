import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { UserModel } from '../model/userModel';
import { SrkBankModel } from '../model/srkBankModel';

// take it from root directory


async function createAffiliatesSrkBank() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.DATABASE_URL;

    // throw error
    if (!mongoUri) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Find all users with affiliateEnabled = true
    const affiliateUsers = await UserModel.find({
      affiliateEnabled: true,
    }).select('_id firstName lastName email');

    console.log(`\n📋 Found ${affiliateUsers.length} affiliate-enabled users`);

    if (affiliateUsers.length === 0) {
      console.log('✓ No affiliate users to process');
      await mongoose.connection.close();
      return;
    }

    // Get all userIds that already have SrkBank records
    const existingSrkBanks = await SrkBankModel.find().select('userId');
    const existingUserIds = new Set(
      existingSrkBanks.map((bank) => bank.userId.toString())
    );

    // Filter users who don't have SrkBank
    const usersWithoutSrkBank = affiliateUsers.filter(
      (user) => !existingUserIds.has(user._id.toString())
    );

    console.log(
      `⚠️  Found ${usersWithoutSrkBank.length} affiliate users without SrkBank records\n`
    );

    if (usersWithoutSrkBank.length === 0) {
      console.log('✓ All affiliate users already have SrkBank records');
      await mongoose.connection.close();
      return;
    }

    // Create SrkBank records for users without one
    const srkBankRecords = usersWithoutSrkBank.map((user) => ({
      userId: user._id,
      amount: 0,
      status: 'pending',
    }));

    const createdRecords = await SrkBankModel.insertMany(srkBankRecords);
    console.log(`✅ Created ${createdRecords.length} SrkBank records\n`);

    // Display summary
    console.log('📊 Summary:');
    console.log('─'.repeat(60));
    usersWithoutSrkBank.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`
      );
    });
    console.log('─'.repeat(60));
    console.log(
      `\n✅ Successfully created SrkBank records for ${createdRecords.length} users`
    );

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
createAffiliatesSrkBank();
