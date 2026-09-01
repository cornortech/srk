// One-off repair tool for the payment-approval race condition fixed in
// approvePaymentDetails/editPaymentDetails (see apps/backend/src/modules/auth/mutation.ts).
// That bug could silently revert a user's status back to
// PAYMENT_VERIFICATION_PENDING right after an admin approved them, even
// though the referral earnings had already been paid to their senior.
//
// This script checks ONE user by email and only flips their status to
// REGISTERED if it can verify that's safe:
//   - they're currently PAYMENT_VERIFICATION_PENDING
//   - a CoursePayment record exists for them
//   - if they have a referrer, a REFERRAL_EANRING EarningStatement already
//     exists for them (proof the senior was already paid — so we don't
//     pay again, we're only correcting the status)
// If any check fails, it refuses to change anything and asks for manual
// review instead of guessing.
//
// Usage:
//   npx tsx apps/backend/src/scripts/fixStuckPaymentUser.ts <email>            (dry run, no writes)
//   npx tsx apps/backend/src/scripts/fixStuckPaymentUser.ts <email> --apply    (applies the fix)

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
import { EarningStatementModel } from '../model/earningStatementModel';

const DATABASE_URL = process.env.DATABASE_URL || '';
const TARGET_EMAIL = process.argv[2];
const APPLY = process.argv.includes('--apply');

const run = async () => {
  try {
    console.log('\n📋 Stuck Payment User Fix Script\n');

    if (!TARGET_EMAIL) {
      throw new Error('Usage: tsx fixStuckPaymentUser.ts <email> [--apply]');
    }

    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL not found in .env');
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB\n');

    const user = await UserModel.findOne({ email: TARGET_EMAIL });

    if (!user) {
      console.log(`❌ No user found with email: ${TARGET_EMAIL}`);
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log('👤 User found:');
    console.log(`   _id: ${user._id}`);
    console.log(`   name: ${user.firstName} ${user.lastName}`);
    console.log(`   status: ${user.status}`);
    console.log(`   referredBy: ${user.referredBy || '(none)'}`);
    console.log(`   packageId: ${user.packageId || '(none)'}\n`);

    if (user.status === 'REGISTERED') {
      console.log('✅ User is already REGISTERED. No action needed.');
      await mongoose.connection.close();
      process.exit(0);
    }

    if (user.status !== 'PAYMENT_VERIFICATION_PENDING') {
      console.log(
        `⏭️  User status is "${user.status}", not PAYMENT_VERIFICATION_PENDING. Refusing to auto-fix — needs manual review.`
      );
      await mongoose.connection.close();
      process.exit(1);
    }

    const paymentRecord = await CoursePaymentModel.findOne({ userId: user._id });

    if (!paymentRecord) {
      console.log('⏭️  No CoursePayment record found for this user. Refusing to auto-fix — needs manual review.');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log('💳 Payment record found:');
    console.log(`   transactionId: ${paymentRecord.transactionId}`);
    console.log(`   paymentMethod: ${paymentRecord.paymentMethod}\n`);

    let earningsAlreadyPaid = true;
    if (user.referredBy) {
      const earningRecord = await EarningStatementModel.findOne({
        referredTo: user._id,
        type: 'REFERRAL_EANRING',
      });
      earningsAlreadyPaid = !!earningRecord;

      console.log(
        earningRecord
          ? `✅ Referral earning record already exists for this signup (senior was paid). Earning statement _id: ${earningRecord._id}\n`
          : `⚠️ No referral earning record found for this signup, even though user has a referrer.\n`
      );
    } else {
      console.log('ℹ️  User has no referrer, so no referral earnings are expected.\n');
    }

    if (!earningsAlreadyPaid) {
      console.log(
        '⏭️  Referral earnings were NOT found to already be paid. Refusing to auto-fix status only — this would register the user without the senior ever getting paid. Needs manual review before deciding whether to also run the referral earnings logic.'
      );
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log(
      '✅ Diagnosis: payment record exists and (if applicable) referral earnings were already paid — safe to flip status to REGISTERED.\n'
    );

    if (!APPLY) {
      console.log('🧪 Dry run only (no --apply flag passed). No changes made.');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Atomic, condition-guarded write — only flips if still pending at write time.
    const updated = await UserModel.findOneAndUpdate(
      { _id: user._id, status: 'PAYMENT_VERIFICATION_PENDING' },
      { $set: { status: 'REGISTERED' } },
      { new: true }
    );

    if (!updated) {
      console.log('⚠️ Status changed concurrently before this write could apply. No changes made — please re-run.');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log(`✅ Updated user ${TARGET_EMAIL} status: PAYMENT_VERIFICATION_PENDING → REGISTERED`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
};

run();
