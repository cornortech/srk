import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import sharp from 'sharp';
import { uploadFileToFirebaseStorage } from './firebaseAdminService';

// Function to darken/invert signature image for visibility
async function darkenSignatureImage(url: string): Promise<Uint8Array> {
  if (!url) {
    throw new Error('No signature URL provided');
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch signature: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();

  if (!buffer || buffer.byteLength === 0) {
    throw new Error('Signature buffer is empty');
  }

  try {
    // Darken the signature by increasing contrast and reducing brightness
    // This converts light signatures to dark ones visible on white background
    const darkSignature = await sharp(Buffer.from(buffer))
      .resize({ width: 200 })
      .negate() // Invert colors (white becomes black)
      .png({ quality: 20 })
      .toBuffer();

    return new Uint8Array(darkSignature);
  } catch (err) {
    throw new Error(`Signature processing failed: ${String(err)}`);
  }
}

async function fetchAndCompressImage(url: string): Promise<Uint8Array> {
  if (!url) {
    throw new Error('No image URL provided');
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();

  if (!buffer || buffer.byteLength === 0) {
    throw new Error('Fetched image buffer is empty');
  }

  try {
    // Compress the image using sharp (this example resizes to 200px width)
    const compressedBuffer = await sharp(Buffer.from(buffer))
      .resize({ width: 200 })
      .png({ quality: 20 })
      .toBuffer();

    return new Uint8Array(compressedBuffer);
  } catch (err) {
    throw new Error(`Image compression failed: ${String(err)}`);
  }
}

// Function to modify the agreement PDF and then upload it to Firebase Storage
export async function modifyAndUploadAgreement(
  username: string,
  imageUrl: string,
  createdAt: string,
  ref: string,
  templatePath?: string,
  leftThumbfingerprint?: string,
  rightThumbfingerprint?: string,
  signatureUrl?: string
): Promise<string> {
  if (!imageUrl) return '';
  const modifiedPdfPath = `modifiedAgreement-${Date.now()}.pdf`;
  try {
    console.log('=== PDF Generation Started ===');
    console.log('Username:', username);
    console.log('Verification Image URL:', imageUrl);
    console.log('Left Thumbprint URL:', leftThumbfingerprint || 'NOT PROVIDED');
    console.log('Right Thumbprint URL:', rightThumbfingerprint || 'NOT PROVIDED');
    console.log('Signature URL:', signatureUrl || 'NOT PROVIDED');
    
    const pdfPath = templatePath || path.join(
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
    
    // Log page dimensions for coordinate debugging
    const pageWidth = firstPage.getWidth();
    const pageHeight = firstPage.getHeight();
    console.log(`PDF Page Dimensions: Width=${pageWidth}, Height=${pageHeight}`);

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

    // Fetch and embed the verification image (photo) into the PDF
    try {
      const imageBytes = await fetchAndCompressImage(imageUrl);
      if (imageBytes && imageBytes.length > 0) {
        const embeddedImage = await pdfDoc.embedPng(imageBytes);
        firstPage.drawImage(embeddedImage, {
          x: 452,
          y: 570,
          width: 100,
          height: 120,
        });
      }
    } catch (err) {
      console.warn('Skipping verification image embedding due to error:', err);
    }

    // Fetch and embed left thumbprint into the PDF
    if (leftThumbfingerprint) {
      try {
        console.log('Embedding left thumbprint from:', leftThumbfingerprint);
        const leftThumbBytes = await fetchAndCompressImage(leftThumbfingerprint);
        if (leftThumbBytes && leftThumbBytes.length > 0) {
          const embeddedLeftThumb = await pdfDoc.embedPng(leftThumbBytes);
          firstPage.drawImage(embeddedLeftThumb, {
            x: 420,
            y: 100,
            width: 90,
            height: 110,
          });
          console.log('Left thumbprint embedded successfully at x=420, y=100');
        }
      } catch (err) {
        console.error('Error embedding left thumbprint:', err);
      }
    } else {
      console.log('No left thumbprint URL provided');
    }

    // Fetch and embed right thumbprint into the PDF
    if (rightThumbfingerprint) {
      try {
        console.log('Embedding right thumbprint from:', rightThumbfingerprint);
        const rightThumbBytes = await fetchAndCompressImage(rightThumbfingerprint);
        if (rightThumbBytes && rightThumbBytes.length > 0) {
          const embeddedRightThumb = await pdfDoc.embedPng(rightThumbBytes);
          firstPage.drawImage(embeddedRightThumb, {
            x: 310,
            y: 100,
            width: 90,
            height: 110,
          });
          console.log('Right thumbprint embedded successfully at x=310, y=100');
        }
      } catch (err) {
        console.error('Error embedding right thumbprint:', err);
      }
    } else {
      console.log('No right thumbprint URL provided');
    }

    // Fetch and embed signature into the PDF
    if (signatureUrl) {
      try {
        console.log('Embedding signature from:', signatureUrl);
        const signatureBytes = await darkenSignatureImage(signatureUrl);
        if (signatureBytes && signatureBytes.length > 0) {
          const embeddedSignature = await pdfDoc.embedPng(signatureBytes);
          firstPage.drawImage(embeddedSignature, {
            x: 20,
            y: 120,
            width: 150,
            height: 80,
          });
          console.log('Signature embedded successfully at x=20, y=120 (darkened, positioned upper left)');
        }
      } catch (err) {
        console.error('Error embedding signature:', err);
      }
    } else {
      console.log('No signature URL provided');
    }

    // Save the modified PDF locally and upload to Firebase Storage
    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(modifiedPdfPath, modifiedPdfBytes);
    
    const fileBuffer = fs.readFileSync(modifiedPdfPath);
    const fileName = `${username}-${Date.now()}.pdf`;
    const modifiedPdfUrl = await uploadFileToFirebaseStorage(fileBuffer, fileName, 'agreements');
    
    // Clean up the temporary file
    if (fs.existsSync(modifiedPdfPath)) {
      fs.unlinkSync(modifiedPdfPath);
    }
    
    return modifiedPdfUrl;
  } catch (error) {
    // Clean up the temporary file if it exists
    if (fs.existsSync(modifiedPdfPath)) {
      fs.unlinkSync(modifiedPdfPath);
    }
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
      'apps',
      'backend',
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

    // Fetch and embed the image into the PDF (optional)
    try {
      const imageBytes = await fetchAndCompressImage(imageUrl);
      if (imageBytes && imageBytes.length > 0) {
        const embeddedImage = await pdfDoc.embedPng(imageBytes);
        firstPage.drawImage(embeddedImage, {
          x: 452,
          y: 570,
          width: 100,
          height: 120,
        });
      }
    } catch (err) {
      console.warn('Skipping image embedding due to error:', err);
    }

    // Save the modified PDF locally and upload to Firebase Storage
    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(modifiedPdfPath, modifiedPdfBytes);
    
    const fileBuffer = fs.readFileSync(modifiedPdfPath);
    const fileName = `${username}-affiliate-${Date.now()}.pdf`;
    const modifiedPdfUrl = await uploadFileToFirebaseStorage(fileBuffer, fileName, 'agreements');

    // Clean up the temporary file
    if (fs.existsSync(modifiedPdfPath)) {
      fs.unlinkSync(modifiedPdfPath);
    }
    
    return modifiedPdfUrl;
  } catch (error) {
    // Clean up the temporary file if it exists
    if (fs.existsSync(modifiedPdfPath)) {
      fs.unlinkSync(modifiedPdfPath);
    }
    console.error('Error modifying or uploading PDF:', error);
    throw error;
  }
}
