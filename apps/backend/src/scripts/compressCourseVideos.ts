import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { CourseVideoModel } from '../model/courseVideo';

const execFileAsync = promisify(execFile);

/**
 * Compresses existing course videos (raw uploads, some as large as 1.4GB /
 * QuickTime .mov) down to a normal web-friendly H.264 mp4, and uploads the
 * result to R2 under a NEW key. The original object is never touched or
 * deleted, so this is safe to re-run and easy to walk back.
 *
 * Usage:
 *   Test one video, no DB change:
 *     npm run script:compress-course-videos -- --videoId=<id>
 *
 *   Test one video and update its DB record on success:
 *     npm run script:compress-course-videos -- --videoId=<id> --apply
 *
 *   Process every not-yet-optimized video and update DB records as it goes:
 *     npm run script:compress-course-videos -- --all --apply
 *
 *   Process every not-yet-optimized video WITHOUT touching the DB (just
 *   generates the optimized files in R2 for review first):
 *     npm run script:compress-course-videos -- --all
 */

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_ENDPOINT = process.env.R2_ENDPOINT || '';
const R2_BUCKET = process.env.R2_BUCKET || '';
const CDN_BASE_URL = process.env.CDN_BASE_URL || '';
const DATABASE_URL = process.env.DATABASE_URL || '';

const OPTIMIZED_SUFFIX = '-optimized';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

function extractR2Key(videoUrl: string): string {
  if (/^https?:\/\//i.test(videoUrl)) {
    const url = new URL(videoUrl);
    let p = url.pathname.replace(/^\/+/, '');
    if (p.startsWith(`${R2_BUCKET}/`)) p = p.slice(R2_BUCKET.length + 1);
    return p;
  }
  return videoUrl.replace(/^\/+/, '');
}

function optimizedKeyFor(originalKey: string): string {
  const dir = path.posix.dirname(originalKey);
  const base = path.posix.basename(
    originalKey,
    path.posix.extname(originalKey)
  );
  return `${dir}/${base}${OPTIMIZED_SUFFIX}.mp4`;
}

async function downloadToFile(key: string, destPath: string): Promise<void> {
  const res = await s3Client.send(
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: key })
  );
  const body = res.Body as NodeJS.ReadableStream;
  await new Promise<void>((resolve, reject) => {
    const writeStream = fs.createWriteStream(destPath);
    body.pipe(writeStream);
    body.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('finish', resolve);
  });
}

async function compressVideo(
  inputPath: string,
  outputPath: string
): Promise<void> {
  await execFileAsync('ffmpeg', [
    '-y',
    '-i',
    inputPath,
    '-vf',
    "scale='min(1920,iw)':'-2'",
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '22',
    '-c:a',
    'aac',
    '-b:a',
    '128k',
    '-movflags',
    '+faststart',
    outputPath,
  ]);
}

async function uploadFile(destKey: string, filePath: string): Promise<void> {
  const buffer = fs.readFileSync(filePath);
  await s3Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: destKey,
      Body: buffer,
      ContentType: 'video/mp4',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
}

function assetUrl(key: string): string {
  return `${CDN_BASE_URL}/${key.replace(/^\/+/, '')}`;
}

interface Args {
  videoId?: string;
  all: boolean;
  apply: boolean;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const videoIdArg = args.find((a) => a.startsWith('--videoId='));
  return {
    videoId: videoIdArg ? videoIdArg.split('=')[1] : undefined,
    all: args.includes('--all'),
    apply: args.includes('--apply'),
  };
}

async function processOne(video: {
  _id: mongoose.Types.ObjectId;
  name: string;
  videoUrl: string;
}, apply: boolean) {
  const originalKey = extractR2Key(video.videoUrl);

  if (originalKey.includes(OPTIMIZED_SUFFIX)) {
    console.log(`SKIP already optimized: ${video.name}`);
    return { skipped: true };
  }

  const destKey = optimizedKeyFor(originalKey);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'srk-video-'));
  const inputExt = path.posix.extname(originalKey) || '.mp4';
  const inputPath = path.join(tmpDir, `in${inputExt}`);
  const outputPath = path.join(tmpDir, 'out.mp4');

  try {
    console.log(`\n--- ${video.name} (${video._id}) ---`);
    console.log(`Downloading: ${originalKey}`);
    await downloadToFile(originalKey, inputPath);
    const originalSize = fs.statSync(inputPath).size;
    console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(1)} MB`);

    console.log('Compressing with ffmpeg...');
    await compressVideo(inputPath, outputPath);
    const newSize = fs.statSync(outputPath).size;
    const reduction = (100 * (1 - newSize / originalSize)).toFixed(0);
    console.log(
      `Compressed size: ${(newSize / 1024 / 1024).toFixed(1)} MB (-${reduction}%)`
    );

    console.log(`Uploading: ${destKey}`);
    await uploadFile(destKey, outputPath);
    console.log(`Uploaded. Preview URL: ${assetUrl(destKey)}`);

    if (apply) {
      await CourseVideoModel.updateOne(
        { _id: video._id },
        { $set: { videoUrl: destKey, originalVideoUrl: originalKey } }
      );
      console.log(
        `DB record updated: videoUrl -> optimized, originalVideoUrl -> ${originalKey}`
      );
    } else {
      console.log(
        'DB NOT updated (pass --apply once you have confirmed playback).'
      );
    }

    return {
      skipped: false,
      originalSize,
      newSize,
    };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function main() {
  const { videoId, all, apply } = parseArgs();

  if (!videoId && !all) {
    console.error(
      'Pass either --videoId=<id> (test one video) or --all (process every video).'
    );
    process.exit(1);
  }
  if (!DATABASE_URL || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT || !R2_BUCKET) {
    console.error('Missing required environment variables (DATABASE_URL / R2_*).');
    process.exit(1);
  }

  console.log(`Connecting to database (IS_PROD=${process.env.IS_PROD})...`);
  await mongoose.connect(DATABASE_URL);
  console.log('Connected.');

  const videos = videoId
    ? await CourseVideoModel.find({ _id: videoId }).lean()
    : await CourseVideoModel.find({}).lean();

  if (videoId && videos.length === 0) {
    console.error(`No video found with id ${videoId}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`Processing ${videos.length} video(s). apply=${apply}\n`);

  let processed = 0;
  let skipped = 0;
  let failed = 0;
  let totalOriginal = 0;
  let totalNew = 0;

  for (const video of videos) {
    try {
      const result = await processOne(video, apply);
      if (result.skipped) {
        skipped++;
      } else {
        processed++;
        totalOriginal += result.originalSize || 0;
        totalNew += result.newSize || 0;
      }
    } catch (error) {
      failed++;
      console.error(`FAILED: ${video.name} (${video._id}):`, error);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`Processed: ${processed}, Skipped: ${skipped}, Failed: ${failed}`);
  if (processed > 0) {
    console.log(
      `Total: ${(totalOriginal / 1024 / 1024 / 1024).toFixed(2)} GB -> ${(
        totalNew /
        1024 /
        1024 /
        1024
      ).toFixed(2)} GB`
    );
  }
  console.log('='.repeat(70));

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(async (error) => {
  console.error('Script failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
