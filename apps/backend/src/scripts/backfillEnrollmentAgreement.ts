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
import moment from 'moment';
import { UserModel } from '../model/userModel';
import { KYCModel } from '../model/kycModel';
import { CoursePaymentModel } from '../model/coursePayment';
import { modifyAndUploadAgreement } from '../services/pdfService';
import { getR2AssetUrl } from '../services/r2Service';

/**
 * Backfill script: generates and uploads the course enrollment agreement PDF
 * for a user whose KYC was approved before the agreement generation was wired
 * up (or failed silently), and saves the resulting R2 key on the KYC record
 * so it shows up in the admin UI.
 *
 * Usage:
 *   npx tsx apps/backend/src/scripts/backfillEnrollmentAgreement.ts email=user@example.com
 *   npx tsx apps/backend/src/scripts/backfillEnrollmentAgreement.ts email=user@example.com force=true
 */

async function backfillEnrollmentAgreement() {
  const args = process.argv.slice(2);
  let email: string | undefined;
  let force = false;

  args.forEach((arg) => {
    const [key, value] = arg.split('=');
    if (key === 'email') email = value;
    if (key === 'force') force = value === 'true';
  });

  if (!email) {
    console.error('❌ Error: Please provide an email');
    console.log('\nUsage:');
    console.log('  npx tsx apps/backend/src/scripts/backfillEnrollmentAgreement.ts email=user@example.com');
    process.exit(1);
  }

  const DATABASE_URL = process.env.DATABASE_URL || '';
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL not found in .env');
  }

  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(DATABASE_URL);
  console.log('✅ Connected to MongoDB\n');

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }
    console.log(`✅ Found user: ${user.firstName} ${user.lastName} (${user._id})`);

    const kyc = await KYCModel.findOne({ userId: user._id });
    if (!kyc) {
      console.error(`❌ No KYC record found for user ${email}`);
      process.exit(1);
    }
    console.log(`✅ Found KYC record: ${kyc._id} (status: ${kyc.status})`);

    if (kyc.courseEnrollAgreement && !force) {
      console.log(`\nℹ️  courseEnrollAgreement already set: ${kyc.courseEnrollAgreement}`);
      console.log('   Pass force=true to regenerate and overwrite it.');
      process.exit(0);
    }

    if (!kyc.verificationImage) {
      console.error('❌ KYC record has no verificationImage; cannot generate agreement.');
      process.exit(1);
    }

    // Resolve template path the same way verifyKyc does
    let templatePath: string | undefined;
    try {
      const coursePayment = await CoursePaymentModel.findOne({
        userId: user._id,
      }).populate('qrCodeId');

      if (coursePayment && coursePayment.qrCodeId) {
        const qrCode = coursePayment.qrCodeId as any;
        if (qrCode.type === 'srkIndustries') {
          templatePath = `apps/backend/static/agreement/university-industries-agreement.pdf`;
        } else if (qrCode.type === 'srkOrganization') {
          templatePath = `apps/backend/static/agreement/task-organization-agreement.pdf`;
        }
        console.log(`QR Code Type: ${qrCode.type}, Template Path: ${templatePath || '(default)'}`);
      }
    } catch (err) {
      console.warn('⚠️  Error fetching course payment QR code details, using default template:', err);
    }

    console.log('\n📄 Generating enrollment agreement PDF...');
    const courseEnrollAgreementUrl = await modifyAndUploadAgreement(
      user.firstName,
      getR2AssetUrl(kyc.verificationImage),
      moment(kyc.createdAt).format('DD-MM-YYYY'),
      user.referralCode || '',
      templatePath,
      kyc.leftThumbFingerprint ? getR2AssetUrl(kyc.leftThumbFingerprint) : undefined,
      kyc.rightThumbFingerprint ? getR2AssetUrl(kyc.rightThumbFingerprint) : undefined,
      kyc.signature ? getR2AssetUrl(kyc.signature) : undefined
    );

    if (!courseEnrollAgreementUrl) {
      console.error('❌ Agreement generation returned an empty result.');
      process.exit(1);
    }

    kyc.courseEnrollAgreement = courseEnrollAgreementUrl;
    await kyc.save();

    console.log('\n✅ Enrollment agreement generated and saved!');
    console.log(`   R2 key: ${courseEnrollAgreementUrl}`);
    console.log(`   CDN URL: ${getR2AssetUrl(courseEnrollAgreementUrl)}`);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

backfillEnrollmentAgreement().catch((error) => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});
