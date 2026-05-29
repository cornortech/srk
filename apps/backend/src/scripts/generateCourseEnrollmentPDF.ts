// dotenv MUST be the first import so env vars are available to all other modules
import 'dotenv/config';

import mongoose from 'mongoose';
import { UserModel } from '../model/userModel';
import { KYCModel } from '../model/kycModel';
import { modifyAndUploadAgreement } from '../services/pdfService';
import { getR2AssetUrl } from '../services/r2Service';
import { CoursePaymentModel } from '../model/coursePayment';
import moment from 'moment';

/**
 * Script: Generates course enrollment PDF for a single user
 * 
 * Usage:
 *   tsx apps/backend/src/scripts/generateCourseEnrollmentPDF.ts email=user@example.com
 */
async function generateCourseEnrollmentPDF() {
  const args = process.argv.slice(2);
  let userEmail: string | null = null;

  args.forEach((arg) => {
    const [key, value] = arg.split('=');
    if (key === 'email') userEmail = value;
  });

  if (!userEmail) {
    console.error('❌ Email not provided. Usage: tsx script.ts email=user@example.com');
    process.exit(1);
  }

  const MONGODB_URI = process.env.DATABASE_URL;

  if (!MONGODB_URI) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }

  console.log('🔄 Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to database\n');

  try {
    // Find user by email
    console.log(`📧 Finding user: ${userEmail}`);
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      console.error(`❌ User not found with email: ${userEmail}`);
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.firstName} ${user.lastName}\n`);

    // Find KYC record for the user
    console.log(`🔍 Finding KYC record...`);
    const kyc = await KYCModel.findOne({ userId: user._id });

    if (!kyc) {
      console.error(`❌ KYC record not found for user: ${user.email}`);
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log(`✅ Found KYC record\n`);

    // Get the course payment details to determine the QR code type
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
        console.log(`QR Code Type: ${qrCode.type}, Template: ${templatePath}\n`);
      }
    } catch (err) {
      console.warn('⚠️  Error fetching course payment QR code details:', err);
      // Continue with default template if error occurs
    }

    // Generate and upload agreement PDF
    console.log('📄 Generating course enrollment PDF...');
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

    console.log(`✅ PDF generated successfully!\n`);

    // Update KYC with the PDF URL
    console.log('💾 Storing PDF URL in KYC model...');
    kyc.courseEnrollAgreement = courseEnrollAgreementUrl;
    await kyc.save();

    console.log(`✅ KYC updated successfully!\n`);

    // Display results
    console.log('================================================================================');
    console.log('✅ Course Enrollment PDF Generated Successfully');
    console.log('================================================================================');
    console.log(`User Email:        ${user.email}`);
    console.log(`User Name:         ${user.firstName} ${user.lastName}`);
    console.log(`PDF URL:           ${courseEnrollAgreementUrl}`);
    console.log(`\n🔗 Full CDN URL:   https://cdn.thesrkuniversity.com/${courseEnrollAgreementUrl}`);
    console.log('================================================================================\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

generateCourseEnrollmentPDF();
