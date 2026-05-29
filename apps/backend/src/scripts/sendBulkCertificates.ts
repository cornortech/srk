// dotenv MUST be the first import so env vars are available to all other modules
import 'dotenv/config';

import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import nodemailer from 'nodemailer';
import { UserModel } from '../model/userModel';
import { KYCModel } from '../model/kycModel';
import { CertificateSendTrackingModel } from '../model/certificateSendTrackingModel';
import { uploadFileToR2, getR2AssetUrl } from '../services/r2Service';

/**
 * Bulk script: Sends certificates in batches of 20 users (requires manual trigger per batch)
 *
 * Features:
 * - Processes only 20 users per run
 * - Tracks sent certificates via CertificateSendTrackingModel
 * - Each batch requires manual execution
 * - Background email sending (non-blocking)
 *
 * Usage:
 *   tsx apps/backend/src/scripts/sendBulkCertificates.ts          (process next 20 users)
 *   tsx apps/backend/src/scripts/sendBulkCertificates.ts dryRun=true (preview next 20 users)
 *   tsx apps/backend/src/scripts/sendBulkCertificates.ts batch=2  (process specific batch number)
 */
async function sendBulkCertificates() {
  const args = process.argv.slice(2);
  let dryRun = false;
  let batchNumber: number | null = null;

  args.forEach((arg) => {
    const [key, value] = arg.split('=');
    if (key === 'dryRun') dryRun = value === 'true';
    if (key === 'batch') batchNumber = parseInt(value, 10);
  });

  const BATCH_SIZE = 20; // Production: 20 users per batch
  const MONGODB_URI = process.env.DATABASE_URL;
  
  if (!MONGODB_URI) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }

  if (!process.env.APP_EMAIL || !process.env.SMTP_PW) {
    console.error('❌ APP_EMAIL or SMTP_PW not found in environment');
    process.exit(1);
  }

  console.log('🔄 Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to database\n');

  try {
    // --- 1. Find all eligible users ---
    const eligibleUsers = await findEligibleUsers();

    console.log(`📊 Total eligible users: ${eligibleUsers.length}`);
    console.log(`🎯 Batch size: ${BATCH_SIZE} users per batch`);
    console.log(`📈 Total batches needed: ${Math.ceil(eligibleUsers.length / BATCH_SIZE)}\n`);

    // --- 2. Calculate which batch to process ---
    let currentBatch: number = batchNumber || 0;

    if (currentBatch === 0) {
      const trackingCount = await CertificateSendTrackingModel.countDocuments({ done: true });
      const completedBatches = Math.floor(trackingCount / BATCH_SIZE);
      currentBatch = completedBatches + 1;
    }

    const startIndex = (currentBatch - 1) * BATCH_SIZE;
    const endIndex = startIndex + BATCH_SIZE;
    const batchUsers = eligibleUsers.slice(startIndex, endIndex);

    console.log(`${'='.repeat(80)}`);
    console.log(`📋 BATCH #${currentBatch}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Users in this batch: ${batchUsers.length}`);
    console.log(`Range: ${startIndex + 1} to ${Math.min(endIndex, eligibleUsers.length)} of ${eligibleUsers.length}\n`);

    if (batchUsers.length === 0) {
      console.log('✅ All users have received certificates! No more batches to process.\n');
      return;
    }

    // --- 3. Create tracking records ---
    console.log(`📝 Creating tracking records...`);
    const trackingRecords = await createTrackingRecords(batchUsers);
    console.log(`✅ Created/retrieved ${trackingRecords.length} tracking records\n`);

    if (dryRun) {
      console.log('📋 DRY RUN: Would send certificates to these users:\n');
      batchUsers.forEach((user, index) => {
        console.log(`${startIndex + index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      });
      console.log(`\n✅ DRY RUN COMPLETED\n`);
      console.log(`Next batch command:\n   npm run script:send-bulk-certificates\n`);
      return;
    }

    // --- 4. Start background processing ---
    console.log(`🚀 Starting background processing for batch #${currentBatch}...\n`);
    console.log('📧 Sending certificates...\n');

    await processUsersInBackground(trackingRecords, batchUsers, currentBatch, eligibleUsers.length, BATCH_SIZE);

    console.log('✅ Batch processed successfully!');
    console.log(`   Monitor progress: npm run script:check-certificate-status`);
    console.log(`   Run next batch:   npm run script:send-bulk-certificates\n`);
  } catch (error: Error | unknown) {
    console.error('\n❌ Critical error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// --- Helper Functions ---

/**
 * Find all eligible users (TEST: registered after April 13, 2026 - 1 month back)
 */
async function findEligibleUsers(): Promise<any[]> {
  // Test period: users registered after April 13, 2026 (about 1 month back from May 24)
  const afterDate = new Date('2026-04-13');
  console.log(`📅 Querying users registered after: ${afterDate.toISOString()}`);

  const users = await UserModel.find({
    createdAt: { $gt: afterDate },
    hasSendCompletionCertificate: { $ne: true },
  }).exec();
  
  console.log(`📊 Found ${users.length} users without certificates`);

  const eligibleUsers = [];
  for (const user of users) {
    const kyc = await KYCModel.findOne({ userId: user._id });
    if (kyc && kyc.status === 'approved') {
      eligibleUsers.push(user);
    }
  }

  console.log(`✅ Found ${eligibleUsers.length} users with approved KYC`);
  return eligibleUsers;
}

/**
 * Create or retrieve tracking records for users
 */
async function createTrackingRecords(users: Array<{_id: string; email: string}>): Promise<any[]> {
  const trackingRecords = [];

  for (const user of users) {
    const existingTracking = await CertificateSendTrackingModel.findOne({
      userId: user._id,
    });

    if (!existingTracking) {
      const tracking = new CertificateSendTrackingModel({
        userId: user._id,
        userEmail: user.email,
        done: false,
      });
      await tracking.save();
      trackingRecords.push(tracking);
    } else {
      trackingRecords.push(existingTracking);
    }
  }

  return trackingRecords;
}

/**
 * Generate certificate PDF for a user
 */
async function generateCertificatePDF(
  user: {_id: string; firstName: string; lastName: string},
  kyc: {kyc_approved_date?: Date},
  _pageWidth: number
): Promise<Buffer> {
  const certificatePath = path.join(
    process.cwd(),
    'apps',
    'backend',
    'static',
    'certificate',
    'course-completion-certificate.pdf'
  );

  if (!fs.existsSync(certificatePath)) {
    throw new Error(`Certificate template not found`);
  }

  const toTitleCase = (s: string) =>
    s.replace(/\b\w/g, (c) => c.toUpperCase());
  const fullName = toTitleCase(`${user.firstName} ${user.lastName}`);

  const issuedDate = kyc.kyc_approved_date ?? new Date();
  const participantId = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

  const formattedDate = new Date(issuedDate)
    .toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase();

  const currentYear = new Date().getFullYear();
  const batch = `B-${currentYear}`;

  // Load PDF
  const existingPdfBytes = fs.readFileSync(certificatePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const pageWidth = firstPage.getWidth();

  // Embed fonts
  const cursiveFontPath = path.join(
    process.cwd(),
    'apps',
    'backend',
    'static',
    'fonts',
    'GreatVibes-Regular.ttf'
  );
  const cursiveFontBytes = fs.readFileSync(cursiveFontPath);
  const fontName = await pdfDoc.embedFont(cursiveFontBytes);
  const fontRegular = await pdfDoc.embedFont('Helvetica');

  // Draw text
  const gold = rgb(212 / 255, 175 / 255, 55 / 255);
  const nameSize = 36;
  const nameWidth = fontName.widthOfTextAtSize(fullName, nameSize);
  const nameX = pageWidth / 2 - nameWidth / 2;

  firstPage.drawText(fullName, {
    x: nameX,
    y: 475,
    size: nameSize,
    color: gold,
    font: fontName,
  });

  firstPage.drawText(formattedDate, {
    x: 135,
    y: 178,
    size: 11,
    color: rgb(1, 1, 1),
    font: fontRegular,
  });

  firstPage.drawText(batch, {
    x: 356,
    y: 178,
    size: 11,
    color: rgb(1, 1, 1),
    font: fontRegular,
  });

  firstPage.drawText(participantId, {
    x: 521,
    y: 178,
    size: 11,
    color: rgb(1, 1, 1),
    font: fontRegular,
  });

  return Buffer.from(await pdfDoc.save());
}

/**
 * Send certificate email to user
 */
async function sendCertificateEmail(
  user: {email: string; firstName: string; lastName: string},
  pdfBuffer: Buffer,
  participantId: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.SMTP_PW,
    },
  });

  await transporter.sendMail({
    from: `"SRK University" <${process.env.APP_EMAIL}>`,
    to: user.email,
    subject: 'Your SRK Industries Digital Empowerment Certificate',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <p>Dear ${user.firstName},</p>
        <p>Congratulations! You have successfully completed the SRK Industries Digital Empowerment Program.</p>
        <p>Your completion certificate is attached. It recognizes your achievement in:</p>
        <ul>
          <li>Personal Branding</li>
          <li>Communication Skills</li>
          <li>Affiliate Marketing</li>
          <li>Growth Mindset &amp; Online Business</li>
          <li>Building a Digital Presence</li>
        </ul>
        <p><strong>Certificate Number:</strong> ${participantId}</p>
        <p>You can also download your certificate from the platform portal.</p>
        <p>Best regards,<br/>SRK Industries Team</p>
      </div>
    `,
    attachments: [
      {
        filename: `certificate-${user.firstName}-${user.lastName}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}

/**
 * Process single user: generate, upload, send, and track
 */
async function processSingleUser(
  user: {_id: string; firstName: string; lastName: string; email: string},
  tracking: {_id: string},
  _batchNumber: number,
  _batchSize: number,
  _totalUsers: number,
  _index: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get KYC record
    const kyc = await KYCModel.findOne({ userId: user._id });

    if (!kyc || kyc.status !== 'approved') {
      throw new Error('KYC not approved');
    }

    // Generate certificate PDF
    const pdfBuffer = await generateCertificatePDF(user, { kyc_approved_date: kyc.kyc_approved_date || new Date() }, 612);
    const participantId = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    // Send email with certificate attachment
    await sendCertificateEmail(user, pdfBuffer, participantId);

    // Upload PDF to R2
    const fileName = `certificate-${user._id.toString()}-${Date.now()}.pdf`;
    const r2Key = await uploadFileToR2(
      pdfBuffer,
      fileName,
      'certificates',
      'application/pdf'
    );
    const certificateUrl = getR2AssetUrl(r2Key);

    // Update user and tracking records
    await UserModel.findByIdAndUpdate(user._id, {
      certificateAssetUrl: certificateUrl,
      hasSendCompletionCertificate: true,
    });

    await CertificateSendTrackingModel.findByIdAndUpdate(tracking._id, {
      done: true,
      sentAt: new Date(),
      certificateAssetUrl: certificateUrl,
    });

    return { success: true };
  } catch (error: Error | unknown) {
    // Update tracking with error
    const errorMsg = error instanceof Error ? error.message : String(error);
    await CertificateSendTrackingModel.findByIdAndUpdate(tracking._id, {
      error: errorMsg,
    });

    return { success: false, error: errorMsg };
  }
}

/**
 * Main background processing: orchestrates batch processing
 */
async function processUsersInBackground(
  trackingRecords: Array<{_id: string; userId: string; userEmail: string; done: boolean}>,
  users: Array<{_id: string; firstName: string; lastName: string; email: string; createdAt: Date}>,
  batchNumber: number,
  totalUsers: number,
  batchSize: number
): Promise<void> {
  let successCount = 0;
  let failureCount = 0;

  console.log(`\n${'='.repeat(80)}`);
  console.log(`🔄 BACKGROUND PROCESSING: Batch #${batchNumber}`);
  console.log(`${'='.repeat(80)}\n`);

  for (let i = 0; i < trackingRecords.length; i++) {
    const tracking = trackingRecords[i];
    const user = users[i];
    const overallIndex = (batchNumber - 1) * batchSize + i + 1;

    console.log(`[${i + 1}/${trackingRecords.length}] (#${overallIndex}/${totalUsers}) ${user.firstName} ${user.lastName}...`);

    const result = await processSingleUser(
      user,
      tracking,
      batchNumber,
      batchSize,
      totalUsers,
      i
    );

    if (result.success) {
      console.log(`   ✅ Sent\n`);
      successCount++;
    } else {
      console.error(`   ❌ Failed: ${result.error}\n`);
      failureCount++;
    }
  }

  // Final Summary
  console.log(`${'='.repeat(80)}`);
  console.log(`✅ Batch #${batchNumber} COMPLETED`);
  console.log(`${'='.repeat(80)}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed:    ${failureCount}`);
  console.log(`Total:       ${successCount + failureCount}\n`);
}

sendBulkCertificates();
