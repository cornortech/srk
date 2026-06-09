import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../../.env') });

import mongoose from 'mongoose';
import axios from 'axios';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { CourseVideoModel } from '../model/courseVideo';

// ─── Config ──────────────────────────────────────────────────────────────────

const DATABASE_URL = process.env.DATABASE_URL || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_ENDPOINT = process.env.R2_ENDPOINT || '';
const R2_BUCKET = process.env.R2_BUCKET || '';
const R2_PREFIX = 'srk'; // prod assets — always use production prefix

const DOWNLOAD_TIMEOUT_MS = 15 * 60 * 1000; // 15 min — videos can be large
const BATCH_SIZE = 1;                         // one at a time — videos are large, avoid double memory usage

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extracts the original filename from a Firebase Storage URL.
 * Firebase encodes the storage path in the URL like:
 *   .../o/video%2Fsome-name.mp4?alt=media&token=...
 * We decode it and take the basename.
 */
function extractFilenameFromFirebaseUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const afterO = urlObj.pathname.split('/o/')[1];
    if (afterO) {
      const encodedPath = afterO.split('?')[0];
      return path.basename(decodeURIComponent(encodedPath));
    }
  } catch {
    // fall through to default
  }
  return `video-${Date.now()}.mp4`;
}

/** Builds the R2 object key for a given video document. */
function buildR2Key(videoId: string, filename: string): string {
  // Sanitise filename: remove characters that are problematic in object keys
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${R2_PREFIX}/university/videos/${videoId}-${safe}`;
}

/** Returns true if the key already exists in R2 (idempotency guard). */
async function keyExistsInR2(s3: S3Client, key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Downloads the video from Firebase into a buffer, then uploads to R2.
 * Using a buffer (not a stream) means the AWS SDK can retry on transient
 * failures and always knows ContentLength — avoiding "non-retryable streaming
 * request" errors. Quality is identical: raw bytes, no re-encoding.
 */
async function transferFirebaseToR2(
  s3: S3Client,
  firebaseUrl: string,
  r2Key: string
): Promise<void> {
  const response = await axios.get<ArrayBuffer>(firebaseUrl, {
    responseType: 'arraybuffer',
    timeout: DOWNLOAD_TIMEOUT_MS,
  });

  const buffer = Buffer.from(response.data);
  const contentType: string =
    (response.headers['content-type'] as string) || 'video/mp4';

  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
      Body: buffer,
      ContentType: contentType,
      ContentLength: buffer.length,
    })
  );
}

// ─── Per-video migration ──────────────────────────────────────────────────────

interface MigrationResult {
  id: string;
  name: string;
  status: 'success' | 'skipped' | 'failed';
  r2Key?: string;
  error?: string;
}

async function migrateOne(
  s3: S3Client,
  video: { _id: mongoose.Types.ObjectId; name: string; videoUrl: string },
  isDryRun: boolean
): Promise<MigrationResult> {
  const id = video._id.toString();
  const filename = extractFilenameFromFirebaseUrl(video.videoUrl);
  const r2Key = buildR2Key(id, filename);

  if (isDryRun) {
    return { id, name: video.name, status: 'skipped', r2Key };
  }

  try {
    const alreadyUploaded = await keyExistsInR2(s3, r2Key);
    if (alreadyUploaded) {
      // File is in R2 but DB still has Firebase URL — just update the DB.
      await CourseVideoModel.updateOne({ _id: video._id }, { videoUrl: r2Key });
      return { id, name: video.name, status: 'success', r2Key };
    }

    await transferFirebaseToR2(s3, video.videoUrl, r2Key);
    await CourseVideoModel.updateOne({ _id: video._id }, { videoUrl: r2Key });

    return { id, name: video.name, status: 'success', r2Key };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { id, name: video.name, status: 'failed', error: message };
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  // Validate env
  const missing = [
    ['DATABASE_URL', DATABASE_URL],
    ['R2_ACCESS_KEY_ID', R2_ACCESS_KEY_ID],
    ['R2_SECRET_ACCESS_KEY', R2_SECRET_ACCESS_KEY],
    ['R2_ENDPOINT', R2_ENDPOINT],
    ['R2_BUCKET', R2_BUCKET],
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

  console.log('\nFirebase → Cloudflare R2 Video Migration');
  console.log('==========================================');
  console.log(`Mode     : ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`);
  console.log(`R2 prefix: ${R2_PREFIX}`);
  console.log(`R2 bucket: ${R2_BUCKET}`);
  console.log('');

  await mongoose.connect(DATABASE_URL);
  console.log('Connected to MongoDB');

  // Find every CourseVideo whose videoUrl is still a Firebase URL
  const videos = await CourseVideoModel.find({
    videoUrl: { $regex: /firebasestorage\.googleapis\.com/i },
  }).lean();

  if (videos.length === 0) {
    console.log('No Firebase videos found — nothing to migrate.');
    process.exit(0);
  }

  console.log(`Found ${videos.length} video(s) to migrate\n`);

  if (isDryRun) {
    videos.forEach((v) => {
      const filename = extractFilenameFromFirebaseUrl(v.videoUrl);
      const r2Key = buildR2Key(v._id.toString(), filename);
      console.log(`  [${v._id}] ${v.name}`);
      console.log(`    FROM: ${v.videoUrl}`);
      console.log(`    TO  : ${r2Key}`);
      console.log('');
    });
    console.log('Dry run complete — no changes made.');
    process.exit(0);
  }

  // Process in small batches so we don't open too many connections at once
  const results: MigrationResult[] = [];

  for (let i = 0; i < videos.length; i += BATCH_SIZE) {
    const batch = videos.slice(i, i + BATCH_SIZE);
    const batchLabel = `Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(videos.length / BATCH_SIZE)}`;
    console.log(`Processing ${batchLabel}...`);

    const batchResults = await Promise.all(
      batch.map((v) =>
        migrateOne(
          s3,
          { _id: v._id as mongoose.Types.ObjectId, name: v.name, videoUrl: v.videoUrl },
          isDryRun
        )
      )
    );

    for (const r of batchResults) {
      if (r.status === 'success') {
        console.log(`  ✓ [${r.id}] ${r.name}`);
        console.log(`      → ${r.r2Key}`);
      } else {
        console.error(`  ✗ [${r.id}] ${r.name}: ${r.error}`);
      }
    }

    results.push(...batchResults);
    console.log('');
  }

  // Summary
  const succeeded = results.filter((r) => r.status === 'success').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  console.log('==========================================');
  console.log(`Migration complete`);
  console.log(`  Success : ${succeeded}`);
  console.log(`  Failed  : ${failed}`);

  if (failed > 0) {
    console.log('\nFailed videos:');
    results
      .filter((r) => r.status === 'failed')
      .forEach((r) => console.log(`  [${r.id}] ${r.name}: ${r.error}`));
    process.exit(1);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
