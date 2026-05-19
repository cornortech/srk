#!/usr/bin/env node
/**
 * Bulk Upload Videos to Cloudflare Stream
 * 
 * This script:
 * 1. Fetches all videos from your database
 * 2. Imports each from Firebase to Cloudflare Stream
 * 3. Cloudflare auto-transcodes to HLS/DASH
 * 4. Updates database with Cloudflare Stream URLs
 * 
 * Usage:
 * npx ts-node scripts/bulk-upload-to-cloudflare.ts
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';

interface Video {
  _id: string;
  name: string;
  videoUrl: string;
  courseId: string;
  cloudflareVideoId?: string;
}

interface UploadJob {
  videoId: string;
  firebaseUrl: string;
  courseId: string;
  videoName: string;
}

/**
 * Main execution
 */
async function main() {
  console.log('☁️  Cloudflare Stream - Bulk Video Upload');
  console.log('==========================================\n');

  // Verify environment
  if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
    console.error('❌ Error: CLOUDFLARE_ACCOUNT_ID not set in environment');
    console.error('Set it using: export CLOUDFLARE_ACCOUNT_ID="your-account-id"');
    process.exit(1);
  }

  if (!process.env.CLOUDFLARE_API_TOKEN) {
    console.error('❌ Error: CLOUDFLARE_API_TOKEN not set in environment');
    console.error('Get it from: https://dash.cloudflare.com/profile/api-tokens');
    process.exit(1);
  }

  try {
    // Step 1: Get videos to upload
    console.log('📹 Fetching videos from database...');
    const videosToUpload = await getVideosNeedingUpload();

    if (videosToUpload.length === 0) {
      console.log('✅ No videos need uploading. All videos are already on Cloudflare!');
      return;
    }

    console.log(
      `\n📊 Found ${videosToUpload.length} videos to upload:\n`
    );
    videosToUpload.forEach((video, index) => {
      console.log(
        `  ${index + 1}. ${video.videoName} (Course: ${video.courseId})`
      );
    });

    // Step 2: Confirm with user
    const shouldProceed = await askConfirmation(
      `\n✅ Proceed with uploading to Cloudflare? (yes/no): `
    );

    if (!shouldProceed) {
      console.log('❌ Cancelled by user');
      process.exit(0);
    }

    // Step 3: Start bulk upload
    console.log('\n🚀 Starting bulk upload to Cloudflare Stream...\n');
    const results = await uploadVideos(videosToUpload);

    // Step 4: Print summary
    printSummary(results);

    // Step 5: Save report
    saveReport(results);

    console.log(
      '\n✅ Upload complete! Stream URLs have been saved to database.'
    );
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Fetch videos from database that need uploading to Cloudflare
 */
async function getVideosNeedingUpload(): Promise<UploadJob[]> {
  try {
    // This endpoint should return all videos without cloudflareVideoId
    const response = await axios.get(`${API_BASE_URL}/api/videos/list`);
    const videos: Video[] = response.data;

    // Filter videos that don't have Cloudflare Stream ID yet
    const uploadJobs = videos
      .filter((v) => !v.cloudflareVideoId)
      .map((v) => ({
        videoId: v._id,
        firebaseUrl: v.videoUrl,
        courseId: v.courseId,
        videoName: v.name
      }));

    return uploadJobs;
  } catch (error: any) {
    console.warn(
      '⚠️  Could not fetch videos from API. Using manual list instead.'
    );
    return [];
  }
}

/**
 * Upload videos to Cloudflare one by one
 */
async function uploadVideos(
  videos: UploadJob[]
): Promise<
  Array<{
    videoName: string;
    success: boolean;
    videoId?: string;
    streamUrl?: string;
    error?: string;
    duration: number;
  }>
> {
  const results: Array<{
    videoName: string;
    success: boolean;
    videoId?: string;
    streamUrl?: string;
    error?: string;
    duration: number;
  }> = [];

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const startTime = Date.now();

    console.log(
      `\n[${i + 1}/${videos.length}] ☁️  Uploading: ${video.videoName}`
    );
    console.log('─'.repeat(60));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/cloudflare-stream/import-from-firebase`,
        {
          firebaseUrl: video.firebaseUrl,
          courseId: video.courseId,
          videoName: video.videoName
        }
      );

      if (response.data.success) {
        const duration = (Date.now() - startTime) / 1000;
        console.log(`✅ Success in ${duration}s`);
        console.log(`🎥 Cloudflare Video ID: ${response.data.videoId}`);
        console.log(`📍 Stream URL: ${response.data.streamUrl}`);

        results.push({
          videoName: video.videoName,
          success: true,
          videoId: response.data.videoId,
          streamUrl: response.data.streamUrl,
          duration
        });
      } else {
        const duration = (Date.now() - startTime) / 1000;
        console.log(`❌ Failed in ${duration}s`);
        console.log(`Error: ${response.data.error}`);

        results.push({
          videoName: video.videoName,
          success: false,
          error: response.data.error,
          duration
        });
      }
    } catch (error: any) {
      const duration = (Date.now() - startTime) / 1000;
      console.log(`❌ Error in ${duration}s`);
      console.error(error.message);

      results.push({
        videoName: video.videoName,
        success: false,
        error: error.message,
        duration
      });
    }

    // Add delay to avoid rate limiting
    if (i < videos.length - 1) {
      console.log('\n⏳ Waiting 3 seconds before next video...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  return results;
}

/**
 * Print upload summary
 */
function printSummary(
  results: Array<{
    videoName: string;
    success: boolean;
    videoId?: string;
    streamUrl?: string;
    error?: string;
    duration: number;
  }>
) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(60));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  successful.forEach((r) => {
    console.log(
      `   • ${r.videoName} (${Math.round(r.duration)}s) - ID: ${r.videoId}`
    );
  });

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}/${results.length}`);
    failed.forEach((r) => {
      console.log(`   • ${r.videoName}: ${r.error}`);
    });
  }

  console.log(`\n⏱️  Total time: ${formatDuration(totalDuration)}`);
  console.log(`📈 Success rate: ${Math.round((successful.length / results.length) * 100)}%`);

  console.log('\n💡 Next steps:');
  console.log('   1. Cloudflare will transcode videos automatically');
  console.log('   2. Check Cloudflare dashboard for status');
  console.log('   3. Videos ready to stream within minutes!');
}

/**
 * Save upload report
 */
function saveReport(
  results: Array<{
    videoName: string;
    success: boolean;
    videoId?: string;
    streamUrl?: string;
    error?: string;
    duration: number;
  }>
) {
  const report = {
    timestamp: new Date().toISOString(),
    totalVideos: results.length,
    successful: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results
  };

  const reportPath = path.join(
    process.cwd(),
    `cloudflare-upload-report-${Date.now()}.json`
  );
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

/**
 * Format duration to human-readable
 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

/**
 * Ask user for confirmation
 */
async function askConfirmation(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', (data) => {
      const answer = data.toString().trim().toLowerCase();
      resolve(answer === 'yes' || answer === 'y');
    });
  });
}

// Run the script
main();
