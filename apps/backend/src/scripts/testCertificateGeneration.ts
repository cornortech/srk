import { generateAndUploadCertificate } from '../services/pdfService';
import path from 'path';
import fs from 'fs';

async function testGenerateCertificate() {
  // Test data
  const userFullName = 'Test User';
  const issuedDate = new Date();
  const participantId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  // Call the function up to the point of file creation, but do not upload to Firebase
  const modifiedPdfPath = `test-certificate-${Date.now()}.pdf`;
  try {
    const certificatePath = path.join(
      process.cwd(),
      'apps',
      'backend',
      'static',
      'certificate',
      'course-completion-certificate.pdf'
    );

    const existingPdfBytes = fs.readFileSync(certificatePath);
    const { PDFDocument, rgb, degrees } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const pageWidth = firstPage.getWidth();
    const pageHeight = firstPage.getHeight();

    const formattedDate = new Date(issuedDate)
      .toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
      .toUpperCase();
    const currentYear = new Date().getFullYear();
    const batch = `B-${currentYear}`;

    // Golden color for name (approximate RGB for gold)
    const gold = { r: 212 / 255, g: 175 / 255, b: 55 / 255 };
    // White color
    const white = rgb(1, 1, 1);

    // Draw the name in gold, tilted, and right-aligned
    const nameFontSize = 28;
    const font = await pdfDoc.embedFont('Helvetica-Oblique'); // built-in italic
    const nameWidth = font.widthOfTextAtSize(userFullName, nameFontSize);
    const nameX = pageWidth - nameWidth - 80; // right side, with margin
    const nameY = pageHeight - 320;
    firstPage.drawText(userFullName, {
      x: nameX,
      y: nameY,
      size: nameFontSize,
      color: rgb(gold.r, gold.g, gold.b),
      rotate: degrees(15), // tilt right
      font,
    });

    // Other fields in white
    firstPage.drawText(formattedDate, {
      x: 180,
      y: 180,
      size: 13,
      color: white,
    });
    firstPage.drawText(batch, {
      x: 380,
      y: 180,
      size: 13,
      color: white,
    });
    firstPage.drawText(participantId, {
      x: 650,
      y: 180,
      size: 13,
      color: white,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(modifiedPdfPath, modifiedPdfBytes);
    console.log(`Test certificate generated at: ${modifiedPdfPath}`);
  } catch (error) {
    console.error('Error generating test certificate:', error);
  }
}

testGenerateCertificate();
