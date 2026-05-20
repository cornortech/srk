# PDF Agreement Generation Test Guide

This guide explains how to test the `modifyAndUploadAgreement` function to verify that all content (text and images) is properly positioned in the PDF agreement.

## 📁 Files Created

- **test-pdf-generation.ts** - Main test script for PDF generation
- **run-pdf-test.sh** - Bash helper to easily run the test

## 🚀 How to Run the Test

### Option 1: Using the bash script
```bash
chmod +x run-pdf-test.sh
./run-pdf-test.sh
```

### Option 2: Using ts-node directly
```bash
npx ts-node test-pdf-generation.ts
```

### Option 3: Using npm script (if configured)
```bash
npm run test:pdf
```

## 📝 What the Test Does

The test script:

1. **Takes test data** (username, date, ref code, image URLs)
2. **Loads the PDF template** from `apps/backend/static/pdf/courseAgreement.pdf`
3. **Adds text content** at specific coordinates:
   - Username at (76, 550)
   - Date at (492, 712)
   - Ref Code at (50, 710)

4. **Embeds biometric images** at these positions:
   - **Verification Photo**: (452, 570) | 100×120px
   - **Left Thumbprint**: (400, 150) | 90×110px
   - **Right Thumbprint**: (270, 150) | 90×110px
   - **Digital Signature**: (70, 70) | 150×80px

5. **Saves the PDF** to the `test-pdfs/` folder with detailed logging

## 📊 What You'll See

### Console Output
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Testing PDF Agreement Generation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Test Parameters:
  • Username: TestUser
  • Date: 12-04-2026
  • Ref Code: 1234567890
  • Verification Image: ✅ Provided
  • Left Thumbprint: ✅ Provided
  • Right Thumbprint: ✅ Provided
  • Signature: ✅ Provided

📄 Loading PDF template: /path/to/courseAgreement.pdf
   Page Dimensions: 595.2 × 841.92

📝 Adding Text Content:
   ✅ Username at (76, 550): "TestUser"
   ✅ Date at (492, 712): "12-04-2026"
   ✅ Ref Code at (50, 710): "1234567890"

🖼️  Embedding Images:
   1️⃣  Verification Image (Photo)
      ✅ Embedded at (452, 570) | Size: 100×120
   2️⃣  Left Thumbprint
      ✅ Embedded at (400, 150) | Size: 90×110
   3️⃣  Right Thumbprint
      ✅ Embedded at (270, 150) | Size: 90×110
   4️⃣  Digital Signature
      ✅ Embedded at (70, 70) | Size: 150×80

💾 Saving PDF:
   ✅ Saved to: test-pdfs/test-agreement-1775973234567.pdf
   📊 File size: 325.45 KB

✨ PDF Generated Successfully!
```

### Verification Checklist
After the test runs, you'll get:
```
📂 Output: test-pdfs/test-agreement-1775973234567.pdf

📋 Verification Checklist:
   [ ] Username is visible and correctly positioned
   [ ] Date is visible and correctly positioned
   [ ] Ref code is visible and correctly positioned
   [ ] Verification photo is in the correct box (top right)
   [ ] Left thumbprint is in LEFT box (bottom)
   [ ] Right thumbprint is in RIGHT box (bottom)
   [ ] Signature is in the correct box (bottom left)
```

## 🔍 How to Verify Results

1. **Open the generated PDF** from the `test-pdfs/` folder
2. **Check each item** against the verification checklist:
   - ✅ All text is visible and in the correct position
   - ✅ Verification photo appears in the top-right area
   - ✅ Left thumbprint is in the left bottom box
   - ✅ Right thumbprint is in the right bottom box
   - ✅ Signature is in the bottom-left area

## 🔧 Customizing the Test

To test with real Firebase URLs from your system:

Edit the `runTest()` function in `test-pdf-generation.ts`:

```typescript
async function runTest() {
  // Replace these with your actual Firebase URLs
  const testImageUrl = 'https://firebasestorage.googleapis.com/...verification-photo-url...';
  const testLeftThumb = 'https://firebasestorage.googleapis.com/...left-thumb-url...';
  const testRightThumb = 'https://firebasestorage.googleapis.com/...right-thumb-url...';
  const testSignature = 'https://firebasestorage.googleapis.com/...signature-url...';

  const result = await testModifyAndUploadAgreement(
    'YourName',
    testImageUrl,
    '12-04-2026',
    'YOUR-REF-CODE',
    undefined,
    testLeftThumb,
    testRightThumb,
    testSignature
  );
}
```

## 📏 Adjusting Coordinates

If images aren't in the right position:

1. **Find the coordinate** in the console output (e.g., "Embedded at (400, 150)")
2. **Open test-pdf-generation.ts** and find the `drawImage()` call
3. **Adjust x, y values**:
   - Increase `x` to move right
   - Decrease `x` to move left
   - Increase `y` to move up (remember: PDF coordinates start from bottom)
   - Decrease `y` to move down

Example adjustment:
```typescript
// Before
firstPage.drawImage(embeddedLeftThumb, {
  x: 400,
  y: 150,
});

// After (shifted right and up)
firstPage.drawImage(embeddedLeftThumb, {
  x: 420,      // moved right by 20
  y: 180,      // moved up by 30
});
```

## ❓ Troubleshooting

### "PDF template not found"
- Ensure the file exists: `apps/backend/static/pdf/courseAgreement.pdf`
- Check the path in the error message

### Images not showing
- The test script uses placeholder images from `placeholder.com`
- For real testing, use actual Firebase URLs
- Check your internet connection if using placeholder images

### File size too large or too small
- Large files usually mean images are high resolution
- The script compresses images to 200px width with 20% quality
- Adjust the `sharp()` settings in `fetchAndCompressImage()` if needed

### Coordinates seem off
- PDF coordinates: (0,0) is at bottom-left corner
- Y-axis increases upward
- Use the adjustment guide above to fine-tune positioning

## 📚 References

- **PDF Page Dimensions**: 595.2 × 841.92 (A4 size)
- **Coordinate System**: (0,0) is bottom-left, X increases right, Y increases up
- **Image Embedding**: Positioned by top-left corner of the image

## ✅ When Test is Successful

You'll have:
1. ✅ A PDF file in `test-pdfs/` folder
2. ✅ All console logs showing successful embedding
3. ✅ All content properly positioned in the PDF
