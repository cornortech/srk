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

/**
 * Test script: generates a completion certificate locally and emails it.
 * Bypasses R2 upload/download so it works from a local machine.
 * Does NOT update hasSendCompletionCertificate — safe to run multiple times.
 *
 * Usage:
 *   tsx apps/backend/src/scripts/sendTestCertificate.ts
 *   tsx apps/backend/src/scripts/sendTestCertificate.ts email=other@example.com
 */
async function sendTestCertificate() {
  const args = process.argv.slice(2);
  let targetEmail = 'wisdomsandy345@gmail.com';

  args.forEach((arg) => {
    const [key, value] = arg.split('=');
    if (key === 'email') targetEmail = value;
  });

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

  const tempPdfPath = `test-certificate-${Date.now()}.pdf`;

  try {
    // --- 1. Find user ---
    console.log(`🔍 Looking up user: ${targetEmail}`);
    const user = await UserModel.findOne({ email: targetEmail });

    if (!user) {
      console.error(`❌ User not found: ${targetEmail}`);
      process.exit(1);
    }

    const toTitleCase = (s: string) =>
      s.replace(/\b\w/g, (c) => c.toUpperCase());
    const fullName = toTitleCase(`${user.firstName} ${user.lastName}`);
    console.log(`✅ User found: ${fullName} (${user._id})`);
    console.log(`   Status:                      ${user.status}`);
    console.log(
      `   hasSendCompletionCertificate: ${
        user.hasSendCompletionCertificate ?? false
      }\n`
    );

    // --- 2. Find KYC record ---
    const kyc = await KYCModel.findOne({ userId: user._id });

    if (!kyc) {
      console.warn('⚠️  No KYC record found — using today as issued date');
    } else {
      console.log(`📋 KYC status:        ${kyc.status}`);
      console.log(
        `   kyc_approved_date: ${kyc.kyc_approved_date ?? 'not set'}\n`
      );
    }

    const issuedDate = kyc?.kyc_approved_date ?? new Date();
    const participantId = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    // --- 3. Generate certificate locally ---
    const certificatePath = path.join(
      process.cwd(),
      'apps',
      'backend',
      'static',
      'certificate',
      'course-completion-certificate.pdf'
    );

    if (!fs.existsSync(certificatePath)) {
      console.error(`❌ Certificate template not found at: ${certificatePath}`);
      process.exit(1);
    }

    console.log(`📄 Generating certificate...`);
    console.log(`   Full Name:      "${fullName}"`);
    console.log(`   Issued Date:    ${issuedDate.toDateString()}`);
    console.log(`   Participant ID: ${participantId}`);
    console.log(`   Template:       ${certificatePath}\n`);

    const existingPdfBytes = fs.readFileSync(certificatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const pageWidth = firstPage.getWidth();
    const pageHeight = firstPage.getHeight();
    console.log(`   Page dimensions: ${pageWidth} x ${pageHeight} pt`);

    const formattedDate = new Date(issuedDate)
      .toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
      .toUpperCase();

    const currentYear = new Date().getFullYear();
    const batch = `B-${currentYear}`;

    // Embed Great Vibes cursive font for the name
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

    const gold = rgb(212 / 255, 175 / 255, 55 / 255);
    const nameSize = 36;
    const nameWidth = fontName.widthOfTextAtSize(fullName, nameSize);
    const nameX = pageWidth / 2 - nameWidth / 2;

    console.log(`\n   Placement preview:`);
    console.log(
      `   Name  → x: ${nameX.toFixed(
        1
      )}, y: 475  (centered, gold, Great Vibes cursive ${nameSize}px)`
    );
    console.log(`   Date  → x: 135,  y: 178  "${formattedDate}"`);
    console.log(`   Batch → x: 356,  y: 178  "${batch}"`);
    console.log(`   ID    → x: 521,  y: 178  "${participantId}"\n`);

    // Name — centered, gold, Great Vibes cursive
    firstPage.drawText(fullName, {
      x: nameX,
      y: 475,
      size: nameSize,
      color: gold,
      font: fontName,
    });

    // Issued date — just above "ISSUED ON:" label
    firstPage.drawText(formattedDate, {
      x: 135,
      y: 178,
      size: 11,
      color: rgb(1, 1, 1),
      font: fontRegular,
    });

    // Batch / cohort — just above "BATCH / COHORT:" label
    firstPage.drawText(batch, {
      x: 356,
      y: 178,
      size: 11,
      color: rgb(1, 1, 1),
      font: fontRegular,
    });

    // Participant ID — just above "PARTICIPANT ID:" label
    firstPage.drawText(participantId, {
      x: 521,
      y: 178,
      size: 11,
      color: rgb(1, 1, 1),
      font: fontRegular,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(tempPdfPath, modifiedPdfBytes);
    console.log(`✅ Certificate written locally: ${tempPdfPath}\n`);

    // --- 4. Send email ---
    console.log(`📧 Sending email to: ${targetEmail} ...`);

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
      to: 'santosh.dev300@gmail.com', // for testing
      subject: '[TEST] Your SRK Industries Digital Empowerment Certificate',
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
          <p><em>(This is a test email — certificate was generated for alignment verification.)</em></p>
          <p>Best regards,<br/>SRK Industries</p>
        </div>
      `,
      attachments: [
        {
          filename: `certificate-${user.firstName}-${user.lastName}.pdf`,
          content: fs.readFileSync(tempPdfPath),
        },
      ],
    });

    console.log('✅ Email sent successfully!\n');
    console.log('ℹ️  hasSendCompletionCertificate was NOT updated (test run).');
    console.log(
      `ℹ️  Local PDF kept at: ${tempPdfPath} — open it to verify alignment.\n`
    );
  } catch (error: any) {
    console.error('\n❌ Error:', error.message || error);
    // clean up temp file on error
    if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

sendTestCertificate();
