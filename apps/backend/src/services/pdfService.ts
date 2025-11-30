import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: 'doia6qktn',
  api_key: '317337221342793',
  api_secret: 'tv-B2nCOnNBOHrP7Gkqd-kcleBE',
});

import sharp from 'sharp';

async function fetchAndCompressImage(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  // Compress the image using sharp (this example resizes to 200px width)
  const compressedBuffer = await sharp(Buffer.from(buffer))
    .resize({ width: 200 })
    .png({ quality: 20 })
    .toBuffer();

  return new Uint8Array(compressedBuffer);
}

// Function to upload a file to Cloudinary
async function uploadFileToCloudinary(
  filePath: string,
  folder?: string
): Promise<string> {
  try {
    const uploadResponse = await cloudinary.v2.uploader.upload(filePath, {
      resource_type: 'raw',
      folder: folder || '',
      upload_preset: 'srkImg',
    });

    console.log('Uploaded file URL:', uploadResponse.secure_url);
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Function to modify the agreement PDF and then upload it to Cloudinary
export async function modifyAndUploadAgreement(
  username: string,
  imageUrl: string,
  createdAt: string,
  ref: string
): Promise<string> {
  if (!imageUrl) return '';
  const modifiedPdfPath = `modifiedAgreement-${Date.now()}.pdf`;
  try {
    const pdfPath = path.join(
      process.cwd(),
      'apps',
      'backend',
      'static',
      'pdf',
      'courseAgreement.pdf'
    );

    console.log(`PDF Path: ${pdfPath}`);

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Modify the PDF with text
    firstPage.drawText(username, {
      x: 76,
      y: 550,
      size: 16,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(createdAt, {
      x: 492,
      y: 712,
      size: 16,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(ref, {
      x: 50,
      y: 710,
      size: 16,
      color: rgb(0, 0, 0),
    });

    // Fetch and embed the image into the PDF
    const imageBytes = await fetchAndCompressImage(imageUrl);
    const image = await pdfDoc.embedPng(imageBytes);
    firstPage.drawImage(image, {
      x: 452,
      y: 570,
      width: 100,
      height: 120,
    });

    // Save the modified PDF locally
    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(modifiedPdfPath, modifiedPdfBytes);
    const modifiedPdfUrl = await uploadFileToCloudinary(modifiedPdfPath, '');
    fs.unlinkSync(modifiedPdfPath);
    return modifiedPdfUrl;
  } catch (error) {
    fs.unlinkSync(modifiedPdfPath);
    console.error('Error modifying or uploading PDF:', error);
    throw error;
  }
}
export async function createAffiliatePdfAndUpload(
  username: string,
  imageUrl: string,
  createdAt: string,
  ref: string
): Promise<string> {
  if (!imageUrl) return '';

  const modifiedPdfPath = `modifiedAffiliateAgreement-${Date.now()}.pdf`;
  // const modifiedPdfPath = `modifiedAffiliateAgreement.pdf`;

  try {
    const pdfPath = path.join(
      process.cwd(),
      'static',
      'pdf',
      'affiliateAgreement.pdf'
    );

    console.log(`PDF Path: ${pdfPath}`);

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Modify the PDF with text
    firstPage.drawText(username, {
      x: 73,
      y: 555,
      size: 16,
      color: rgb(0, 0, 0),
    });
    // Modify the PDF with text
    firstPage.drawText(username, {
      x: 50,
      y: 205,
      size: 16,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(createdAt, {
      x: 492,
      y: 712,
      size: 16,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(createdAt, {
      x: 310,
      y: 205,
      size: 16,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(ref, {
      x: 50,
      y: 710,
      size: 16,
      color: rgb(0, 0, 0),
    });

    // Fetch and embed the image into the PDF
    const imageBytes = await fetchAndCompressImage(imageUrl);
    const image = await pdfDoc.embedPng(imageBytes);
    firstPage.drawImage(image, {
      x: 452,
      y: 570,
      width: 100,
      height: 120,
    });

    // Save the modified PDF locally
    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(modifiedPdfPath, modifiedPdfBytes);
    const modifiedPdfUrl = await uploadFileToCloudinary(modifiedPdfPath, '');

    // fs.unlinkSync(modifiedPdfPath);
    return modifiedPdfUrl;
  } catch (error) {
    // fs.unlinkSync(modifiedPdfPath);
    console.error('Error modifying or uploading PDF:', error);
    throw error;
  }
}
