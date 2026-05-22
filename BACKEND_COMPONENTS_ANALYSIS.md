# Backend Components Analysis - SRK University

## Overview
Comprehensive analysis of email, job scheduling, KYC approval, and PDF generation infrastructure in the backend.

---

## 1. EMAIL SENDING IMPLEMENTATION

### Primary Service: EmailService
**File:** [apps/backend/src/services/emailService.ts](apps/backend/src/services/emailService.ts)

**Library:** `nodemailer` (v7.0.10)

**Configuration:**
- SMTP Server: `smtp.gmail.com` (Port 465, Secure)
- Authentication: Uses `APP_EMAIL` and `SMTP_PW` from environment variables (config/env.ts)
- From Address: `"SRK University" <APP_EMAIL>`

**Key Methods:**
- `EmailService.sendEmail()` - Main method to send emails
  - Parameters: `subject`, `message`, `email`, `attachment` (optional)
  - Supports HTML templates with attachments
  - Error handling with try-catch

**Email Template Features:**
- HTML-based template system
- Support for personalized greeting with receiver name
- Embeds links, codes, and passwords
- Styled with inline CSS (Arial font, responsive 600px max-width)

**Usage Locations:**
1. [modules/auth/mutation.ts](apps/backend/src/modules/auth/mutation.ts) - Multiple uses:
   - Line 280: User signup/registration emails
   - Line 318: Password/account-related emails
   - Line 570: KYC approval notification
   - Line 804: Various auth-related notifications
   - Line 1182, 1247, 1318, 1383: Additional auth flows

2. [modules/affiliate/mutation.ts](apps/backend/src/modules/affiliate/mutation.ts) - Line 114, 221: Affiliate-related emails

3. [modules/finance/mutation.ts](apps/backend/src/modules/finance/mutation.ts) - Line 340: Finance-related notifications

4. [utils/cronjob/index.ts](apps/backend/src/utils/cronjob/index.ts) - Line 146: Certificate delivery emails

---

## 2. JOB/SCHEDULER IMPLEMENTATION

### Cron Scheduler: node-cron
**File:** [apps/backend/src/utils/cronjob/index.ts](apps/backend/src/utils/cronjob/index.ts)

**Library:** `node-cron` (v3.0.3)

**Current Jobs:**

#### Job 1: Send Completion Certificates
- **Schedule:** Daily at 2:00 AM (`0 2 * * *`)
- **Function:** `sendCompletionCertificates()`
- **Trigger Condition:** KYCs approved exactly 10 days ago
- **Process:**
  1. Finds KYC records with `status: 'approved'` and `kyc_approved_date` around 10 days old
  2. Checks if user has `hasSendCompletionCertificate` flag (prevents duplicates)
  3. Generates certificate using `generateAndUploadCertificate()`
  4. Downloads certificate from R2 storage
  5. Sends email with PDF attachment via EmailService
  6. Sets flag `hasSendCompletionCertificate = true`

#### Job 2: Deposit SRK Bonus (Code Present - Currently Unused)
- **Function:** `depositSrkBonus()`
- **Trigger Condition:** Users created >24 hours ago with `referredBy` and `hasSrkBonusDeposited = false`
- **Process:** Deposits SRK bonus to referring senior user

#### Job 3: Additional Processing (Referenced)
- **Function:** `addSrkBonusToSenior()`
- **Helper for SRK bonus deposits**

**Initialization:**
- `cronJobInit()` function exports the initialization
- Currently **commented out** in [apps/backend/src/app.ts](apps/backend/src/app.ts) line 7 & 66
- Status: **DISABLED** (needs to be uncommented and app restarted to activate)

**Status:** Uses `node-cron` only. No Bull queues or Agenda.js libraries are present.

---

## 3. KYC APPROVAL FLOW

### KYC Model
**File:** [apps/backend/src/model/kycModel.ts](apps/backend/src/model/kycModel.ts)

**Schema Fields:**
```typescript
- userId (ObjectId, required) - Reference to User
- frontImage (String, required) - Document front photo
- backImage (String, required) - Document back photo
- documentType (String, required) - Type of document
- verificationImage (String, required) - User photo/selfie
- documentNumber (String, required)
- leftThumbFingerprint (String, optional)
- rightThumbFingerprint (String, optional)
- signature (String, optional)
- status (String, enum: ['pending', 'approved', 'rejected']) - Default: 'pending'
- courseEnrollAgreement (String) - Generated PDF URL
- rejectionReason (String) - Reason if rejected
- kyc_approved_date (Date) - Timestamp when approved
- timestamps: true (createdAt, updatedAt)
```

### KYC Approval Process
**File:** [apps/backend/src/modules/auth/mutation.ts](apps/backend/src/modules/auth/mutation.ts) - Lines 480-590

**Endpoint:** `verifyKyc` / `approveKyc`

**Approval Flow:**
1. **Validation:**
   - Find KYC record by userId
   - Return error if not found
   - Return error if already approved

2. **Update KYC Status:**
   - Set `status: 'approved'`
   - Set `kyc_approved_date: new Date()`

3. **Update User Status:**
   - Set user `status: 'PORTAL_ACTIVATED'`

4. **Generate Agreement PDF:**
   - Fetch course payment details and QR code type
   - Determine template based on QR type:
     - `srkIndustries`: `apps/backend/static/agreement/university-industries-agreement.pdf`
     - `srkOrganization`: `apps/backend/static/agreement/task-organization-agreement.pdf`
     - Default: `apps/backend/static/agreement/courseAgreement.pdf`
   - Call `modifyAndUploadAgreement()` with:
     - User name
     - Verification image
     - Document date
     - Referral code
     - Biometric data (fingerprints, signature)
   - Agreement is personalized and uploaded to Cloudflare R2

5. **Embed Biometric Data in Agreement:**
   - Left thumbprint at position (420, 100)
   - Right thumbprint at position (310, 100)
   - Signature at position (20, 120) - darkened for visibility
   - Verification photo at position (452, 570)

6. **Store Agreement URL:**
   - Save generated agreement URL in `kycExist.courseEnrollAgreement`

7. **Send Confirmation Email:**
   - Subject: "KYC Approved"
   - Message: Approval notification with portal access info
   - Recipient: User's email

8. **Save Changes:**
   - Save updated KYC record
   - Save updated user record

**Related Endpoints:**
- Get KYC details: [apps/backend/src/controller/userController.ts](apps/backend/src/controller/userController.ts) - `getKycDetailsByUserId()`

---

## 4. CERTIFICATE & PDF GENERATION

### PDF Generation Service
**File:** [apps/backend/src/services/pdfService.ts](apps/backend/src/services/pdfService.ts)

**Library:** `pdf-lib` (v1.17.1) - Primary PDF manipulation library

**Helper Library:** `sharp` (v0.33.5) - Image processing/compression

**Two Main Functions:**

#### Function 1: `modifyAndUploadAgreement()`
**Purpose:** Create personalized course enrollment agreements

**Parameters:**
- `username` - User's full name
- `imageUrl` - Verification/selfie image URL
- `createdAt` - Creation date (formatted as DD-MM-YYYY)
- `ref` - Referral code
- `templatePath` (optional) - Custom template path
- `leftThumbfingerprint` (optional) - Left thumbprint image
- `rightThumbfingerprint` (optional) - Right thumbprint image
- `signatureUrl` (optional) - Signature image

**Process:**
1. Convert relative asset paths to full CDN URLs (Cloudflare CDN: `https://cdn.thesrkuniversity.com`)
2. Load template PDF from:
   - Custom path if provided, or
   - Default: `apps/backend/static/pdf/courseAgreement.pdf`
3. Extract first page and get dimensions
4. Embed data at specific coordinates:
   - Username at (76, 550)
   - Date at (492, 712)
   - Referral code at (50, 710)
5. Image Processing:
   - Fetch images from URLs
   - Compress using sharp (resize to 200px width, PNG quality 20)
   - Embed at specific positions:
     - Verification photo: (452, 570) - 100x120px
     - Left thumbprint: (420, 100) - 90x110px
     - Right thumbprint: (310, 100) - 90x110px
     - Signature: (20, 120) - 150x80px (darkened/inverted)
6. Upload modified PDF to Cloudflare R2:
   - Folder: `pdf/agreements`
   - Filename: `{username}-{timestamp}.pdf`
7. Cleanup temporary files
8. Return R2 key for storage

**Used In:** KYC approval flow

#### Function 2: `generateAndUploadCertificate()`
**Purpose:** Create completion certificates for course participants

**Parameters:**
- `userFullName` - Full name of certificate recipient
- `issuedDate` - Date of issuance
- `participantId` - Unique participant identifier (6-digit random number)

**Process:**
1. Load template from: `apps/backend/static/certificate/course-completion-certificate.pdf`
2. Get page dimensions for positioning
3. Embed data on first page:
   - User full name: Approximately centered near top (y: pageHeight - 320)
   - Formatted date (e.g., "15 MAY 2026") at (180, 180)
   - Batch/Cohort (B-{currentYear}) at (380, 180)
   - Participant ID (6-digit number) at (650, 180)
4. Save and upload to Cloudflare R2:
   - Folder: `pdf/certificates`
   - Filename: `certificate-{userFullName}-{timestamp}.pdf`
5. Cleanup temporary files
6. Return R2 key

**Used In:** Certificate cron job

#### Function 3: `createAffiliatePdfAndUpload()`
**Purpose:** Create affiliate agreement PDFs

**Status:** Defined but usage unclear from search results

### Image Processing Functions

#### `darkenSignatureImage(url: string)`
- Fetches signature from URL
- Inverts colors (white → black) for visibility
- Resizes to 200px width
- Converts to PNG with quality 20

#### `fetchAndCompressImage(url: string)`
- Fetches image from URL
- Compresses using sharp
- Resizes to 200px width
- Converts to PNG with quality 20

### Storage Service
**File:** [apps/backend/src/services/r2Service.ts](apps/backend/src/services/r2Service.ts)

**Cloud Provider:** Cloudflare R2 (S3-compatible)

**Key Functions:**
- `uploadFileToR2(buffer, filename, folder)` - Upload file to R2
  - Default folder: `'pdf'`
  - Default contentType: `'application/pdf'`
- `downloadFileFromR2(key)` - Download file as Buffer (used for email attachments)
- `deleteFileFromR2(key)` - Delete file from R2
- `getR2AssetUrl(key)` - Get CDN URL for asset

**CDN Base URL:** `https://cdn.thesrkuniversity.com`

---

## 5. EXISTING INFRASTRUCTURE SUMMARY

### Dependencies
```json
"nodemailer": "^7.0.10",
"node-cron": "^3.0.3",
"pdf-lib": "^1.17.1",
"sharp": "^0.33.5",
"@aws-sdk/client-s3": "^3.1045.0",
```

### Environment Variables Required
```
APP_EMAIL=your-email@gmail.com
SMTP_PW=your-app-specific-password
R2_ACCOUNT_ID=cloudflare-account-id
R2_ACCESS_KEY_ID=access-key
R2_SECRET_ACCESS_KEY=secret-key
```

### Static Templates Location
```
apps/backend/static/
├── agreement/
│   ├── courseAgreement.pdf (default)
│   ├── university-industries-agreement.pdf
│   └── task-organization-agreement.pdf
├── certificate/
│   └── course-completion-certificate.pdf
└── pdf/
    └── [generated PDFs stored here]
```

### Database Models
- `UserModel` - Track user email and status
- `KYCModel` - Store KYC data and approval status
- `CoursePaymentModel` - Determine QR code type for agreement template

### Key Flags/Fields for Tracking
- `User.hasSendCompletionCertificate` - Boolean to track if certificate sent
- `User.hasSrkBonusDeposited` - Boolean to track if referral bonus processed
- `User.status` - User status (becomes 'PORTAL_ACTIVATED' after KYC approval)
- `KYC.kyc_approved_date` - Timestamp for triggering 10-day rule

---

## 6. CURRENT STATUS

| Component | Status | Library | Notes |
|-----------|--------|---------|-------|
| **Email Sending** | ✅ Active | nodemailer | Fully implemented, uses Gmail SMTP |
| **Job Scheduler** | ⏸️ Disabled | node-cron | Commented out in app.ts, ready to enable |
| **Certificate Sending Job** | ⏸️ Disabled | node-cron | Scheduled for daily 2 AM run |
| **KYC Approval Flow** | ✅ Active | pdf-lib, sharp | Fully implemented in auth/mutation.ts |
| **PDF Generation** | ✅ Active | pdf-lib | Agreement & certificate generation working |
| **Storage** | ✅ Active | AWS SDK | Cloudflare R2 integration active |

---

## 7. TO ENABLE JOB SCHEDULER

**Current File:** [apps/backend/src/app.ts](apps/backend/src/app.ts)

**Lines to uncomment:**
- Line 7: `import cronJobInit from './utils/cronjob';`
- Line 66: `cronJobInit();`

**Then restart the backend server:**
```bash
npm run start:backend
```

---

## 8. FLOW DIAGRAM

```
KYC Approval Endpoint (admin)
    ↓
Check KYC exists & not already approved
    ↓
Set status: 'approved', kyc_approved_date: now
Set user status: 'PORTAL_ACTIVATED'
    ↓
Generate/Personalize Agreement PDF
├─ Load template (industry-specific or default)
├─ Embed: name, date, referral code
├─ Embed biometrics: fingerprints, signature
└─ Upload to Cloudflare R2 → Store URL
    ↓
Send KYC Approved email
    ↓
[10 days later...]
    ↓
Cron Job: sendCompletionCertificates (2 AM)
    ↓
Find KYCs approved ~10 days ago
    ↓
For each user:
├─ Generate completion certificate (pdf-lib)
├─ Upload to R2 (pdf/certificates)
├─ Download file for attachment
└─ Send email with certificate PDF
    ↓
Mark user: hasSendCompletionCertificate = true
```

---

## 9. POTENTIAL IMPROVEMENTS

1. **Enable and Monitor Cron Jobs:**
   - Uncomment cron initialization to enable certificate delivery
   - Add logging/monitoring for job execution failures

2. **Add Job Queue System (Optional):**
   - Currently using node-cron (simple scheduler)
   - Could upgrade to Bull (Redis-based queues) for:
     - Retry logic on failures
     - Job persistence
     - Distributed processing

3. **Email Template Library:**
   - Currently inline HTML in each sendEmail call
   - Could use template engine (e.g., handlebars, pug)

4. **Certificate Generation Optimization:**
   - Could cache template PDFs in memory
   - Batch certificate generation for better performance

5. **Error Handling:**
   - Add retry logic for failed email sends
   - Log failures to database for admin review
