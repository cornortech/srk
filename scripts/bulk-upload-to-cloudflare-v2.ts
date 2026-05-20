import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const mongodb_url = process.env.DATABASE_URL || '';

if (!mongodb_url) {
  throw new Error('DATABASE_URL environment variable not set');
}

interface CourseVideo {
  _id: string;
  name: string;
  videoUrl: string;
  courseId: string;
  duration?: number;
  thumbnailUrl?: string;
}

interface UploadResult {
  videoId: string;
  videoName: string;
  success: boolean;
  assetPath?: string;
  r2Url?: string;
  error?: string;
  timeToUpload?: number;
}

const BATCH_DELAY_MS = 5000; // 5 seconds between uploads to avoid throttling
const results: UploadResult[] = [];

async function connectDatabase() {
  try {
    await mongoose.connect(mongodb_url);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Failed to connect to MongoDB:', message);
    process.exit(1);
  }
}

async function getVideosNeedingUpload() {
  try {
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection not available');

    const videosCollection = db.collection('coursevideos');
    
    // Find videos that don't have asset paths (not yet uploaded to R2)
    const videos = await videosCollection
      .find({
        $or: [
          { videoUrl: { $regex: '^https://firebasestorage' } },
          { videoUrl: { $not: { $regex: '^srk/videos' } } }
        ]
      })
      .limit(100)
      .toArray();

    return videos as unknown as CourseVideo[];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Error fetching videos:', message);
    return [];
  }
}

async function uploadVideoToCloudflare(video: CourseVideo): Promise<UploadResult> {
  const startTime = Date.now();
  
  try {
    // Import the service directly
    const { CloudflareStreamService } = await import(
      '../apps/backend/src/modules/video/cloudflare-stream.service'
    );
    
    const service = new CloudflareStreamService();

    console.log(`\n📹 Uploading: ${video.name}`);
    console.log(`   Video ID: ${video._id}`);
    console.log(`   URL: ${video.videoUrl.substring(0, 80)}...`);
    
    const result = await service.uploadVideoFromUrl(
      video.videoUrl,
      video.name,
      video._id as string,
      (stage: string, progress: number) => {
        const percentage = Math.round(progress * 100);
        console.log(`   ${stage}: ${percentage}%`);
      }
    );

    const timeToUpload = (Date.now() - startTime) / 1000;

    if (result.success) {
      console.log(`✅ Success! Asset path: ${result.assetPath}`);
      console.log(`   R2 URL: ${result.r2Url}`);
      console.log(`   Time taken: ${timeToUpload.toFixed(2)}s`);
      
      return {
        videoId: video._id,
        videoName: video.name,
        success: true,
        assetPath: result.assetPath,
        r2Url: result.r2Url,
        timeToUpload
      };
    } else {
      console.error(`❌ Failed: ${result.error}`);
      return {
        videoId: video._id,
        videoName: video.name,
        success: false,
        error: result.error,
        timeToUpload
      };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const timeToUpload = (Date.now() - startTime) / 1000;
    console.error(`❌ Error: ${message}`);
    console.error(`   Stack: ${error instanceof Error ? error.stack : ''}`);
    
    return {
      videoId: video._id,
      videoName: video.name,
      success: false,
      error: message,
      timeToUpload
    };
  }
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs.toFixed(0)}s`;
}

async function main() {
  console.log('🚀 Cloudflare Stream Bulk Upload Script v2');
  console.log('==========================================\n');

  await connectDatabase();

  const videos = await getVideosNeedingUpload();

  if (videos.length === 0) {
    console.log('✅ No videos need uploading (all already migrated)');
    await mongoose.connection.close();
    process.exit(0);
  }

  console.log(`\n📊 Found ${videos.length} videos to upload`);
  
  // Calculate timing estimates
  const estimatedTimePerVideo = 120; // Conservative estimate: 2 minutes per video
  const totalEstimatedTime = videos.length * estimatedTimePerVideo;
  const delayTime = (videos.length - 1) * (BATCH_DELAY_MS / 1000);
  const totalTime = totalEstimatedTime + delayTime;

  console.log(`\n⏱️  Timing Estimates:`);
  console.log(`   - Per video: ~${estimatedTimePerVideo}s`);
  console.log(`   - Total estimated: ${formatTime(totalTime)}`);
  console.log(`   - Batch delay: ${formatTime(delayTime)}`);

  console.log(`\n🔄 Starting upload sequence...\n`);

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    console.log(`\n[${i + 1}/${videos.length}] Processing video...`);
    
    const result = await uploadVideoToCloudflare(video);
    results.push(result);

    // Add delay between uploads (except after the last one)
    if (i < videos.length - 1) {
      console.log(`   ⏳ Waiting ${BATCH_DELAY_MS / 1000}s before next upload...`);
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  // Print summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n\n' + '='.repeat(50));
  console.log('📈 UPLOAD SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${successful}/${videos.length}`);
  console.log(`❌ Failed: ${failed}/${videos.length}`);

  if (results.filter(r => r.timeToUpload).length > 0) {
    const times = results.filter(r => r.timeToUpload).map(r => r.timeToUpload || 0);
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`⏱️  Average time per video: ${formatTime(avgTime)}`);
  }

  // Save report to file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = `/Users/santoshkunwar/Desktop/code/nx/srk/cloudflare-upload-report-${timestamp}.json`;
  
  const fs = await import('fs').then(m => m.promises);
  await fs.writeFile(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalVideos: videos.length,
    successful,
    failed,
    results,
    summary: {
      successRate: `${((successful / videos.length) * 100).toFixed(1)}%`,
      totalTimeSeconds: results.reduce((sum, r) => sum + (r.timeToUpload || 0), 0)
    }
  }, null, 2));

  console.log(`\n📄 Report saved to: ${reportPath}`);

  // Print failed videos for manual review
  if (failed > 0) {
    console.log('\n⚠️  Failed Videos:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.videoName} (${r.videoId}): ${r.error}`);
    });
  }

  await mongoose.connection.close();
  console.log('\n✅ Done! Connection closed.');
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('❌ Fatal error:', message);
  process.exit(1);
});
