import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env from root directory
const envPath = path.resolve(__dirname, '../../../../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️ .env file not found at', envPath);
}

import mongoose from 'mongoose';
import { UserModel } from '../model/userModel';
import { CoursePaymentModel } from '../model/coursePayment';

const DATABASE_URL = process.env.DATABASE_URL || '';

const fixAffectedUsers = async () => {
  try {
    console.log('\n📋 SRK Payment Status Fix Script\n');
    
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL not found in .env');
    }

    // Connect to database
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB\n');

    // Find all users with PAYMENT_VERIFICATION_PENDING status
    console.log('🔍 Searching for affected users...');
    const affectedUsers = await UserModel.find({
      status: 'PAYMENT_VERIFICATION_PENDING',
    });

    if (affectedUsers.length === 0) {
      console.log('✅ No affected users found!');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log(`Found ${affectedUsers.length} users with PAYMENT_VERIFICATION_PENDING status\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    const updatedEmails: string[] = [];
    const skippedEmails: string[] = [];

    // Check each user and update if they have a payment record
    for (const user of affectedUsers) {
      const paymentRecord = await CoursePaymentModel.findOne({
        userId: user._id,
      });

      // If user has a payment record, update their status to REGISTERED
      if (paymentRecord) {
        user.status = 'REGISTERED';
        await user.save();
        updatedCount++;
        updatedEmails.push(user.email);
        console.log(`✅ Updated: ${user.email}`);
      } else {
        skippedCount++;
        skippedEmails.push(user.email);
        console.log(`⏭️  Skipped: ${user.email} (no payment record found)`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Updated: ${updatedCount} users`);
    console.log(`⏭️  Skipped: ${skippedCount} users`);
    console.log(`📈 Total: ${updatedCount + skippedCount} users\n`);

    if (updatedCount > 0) {
      console.log('✅ Updated Users:');
      updatedEmails.forEach((email) => console.log(`   - ${email}`));
    }

    if (skippedCount > 0) {
      console.log('\n⏭️  Skipped Users (no payment record):');
      skippedEmails.forEach((email) => console.log(`   - ${email}`));
    }

    console.log('\n✅ Migration completed successfully!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during migration:', error);
    process.exit(1);
  }
};

// Run the migration
console.log('🚀 Starting fix script...');
fixAffectedUsers();
