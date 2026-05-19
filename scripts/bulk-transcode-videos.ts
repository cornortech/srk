#!/usr/bin/env node
/**
 * Bulk Video Transcoding Script
 * 
 * Usage:
 * npx ts-node scripts/bulk-transcode-videos.ts
 * 
 * What it does:
 * 1. Fetches all courses with videos
 * 2. Creates HLS version for each video
 * 3. Updates database with HLS URLs
 * 4. Generates progress reports
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
  hlsPlaylistUrl?: string;
}

interface TranscodeJob {
  videoId: string;
  firebaseUrl: string;
  courseId: string;
  videoName: string;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🎬 SRK University - Bulk Video Transcoding');
  console.log('=========================================\n');

  try {
    // Step 1: Get all videos that need transcoding
    console.log('📹 Fetching videos from database...');
    const videosToTranscode = await getVideosNeedingTranscode();
    
    if (videosToTranscode.length === 0) {
      console.log('✅ No videos need transcoding. All videos are already in HLS format!');
      return;
    }

    console.log(
      `\n📊 Found ${videosToTranscode.length} videos to transcode:\n`
    );
    videosToTranscode.forEach((video, index) => {
      console.log(
        `  ${index + 1}. ${video.videoName} (Course: ${video.courseId})`
      );
    });

    // Step 2: Confirm with user
    const shouldProceed = await askConfirmation(
      `\n⏱️ This will take approximately ${Math.ceil(
        videosToTranscode.length * 45
      )} minutes.\n✅ Proceed with transcoding? (yes/no): `
    );

    if (!shouldProceed) {
      console.log('❌ Cancelled by user');
      process.exit(0);
    }

    // Step 3: Start batch transcoding
    console.log('\n🚀 Starting batch transcoding...\n');
    const results = await transcodeVideos(videosToTranscode);

    // Step 4: Print summary
    printSummary(results);

    // Step 5: Save report
    saveReport(results);

    console.log(
      '\n✅ Transcoding complete! HLS URLs have been saved to database.'
    );
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Fetch videos from your backend that need transcoding
 */
async function getVideosNeedingTranscode(): Promise<TranscodeJob[]> {
  try {
    // This endpoint should return all videos without hlsPlaylistUrl
    const response = await axios.get(`${API_BASE_URL}/api/videos/list`);
    const videos: Video[] = response.data;

    // Filter videos that don't have HLS playlist yet
    const transcodeJobs = videos
      .filter((v) => !v.hlsPlaylistUrl)
      .map((v) => ({
        videoId: v._id,
        firebaseUrl: v.videoUrl,
        courseId: v.courseId,
        videoName: v.name
      }));

    return transcodeJobs;
  } catch (error) {
    console.warn(
      '⚠️ Could not fetch videos from API. Using manual list instead.'
    );
    // Return empty if API not available - user can provide list manually
    return [];
  }
}

/**
 * Transcode videos one by one
 */
async function transcodeVideos(
  videos: TranscodeJob[]
): Promise<
  Array<{
    videoName: string;
    success: boolean;
    hlsUrl?: string;
    error?: string;
    duration: number;
  }>
> {
  const results: Array<{
    videoName: string;
    success: boolean;
    hlsUrl?: string;
    error?: string;
    duration: number;
  }> = [];

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const startTime = Date.now();

    console.log(
      `\n[${i + 1}/${videos.length}] 🎥 Transcoding: ${video.videoName}`
    );
    console.log('─'.repeat(60));

    try {
      const response = await axios.post(`${API_BASE_URL}/api/videos/transcode`, {
        firebaseUrl: video.firebaseUrl,
        courseId: video.courseId,
        videoName: video.videoName
      });

      if (response.data.success) {
        const duration = (Date.now() - startTime) / 1000;
        console.log(`✅ Success in ${duration}s`);
        console.log(`📍 HLS URL: ${response.data.hlsUrl}`);

        results.push({
          videoName: video.videoName,
          success: true,
          hlsUrl: response.data.hlsUrl,
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
    } catch (error) {
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

    // Add delay between videos
    if (i < videos.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next video...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return results;
}

/**
 * Print transcoding summary
 */
function printSummary(
  results: Array<{
    videoName: string;
    success: boolean;
    hlsUrl?: string;
    error?: string;
    duration: number;
  }>
) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TRANSCODING SUMMARY');
  console.log('='.repeat(60));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  successful.forEach((r) => {
    console.log(
      `   • ${r.videoName} (${Math.round(r.duration / 60)} min ${Math.round(r.duration % 60)} sec)`
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
}

/**
 * Save transcoding report to file
 */
function saveReport(
  results: Array<{
    videoName: string;
    success: boolean;
    hlsUrl?: string;
    error?: string;
    duration: number;
  }>
) {
  const report = {
    timestamp: new Date().toISOString(),
    totalVideos: results.length,
    successful: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results: results
  };

  const reportPath = path.join(
    process.cwd(),
    `transcode-report-${Date.now()}.json`
  );
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

/**
 * Format duration to human-readable format
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
