import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { CourseVideoModel } from '../model/courseVideo';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';

/**
 * Read-only report of every course video: DB record, resolved R2 key, and
 * current file size/type in storage. Makes no changes to the DB or R2.
 *
 * Usage:
 *   npm run script:inspect-course-videos
 */

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_ENDPOINT = process.env.R2_ENDPOINT || '';
const R2_BUCKET = process.env.R2_BUCKET || '';
const DATABASE_URL = process.env.DATABASE_URL || '';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

export function extractR2Key(videoUrl: string): string {
  if (/^https?:\/\//i.test(videoUrl)) {
    const url = new URL(videoUrl);
    let path = url.pathname.replace(/^\/+/, '');
    if (path.startsWith(`${R2_BUCKET}/`)) {
      path = path.slice(R2_BUCKET.length + 1);
    }
    return path;
  }
  return videoUrl.replace(/^\/+/, '');
}

async function main() {
  if (!DATABASE_URL) {
    console.error('Missing DATABASE_URL in environment');
    process.exit(1);
  }
  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT || !R2_BUCKET) {
    console.error('Missing R2 credentials in environment');
    process.exit(1);
  }

  console.log(`Connecting to database (IS_PROD=${process.env.IS_PROD})...`);
  await mongoose.connect(DATABASE_URL);
  console.log('Connected.\n');

  const videos = await CourseVideoModel.find({}).lean();
  console.log(`Found ${videos.length} course video record(s).\n`);

  let totalBytes = 0;
  let missing = 0;

  for (const video of videos) {
    const key = extractR2Key(video.videoUrl);
    try {
      const head = await s3Client.send(
        new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key })
      );
      const sizeMB = ((head.ContentLength || 0) / 1024 / 1024).toFixed(1);
      totalBytes += head.ContentLength || 0;
      console.log(
        `OK   ${video.name} | id=${video._id} | key=${key} | ${sizeMB} MB | ${head.ContentType}`
      );
    } catch (error) {
      missing++;
      console.log(
        `MISS ${video.name} | id=${video._id} | key=${key} | ${
          (error as Error).message
        }`
      );
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`Total videos: ${videos.length}`);
  console.log(`Not found in R2: ${missing}`);
  console.log(`Total size (found videos): ${(totalBytes / 1024 / 1024 / 1024).toFixed(2)} GB`);
  console.log('='.repeat(70));

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (error) => {
  console.error('Script failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
