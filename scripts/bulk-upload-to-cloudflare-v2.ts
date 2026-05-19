#!/usr/bin/env node
/**
 * Bulk Upload Course Videos to Cloudflare Stream
 * 
 * This script:
 * 1. Fetches all course videos from database
 * 2. Uploads each from Firebase → Cloudflare Stream (auto-transcodes HLS)
 * 3. Updates courseVideo document with asset path: cloudflare-stream/videos/{videoId}
 * 4. Shows progress and timing estimates
 * 
 * Usage:
 * npx ts-node scripts/bulk-upload-to-cloudflare-v2.ts
 * 
 * TIMING EXPECTATIONS:
 * =====================
 * - Upload per video: 5-30 seconds (depends on file size)
 * - 5 videos: ~2-3 minutes (upload only)
 * - Cloudflare transcoding: 5-15 minutes after upload (happens automatically in parallel)
 * 
 * TOTAL TIME:
 * - Upload: ~2-3 minutes for 5 videos
 * - Transcoding: ~5-15 minutes (automatic, in background on Cloudflare)
 * - TOTAL: ~10-20 minutes for full setup
 * 
 * After upload completes:
 * ✅ Your database is updated with asset paths
 * ✅ Videos are uploading to Cloudflare
 * ✅ Cloudflare is auto-transcoding to HLS
 * ⏳ You can check progress in Cloudflare dashboard while videos transcode
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';

interface CourseVideo {
  _id: string;
  name: string;
  videoUrl: string;
  courseId: string;
  duration: number;
  cloudflareVideoId?: string;
}

interface UploadJob {
  _id: string;
  firebaseUrl: string;
  courseId: string;
  videoName: string;
  durationSeconds: number;
}

interface UploadResult {
  videoId: string;
  videoName: string;
  success: boolean;
  videoId?: string;
  assetPath?: string;
  streamUrl?: string;
  error?: string;
  uploadTime: number;
}

/**
 * Estimate file size based on duration
 * Assuming ~200-500 Mbps compressed video
 */
function estimateFileSizeMB(durationSeconds: number): number {
  // Average compressed bitrate: ~350 Mbps
  const bitrateMbps = 350;
  const sizeMB = (durationSeconds * bitrateMbps) / (8 * 60);
  return Math.round(sizeMB);
}

/**
 * Get timing estimate based on file size
 */
function getTimingEstimate(sizeMB: number): { upload: string; transcode: string } {
  if (sizeMB < 100) {
    return { upload: '5-10 seconds', transcode: '2-3 minutes' };
  } else if (sizeMB < 500) {
    return { upload: '10-20 seconds', transcode: '3-5 minutes' };
  } else if (sizeMB < 1000) {
    return { upload: '20-40 seconds', transcode: '5-8 minutes' };
  } else if (sizeMB < 2000) {
    return { upload: '1-2 minutes', transcode: '8-15 minutes' };
  } else {
    return { upload: '2-5 minutes', transcode: '15-25 minutes' };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('☁️  CLOUDFLARE STREAM - BULK UPLOAD COURSE VIDEOS');
  console.log('='.repeat(70));

  console.log('\n📋 TIMING EXPECTATIONS:');
  console.log('   Upload time: 5-30 seconds per video');
  console.log('   5 videos: ~2-3 minutes (upload phase)');
  console.log('   Transcoding: 5-15 minutes (automatic, happens in background)');
  console.log('   TOTAL: ~10-20 minutes for complete setup\n');

  // Verify environment
  if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
    console.error('❌ Error: CLOUDFLARE_ACCOUNT_ID not set in environment');
    console.error('\n   Set it using:');
    console.error('   export CLOUDFLARE_ACCOUNT_ID="your-account-id"');
    process.exit(1);
  }

  if (!process.env.CLOUDFLARE_API_TOKEN) {
    console.error('❌ Error: CLOUDFLARE_API_TOKEN not set in environment');
    console.error('\n   Get it from: https://dash.cloudflare.com/profile/api-tokens');
    process.exit(1);
  }

  try {
    // Step 1: Get videos to upload
    console.log('📹 Fetching course videos from database...');
    const videosToUpload = await getVideosNeedingUpload();

    if (videosToUpload.length === 0) {
      console.log('✅ No videos need uploading. All are already on Cloudflare!');
      return;
    }

    console.log(`✅ Found ${videosToUpload.length} videos to upload:\n`);

    let totalUploadTimeEstimate = 0;
    let maxTranscodeTime = 0;

    videosToUpload.forEach((video, index) => {
      const sizeMB = estimateFileSizeMB(video.durationSeconds);
      const timing = getTimingEstimate(sizeMB);
      const transcodeMins = parseInt(timing.transcode.split('-')[1].replace(/[^0-9]/g, ''));
      maxTranscodeTime = Math.max(maxTranscodeTime, transcodeMins);

      console.log(`  ${index + 1}. ${video.videoName}`);
      console.log(`     Duration: ${formatDuration(video.durationSeconds)} | Size: ~${sizeMB}MB`);\n      console.log(`     Upload: ${timing.upload} | Transcode: ${timing.transcode}`);
    });

    // Calculate totals
    const uploadPhaseTotal = videosToUpload.reduce((sum, v) => {
      const sizeMB = estimateFileSizeMB(v.durationSeconds);
      const uploadSecs = Math.max(5, Math.ceil(sizeMB / 30));
      return sum + uploadSecs;
    }, 0);

    console.log('\n' + '-'.repeat(70));
    console.log('⏱️  ESTIMATED TIMELINE:');
    console.log(`   Upload phase: ~${formatSeconds(uploadPhaseTotal)} (${videosToUpload.length} videos)`);\n    console.log(`   Transcoding: ~${maxTranscodeTime} minutes (happens in background)`);\n    console.log(`   TOTAL TIME: ~${Math.ceil(uploadPhaseTotal / 60) + maxTranscodeTime} minutes`);\n    console.log('-'.repeat(70) + '\\n');

    // Step 2: Confirm with user
    const shouldProceed = await askConfirmation(\n      `Ready to upload ${videosToUpload.length} videos to Cloudflare? (yes/no): `\n    );

    if (!shouldProceed) {
      console.log('❌ Cancelled by user');
      process.exit(0);
    }

    // Step 3: Start bulk upload
    console.log('\\n🚀 Starting upload to Cloudflare Stream...\\n');
    const results = await uploadVideos(videosToUpload);

    // Step 4: Print summary
    printSummary(results, maxTranscodeTime);

    // Step 5: Save report
    saveReport(results);

    console.log('\\n' + '='.repeat(70));
    console.log('✅ UPLOAD COMPLETE!');
    console.log('='.repeat(70));

    console.log('\\n📝 What happens next:');
    console.log('   1. ✅ Videos uploaded to Cloudflare');
    console.log('   2. ✅ Database updated with asset paths');
    console.log('   3. ⏳ Cloudflare transcoding (5-15 mins, automatic)');
    console.log('   4. 📊 Monitor progress: https://dash.cloudflare.com/account/stream');
    console.log('   5. 🎬 Videos ready to stream in ~10-20 minutes total\\n');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Fetch course videos from database that need uploading
 */
async function getVideosNeedingUpload(): Promise<UploadJob[]> {
  try {
    // Get all course videos from API
    const response = await axios.get(`${API_BASE_URL}/api/course/getVideosOfCourse/all`, {
      timeout: 10000
    });

    if (!response.data) {
      throw new Error('No course videos found in response');
    }

    const videos: CourseVideo[] = Array.isArray(response.data) ? response.data : response.data.body || [];

    // Filter videos that don't have Cloudflare asset path yet
    const uploadJobs = videos
      .filter((v) => {
        // Skip if already has cloudflare-stream asset path
        return !v.videoUrl?.startsWith('cloudflare-stream/');
      })
      .map((v) => ({
        _id: v._id,
        firebaseUrl: v.videoUrl,
        courseId: v.courseId,
        videoName: v.name,
        durationSeconds: v.duration || 3600
      }));

    return uploadJobs;
  } catch (error: any) {
    console.error('❌ Failed to fetch videos from database');
    console.error(`\\nError: ${error.message}\\n`);
    console.log('Troubleshooting:');
    console.log('   1. Is backend running? npm run start:backend');
    console.log('   2. Is MongoDB connected?');
    console.log('   3. Do course videos exist in database?\\n');
    process.exit(1);
  }
}

/**
 * Upload videos to Cloudflare one by one
 */\nasync function uploadVideos(\n  videos: UploadJob[]\n): Promise<UploadResult[]> {\n  const results: UploadResult[] = [];\n\n  for (let i = 0; i < videos.length; i++) {\n    const video = videos[i];\n    const startTime = Date.now();\n    const sizeMB = estimateFileSizeMB(video.durationSeconds);\n    const timing = getTimingEstimate(sizeMB);\n\n    console.log(`[${i + 1}/${videos.length}] ☁️  Uploading: ${video.videoName}`);\n    console.log(`          Size: ~${sizeMB}MB | Expected: ${timing.upload}`);\n\n    try {\n      const response = await axios.post(\n        `${API_BASE_URL}/api/cloudflare-stream/import-from-firebase`,\n        {\n          firebaseUrl: video.firebaseUrl,\n          courseId: video.courseId,\n          videoName: video.videoName\n        },\n        { timeout: 120000 } // 2 minute timeout\n      );\n\n      const uploadTime = (Date.now() - startTime) / 1000;\n\n      if (response.data.success) {\n        console.log(`          ✅ Done in ${formatSeconds(uploadTime)}`);\n        console.log(`          📁 Asset: ${response.data.assetPath}`);\n\n        results.push({\n          videoId: video._id,\n          videoName: video.videoName,\n          success: true,\n          videoId: response.data.videoId,\n          assetPath: response.data.assetPath,\n          streamUrl: response.data.streamUrl,\n          uploadTime\n        });\n      } else {\n        const uploadTime = (Date.now() - startTime) / 1000;\n        console.log(`          ❌ Failed in ${formatSeconds(uploadTime)}`);\n        console.log(`          Error: ${response.data.error}`);\n\n        results.push({\n          videoId: video._id,\n          videoName: video.videoName,\n          success: false,\n          error: response.data.error,\n          uploadTime\n        });\n      }\n    } catch (error: any) {\n      const uploadTime = (Date.now() - startTime) / 1000;\n      console.log(`          ❌ Error in ${formatSeconds(uploadTime)}`);\n      console.log(`          ${error.message}`);\n\n      results.push({\n        videoId: video._id,\n        videoName: video.videoName,\n        success: false,\n        error: error.message,\n        uploadTime\n      });\n    }\n\n    // Delay between uploads (Cloudflare rate limit)\n    if (i < videos.length - 1) {\n      process.stdout.write('          ⏳ Waiting 2 seconds...\\n');\n      await new Promise((resolve) => setTimeout(resolve, 2000));\n    }\n\n    console.log('');\n  }\n\n  return results;\n}\n\n/**\n * Print upload summary\n */\nfunction printSummary(results: UploadResult[], maxTranscodeTime: number) {\n  const successful = results.filter((r) => r.success);\n  const failed = results.filter((r) => !r.success);\n  const totalUploadTime = results.reduce((sum, r) => sum + r.uploadTime, 0);\n\n  console.log('📊 SUMMARY');\n  console.log('─'.repeat(70));\n  console.log(`✅ Successful: ${successful.length}/${results.length}`);\n  if (failed.length > 0) {\n    console.log(`❌ Failed: ${failed.length}/${results.length}`);\n  }\n\n  console.log(`\\n⏱️  Upload Statistics:`);\n  console.log(`   Total time: ${formatSeconds(totalUploadTime)}`);\n  console.log(`   Average per video: ${formatSeconds(totalUploadTime / results.length)}`);\n  console.log(`   Fastest: ${formatSeconds(Math.min(...results.map(r => r.uploadTime)))}`);\n  console.log(`   Slowest: ${formatSeconds(Math.max(...results.map(r => r.uploadTime)))}`);\n\n  console.log(`\\n📈 Next Phase (Automatic Transcoding):`);\n  console.log(`   Duration: ~${maxTranscodeTime} minutes`);\n  console.log(`   Status: Happens automatically on Cloudflare servers`);\n  console.log(`   Check progress: https://dash.cloudflare.com/account/stream`);\n\n  const totalTime = totalUploadTime + (maxTranscodeTime * 60);\n  console.log(`\\n⏲️  TOTAL TIME ESTIMATE:`);\n  console.log(`   Upload: ${formatSeconds(totalUploadTime)}`);\n  console.log(`   + Transcoding: ~${maxTranscodeTime} min`);\n  console.log(`   = TOTAL: ~${formatSeconds(totalTime)}`);\n}\n\n/**\n * Save report to file\n */\nfunction saveReport(results: UploadResult[]) {\n  const successful = results.filter((r) => r.success);\n  const report = {\n    timestamp: new Date().toISOString(),\n    totalVideos: results.length,\n    successful: successful.length,\n    failed: results.filter((r) => !r.success).length,\n    totalUploadTime: results.reduce((sum, r) => sum + r.uploadTime, 0),\n    successRate: Math.round((successful.length / results.length) * 100),\n    details: results.map((r) => ({\n      videoName: r.videoName,\n      success: r.success,\n      assetPath: r.assetPath,\n      uploadTime: formatSeconds(r.uploadTime),\n      error: r.error\n    }))\n  };\n\n  const reportPath = path.join(\n    process.cwd(),\n    `cloudflare-upload-report-${Date.now()}.json`\n  );\n  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));\n  console.log(`\\n📄 Report: ${reportPath}`);\n}\n\n/**\n * Format seconds to human-readable\n */\nfunction formatSeconds(seconds: number): string {\n  if (seconds < 60) return `${Math.round(seconds)}s`;\n  const mins = Math.floor(seconds / 60);\n  const secs = Math.round(seconds % 60);\n  return `${mins}m ${secs}s`;\n}\n\n/**\n * Format duration seconds to human-readable\n */\nfunction formatDuration(totalSeconds: number): string {\n  const hours = Math.floor(totalSeconds / 3600);\n  const minutes = Math.floor((totalSeconds % 3600) / 60);\n  const seconds = Math.floor(totalSeconds % 60);\n\n  if (hours > 0) return `${hours}h ${minutes}m`;\n  if (minutes > 0) return `${minutes}m ${seconds}s`;\n  return `${seconds}s`;\n}\n\n/**\n * Ask user for confirmation\n */\nasync function askConfirmation(question: string): Promise<boolean> {\n  return new Promise((resolve) => {\n    process.stdout.write(question);\n    process.stdin.setEncoding('utf8');\n    process.stdin.once('data', (data) => {\n      const answer = data.toString().trim().toLowerCase();\n      resolve(answer === 'yes' || answer === 'y');\n    });\n  });\n}\n\n// Run the script\nmain();
