import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../../.env') });

import * as http from 'http';
import * as https from 'https';
import mongoose from 'mongoose';
import axios from 'axios';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

import { CourseVideoModel } from '../model/courseVideo';
import { CourseModel } from '../model/courseModel';
import { UserModel } from '../model/userModel';
import { KYCModel } from '../model/kycModel';
import { TourTargetModel } from '../model/TourTargetModel';
import { CoursePaymentModel } from '../model/coursePayment';
import { BankDetailsModel } from '../model/bankDetails';
import { growSocialMediaPackageUserModel } from '../model/growSocialMediaPackageUserModel';
import { srkTaskActionSubmissionModel } from '../model/task/srkTaskActionSubmissionModel';
import { srkTaskOnboardingVerificationRequestModel } from '../model/task/srkTaskOnboardingVerificationRequestModel';
import { affiliateBiometricModel } from '../model/affiliateVerificationModel';
import { growSrkAffiliateVerificationModel } from '../model/growSrkAffiliateVerificationModel';

// ─── Config ───────────────────────────────────────────────────────────────────

const DATABASE_URL       = process.env.DATABASE_URL        || '';
const R2_ACCESS_KEY_ID   = process.env.R2_ACCESS_KEY_ID    || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_ENDPOINT        = process.env.R2_ENDPOINT         || '';
const R2_BUCKET          = process.env.R2_BUCKET           || '';
const R2_PREFIX          = 'srk'; // always use production prefix

const FIREBASE_REGEX       = /firebasestorage\.googleapis\.com/i;
const DOWNLOAD_TIMEOUT_MS  = 2 * 60 * 1000; // 2 min — covers response headers + stall guard
const SOCKET_TIMEOUT_MS    = 90 * 1000;      // 90 s socket timeout kills stalled data transfers
const BATCH_SIZE           = 20; // images are small, run 20 concurrently

// Agents with socket timeouts to prevent hung downloads
const httpAgent  = new http.Agent ({ keepAlive: false, timeout: SOCKET_TIMEOUT_MS });
const httpsAgent = new https.Agent({ keepAlive: false, timeout: SOCKET_TIMEOUT_MS });
const DRY_RUN_LOG_LIMIT    = 5;  // in dry run, only show first N URLs per model then summarise

// ─── Types ────────────────────────────────────────────────────────────────────

interface FieldConfig {
  /** MongoDB dot-notation path (e.g. 'frontImage' or 'documents.ppSizePhoto') */
  path: string;
  /** R2 subfolder without prefix (e.g. 'university/kyc') */
  r2Folder: string;
  /** Short label embedded in the R2 key for human readability */
  label: string;
  /** Set true when the field is a string[] — each element is migrated independently */
  isArray?: boolean;
}

interface ModelMigrationConfig {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: mongoose.Model<any>;
  fields: FieldConfig[];
}

interface Stats {
  total: number;
  migrated: number;
  alreadyR2: number;
  failed: number;
}

// ─── Model configs ────────────────────────────────────────────────────────────

const MIGRATION_CONFIGS: ModelMigrationConfig[] = [
  {
    name: 'CourseVideo — thumbnailUrl',
    model: CourseVideoModel,
    fields: [
      { path: 'thumbnailUrl', r2Folder: 'university/video-thumbnails', label: 'thumbnail' },
    ],
  },
  {
    name: 'Course — image',
    model: CourseModel,
    fields: [
      { path: 'image', r2Folder: 'university/course-images', label: 'course-image' },
    ],
  },
  {
    name: 'User — profilePicture',
    model: UserModel,
    fields: [
      { path: 'profilePicture', r2Folder: 'user/profile-pictures', label: 'profile-picture' },
    ],
  },
  {
    name: 'KYC — all image fields',
    model: KYCModel,
    fields: [
      { path: 'frontImage',            r2Folder: 'university/kyc', label: 'kyc-front'       },
      { path: 'backImage',             r2Folder: 'university/kyc', label: 'kyc-back'        },
      { path: 'verificationImage',     r2Folder: 'university/kyc', label: 'kyc-verification'},
      { path: 'leftThumbFingerprint',  r2Folder: 'university/kyc', label: 'kyc-left-thumb'  },
      { path: 'rightThumbFingerprint', r2Folder: 'university/kyc', label: 'kyc-right-thumb' },
      { path: 'signature',             r2Folder: 'university/kyc', label: 'kyc-signature'   },
      { path: 'courseEnrollAgreement', r2Folder: 'university/kyc', label: 'kyc-agreement'   },
    ],
  },
  {
    name: 'TourTarget — image',
    model: TourTargetModel,
    fields: [
      { path: 'image', r2Folder: 'university/tour-targets', label: 'tour-image' },
    ],
  },
  {
    name: 'CoursePayment — paymentProofUrl',
    model: CoursePaymentModel,
    fields: [
      { path: 'paymentProofUrl', r2Folder: 'university/payment-proofs', label: 'payment-proof' },
    ],
  },
  {
    name: 'BankDetails — documents.ppSizePhoto / nationalIdCard',
    model: BankDetailsModel,
    fields: [
      { path: 'documents.ppSizePhoto',    r2Folder: 'university/bank-documents', label: 'bank-pp-photo'    },
      { path: 'documents.nationalIdCard', r2Folder: 'university/bank-documents', label: 'bank-national-id' },
    ],
  },
  {
    name: 'GrowSocialMediaPackageUser — kycURL[]',
    model: growSocialMediaPackageUserModel,
    fields: [
      { path: 'kycURL', r2Folder: 'grow/kyc', label: 'grow-kyc', isArray: true },
    ],
  },
  {
    name: 'SrkTaskActionSubmission — screenshotUrl',
    model: srkTaskActionSubmissionModel,
    fields: [
      { path: 'screenshotUrl', r2Folder: 'task/action-submissions', label: 'task-screenshot' },
    ],
  },
  {
    name: 'SrkTaskOnboardingVerificationRequest — kyc / image / signature',
    model: srkTaskOnboardingVerificationRequestModel,
    fields: [
      { path: 'kycDocumentUrl', r2Folder: 'task/documents', label: 'task-kyc-doc'   },
      { path: 'imageUrl',       r2Folder: 'task/documents', label: 'task-image'     },
      { path: 'signatureUrl',   r2Folder: 'task/documents', label: 'task-signature' },
    ],
  },
  {
    name: 'AffiliateBiometric — verification / thumbprints',
    model: affiliateBiometricModel,
    fields: [
      { path: 'verificationImage', r2Folder: 'affiliate/biometric', label: 'affiliate-verification' },
      { path: 'leftThumbPrint',    r2Folder: 'affiliate/biometric', label: 'affiliate-left-thumb'   },
      { path: 'rightThumbPrint',   r2Folder: 'affiliate/biometric', label: 'affiliate-right-thumb'  },
    ],
  },
  {
    name: 'GrowSrkAffiliateVerification — verificationImageUrl',
    model: growSrkAffiliateVerificationModel,
    fields: [
      { path: 'verificationImageUrl', r2Folder: 'grow/affiliate-verification', label: 'grow-affiliate-verification' },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isFirebaseUrl(url: string): boolean {
  return Boolean(url) && FIREBASE_REGEX.test(url);
}

/** Read a value from a document using a dot-notation path. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAtPath(doc: any, dotPath: string): any {
  return dotPath.split('.').reduce((cur, key) => cur?.[key], doc);
}

/** Extract the original filename from a Firebase Storage URL. */
function extractFilename(url: string): string {
  try {
    const urlObj = new URL(url);
    const afterO = urlObj.pathname.split('/o/')[1];
    if (afterO) {
      return path.basename(decodeURIComponent(afterO.split('?')[0]));
    }
  } catch {
    // fall through
  }
  return `file-${Date.now()}`;
}

function buildR2Key(r2Folder: string, docId: string, label: string, filename: string): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${R2_PREFIX}/${r2Folder}/${docId}-${label}-${safe}`;
}

async function keyExistsInR2(s3: S3Client, key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function transferToR2(s3: S3Client, firebaseUrl: string, r2Key: string): Promise<void> {
  const response = await axios.get<ArrayBuffer>(firebaseUrl, {
    responseType: 'arraybuffer',
    timeout: DOWNLOAD_TIMEOUT_MS,
    httpAgent,
    httpsAgent,
  });
  const buffer      = Buffer.from(response.data);
  const contentType = (response.headers['content-type'] as string) || 'image/jpeg';

  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: r2Key,
    Body: buffer,
    ContentType: contentType,
    ContentLength: buffer.length,
  }));
}

/** Build a MongoDB $or query that finds documents where at least one field is a Firebase URL. */
function buildFirebaseQuery(fields: FieldConfig[]): mongoose.FilterQuery<unknown> {
  const conditions = fields.map((f) =>
    f.isArray
      ? { [f.path]: { $elemMatch: { $regex: FIREBASE_REGEX } } }
      : { [f.path]: { $regex: FIREBASE_REGEX } }
  );
  return conditions.length === 1 ? conditions[0] : { $or: conditions };
}

// ─── Per-document migration ───────────────────────────────────────────────────

/**
 * Migrate all Firebase URLs in a single document.
 * `verbose` controls whether individual field changes are printed (kept false for large models).
 */
async function migrateDoc(
  s3: S3Client,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: any,
  fields: FieldConfig[],
  isDryRun: boolean,
  verbose: boolean
): Promise<{ setOps: Record<string, unknown>; migrated: number; alreadyR2: number; failed: number }> {
  const setOps: Record<string, unknown> = {};
  let migrated = 0, alreadyR2 = 0, failed = 0;
  const docId = (doc._id as mongoose.Types.ObjectId).toString();

  for (const field of fields) {
    const raw = getAtPath(doc, field.path);

    // ── Array field (e.g. kycURL) ───────────────────────────────────────────
    if (field.isArray) {
      if (!Array.isArray(raw) || raw.length === 0) continue;

      const updated = [...raw as string[]];
      let arrayChanged = false;

      for (let idx = 0; idx < updated.length; idx++) {
        const url = updated[idx];
        if (!isFirebaseUrl(url)) { alreadyR2++; continue; }

        const filename = extractFilename(url);
        const r2Key    = buildR2Key(field.r2Folder, docId, `${field.label}-${idx}`, filename);

        if (isDryRun) {
          if (verbose) {
            console.log(`  [DRY RUN] [${docId}] ${field.path}[${idx}]`);
            console.log(`    FROM: ${url}`);
            console.log(`    TO  : ${r2Key}`);
          }
          migrated++;
          continue;
        }

        try {
          if (!await keyExistsInR2(s3, r2Key)) await transferToR2(s3, url, r2Key);
          updated[idx] = r2Key;
          arrayChanged = true;
          migrated++;
          if (verbose) console.log(`  ✓ [${docId}] ${field.path}[${idx}] → ${r2Key}`);
        } catch (err) {
          failed++;
          console.error(`  ✗ [${docId}] ${field.path}[${idx}]: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      if (arrayChanged) setOps[field.path] = updated;
      continue;
    }

    // ── Scalar field ────────────────────────────────────────────────────────
    const url = raw as string | undefined;
    if (!url || !isFirebaseUrl(url)) { if (url) alreadyR2++; continue; }

    const filename = extractFilename(url);
    const r2Key    = buildR2Key(field.r2Folder, docId, field.label, filename);

    if (isDryRun) {
      if (verbose) {
        console.log(`  [DRY RUN] [${docId}] ${field.path}`);
        console.log(`    FROM: ${url}`);
        console.log(`    TO  : ${r2Key}`);
      }
      migrated++;
      continue;
    }

    try {
      if (!await keyExistsInR2(s3, r2Key)) await transferToR2(s3, url, r2Key);
      setOps[field.path] = r2Key;
      migrated++;
      if (verbose) console.log(`  ✓ [${docId}] ${field.path} → ${r2Key}`);
    } catch (err) {
      failed++;
      console.error(`  ✗ [${docId}] ${field.path}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { setOps, migrated, alreadyR2, failed };
}

// ─── Per-model migration ──────────────────────────────────────────────────────

async function migrateModel(
  s3: S3Client,
  config: ModelMigrationConfig,
  isDryRun: boolean
): Promise<Stats> {
  console.log(`\n──── ${config.name} ────`);

  const query = buildFirebaseQuery(config.fields);
  const docs  = await config.model.find(query).lean();

  if (docs.length === 0) {
    console.log('  No Firebase URLs found — skipping.');
    return { total: 0, migrated: 0, alreadyR2: 0, failed: 0 };
  }

  console.log(`  Found ${docs.length} document(s) with Firebase URLs`);

  const stats: Stats = { total: docs.length, migrated: 0, alreadyR2: 0, failed: 0 };
  const totalBatches  = Math.ceil(docs.length / BATCH_SIZE);

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
    const batch      = docs.slice(i, i + BATCH_SIZE);

    // In dry run: show individual URLs only for the first DRY_RUN_LOG_LIMIT docs
    // In live mode: show per-file only when the total is small (≤ 100)
    const verbose = isDryRun
      ? i < DRY_RUN_LOG_LIMIT
      : docs.length <= 100;

    const results = await Promise.all(
      batch.map((doc) => migrateDoc(s3, doc, config.fields, isDryRun, verbose))
    );

    for (let j = 0; j < batch.length; j++) {
      const doc = batch[j];
      const { setOps, migrated, alreadyR2, failed } = results[j];

      stats.migrated  += migrated;
      stats.alreadyR2 += alreadyR2;
      stats.failed    += failed;

      if (!isDryRun && Object.keys(setOps).length > 0) {
        await config.model.updateOne({ _id: doc._id }, { $set: setOps });
      }
    }

    // Progress line for large models
    if (!isDryRun && docs.length > 100 && batchIndex % 10 === 0) {
      const pct = Math.round((batchIndex / totalBatches) * 100);
      console.log(`  ... batch ${batchIndex}/${totalBatches} (${pct}%) — migrated: ${stats.migrated}, failed: ${stats.failed}`);
    }
  }

  // Dry run: if we capped logging, show a note
  if (isDryRun && docs.length > DRY_RUN_LOG_LIMIT) {
    console.log(`  ... and ${docs.length - DRY_RUN_LOG_LIMIT} more documents (showing first ${DRY_RUN_LOG_LIMIT} only)`);
  }

  return stats;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  const missing = [
    ['DATABASE_URL',         DATABASE_URL],
    ['R2_ACCESS_KEY_ID',     R2_ACCESS_KEY_ID],
    ['R2_SECRET_ACCESS_KEY', R2_SECRET_ACCESS_KEY],
    ['R2_ENDPOINT',          R2_ENDPOINT],
    ['R2_BUCKET',            R2_BUCKET],
  ]
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length) {
    console.error(`Missing env variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  const s3 = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    forcePathStyle: true,
  });

  console.log('\nFirebase → Cloudflare R2 Image Migration');
  console.log('==========================================');
  console.log(`Mode     : ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`);
  console.log(`R2 prefix: ${R2_PREFIX}`);
  console.log(`R2 bucket: ${R2_BUCKET}`);
  console.log(`Models   : ${MIGRATION_CONFIGS.length}`);

  await mongoose.connect(DATABASE_URL);
  console.log('Connected to MongoDB\n');

  const globalStats: Stats = { total: 0, migrated: 0, alreadyR2: 0, failed: 0 };

  for (const config of MIGRATION_CONFIGS) {
    const stats = await migrateModel(s3, config, isDryRun);
    globalStats.total    += stats.total;
    globalStats.migrated += stats.migrated;
    globalStats.alreadyR2 += stats.alreadyR2;
    globalStats.failed   += stats.failed;
  }

  console.log('\n==========================================');
  console.log(`Migration ${isDryRun ? 'dry run' : ''} complete`);
  console.log(`  Documents scanned : ${globalStats.total}`);
  console.log(`  Fields migrated   : ${globalStats.migrated}`);
  console.log(`  Already on R2     : ${globalStats.alreadyR2}`);
  console.log(`  Failed            : ${globalStats.failed}`);

  await mongoose.disconnect();
  process.exit(globalStats.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
