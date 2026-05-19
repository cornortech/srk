import axios, { AxiosInstance } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';
import { uploadHLSFilesToR2, getHLSCDNUrl } from '../../services/hlsService';

/**
 * Cloudflare Stream API Integration + R2 Upload
 * 
 * Workflow:
 * 1. Upload video to Cloudflare Stream (auto-transcodes to HLS)
 * 2. Download HLS files from Cloudflare
 * 3. Upload to R2 bucket (SRK bucket)
 * 4. Return asset path for database storage
 * 
 * Benefits:
 * - Auto-transcoding (no FFmpeg needed!)
 * - HLS/DASH streaming built-in
 * - Videos stored in your R2 bucket
 * - Consistent with existing resource storage pattern
 * - CDN already configured for R2
 */
export class CloudflareStreamService {
  private api: AxiosInstance;
  private accountId: string;
  private apiToken: string;
  private zoneId: string;

  constructor(accountId: string, apiToken: string, zoneId: string) {
    this.accountId = accountId;
    this.apiToken = apiToken;
    this.zoneId = zoneId;

    this.api = axios.create({
      baseURL: `https://api.cloudflare.com/client/v4/accounts/${accountId}`,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Upload video to Cloudflare Stream
   * Cloudflare automatically transcodes to HLS/DASH
   */
  async uploadVideo(
    videoPath: string,
    videoName: string,
    courseId: string,
    onProgress?: (progress: number) => void
  ): Promise<{
    success: boolean;
    videoId?: string;
    streamUrl?: string;
    hlsManifestUrl?: string;
    dashManifestUrl?: string;
    error?: string;
  }> {
    try {
      console.log(`Uploading ${videoName} to Cloudflare Stream...`);

      // Get video file size for progress tracking
      const fileSize = fs.statSync(videoPath).size;
      const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      console.log(`File size: ${fileSizeMB} MB`);

      // Create form data with video file
      const formData = new FormData();
      formData.append('file', fs.createReadStream(videoPath));
      formData.append('meta', JSON.stringify({
        name: videoName,
        course: courseId,
        uploadedAt: new Date().toISOString()
      }));

      // Upload with progress tracking
      const response = await this.api.post(
        '/stream',
        formData,
        {
          headers: formData.getHeaders(),
          onUploadProgress: (progressEvent: any) => {
            const progress = progressEvent.loaded / progressEvent.total;
            onProgress?.(progress);
            process.stdout.write(
              `\rProgress: ${Math.round(progress * 100)}% (${(
                progressEvent.loaded /
                (1024 * 1024)
              ).toFixed(2)}MB/${fileSizeMB}MB)`
            );
          }
        }
      );

      if (!response.data.success) {
        return {
          success: false,
          error: response.data.errors?.[0]?.message || 'Upload failed'
        };
      }

      const videoData = response.data.result;
      console.log(`\n✅ Upload complete!`);
      console.log(`Video ID: ${videoData.uid}`);

      // Get streaming URLs (Cloudflare auto-generates these)
      const streamUrl = `https://customer-${this.accountId}.cloudflarestream.com/${videoData.uid}/manifest/video.m3u8`;
      const hlsUrl = `https://customer-${this.accountId}.cloudflarestream.com/${videoData.uid}/manifest/video.m3u8`;
      const dashUrl = `https://customer-${this.accountId}.cloudflarestream.com/${videoData.uid}/manifest/video.mpd`;

      return {
        success: true,
        videoId: videoData.uid,
        streamUrl,
        hlsManifestUrl: hlsUrl,
        dashManifestUrl: dashUrl
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Upload error: ${message}`);
      return {
        success: false,
        error: message
      };
    }
  }

  /**
   * Upload video from URL (e.g., Firebase Storage)
   * Workflow:
   * 1. Import to Cloudflare Stream (auto-transcodes)
   * 2. Download HLS files from Cloudflare
   * 3. Upload to R2 bucket
   * 4. Return R2 asset path for database
   */
  async uploadVideoFromUrl(
    sourceUrl: string,
    videoName: string,
    courseId: string,
    onProgress?: (phase: string, progress: number) => void
  ): Promise<{
    success: boolean;
    videoId?: string;
    streamUrl?: string;
    assetPath?: string;
    r2Url?: string;
    error?: string;
  }> {
    try {
      onProgress?.('Importing to Cloudflare Stream', 0.1);
      console.log(`\n📤 Importing ${videoName} to Cloudflare Stream...`);

      const response = await this.api.post('/stream/copy', {
        url: sourceUrl,
        meta: {
          name: videoName,
          course: courseId,
          importedFrom: new URL(sourceUrl).hostname
        }
      });

      if (!response.data.success) {
        return {
          success: false,
          error: response.data.errors?.[0]?.message || 'Import failed'
        };
      }

      const videoData = response.data.result;
      const videoId = videoData.uid;
      const cloudflareHlsUrl = `https://customer-${this.accountId}.cloudflarestream.com/${videoId}/manifest/video.m3u8`;

      console.log(`✅ Imported! Video ID: ${videoId}`);
      console.log(`⏳ Waiting for Cloudflare to transcode...`);
      
      // Wait for transcoding to complete (Cloudflare usually takes 5-10 seconds)
      onProgress?.('Waiting for transcoding', 0.2);
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Upload HLS files to R2
      onProgress?.('Uploading to R2 bucket', 0.3);
      console.log(`\n📁 Uploading HLS to R2 bucket...`);
      
      const r2AssetPath = await uploadHLSFilesToR2(
        videoId,
        cloudflareHlsUrl,
        (phase, progress) => {
          onProgress?.(`R2 Upload: ${phase}`, 0.3 + (progress * 0.6));
          console.log(`  ${phase}: ${Math.round(progress * 100)}%`);
        }
      );

      // Convert to CDN URL
      const r2CdnUrl = getHLSCDNUrl(r2AssetPath);

      console.log(`✅ Complete!`);
      console.log(`   Video ID: ${videoId}`);
      console.log(`   Asset Path: ${r2AssetPath}`);
      console.log(`   CDN URL: ${r2CdnUrl}`);

      onProgress?.('Complete', 1.0);

      return {
        success: true,
        videoId,
        streamUrl: cloudflareHlsUrl,
        assetPath: r2AssetPath,
        r2Url: r2CdnUrl
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`\n❌ Error: ${message}`);
      return {
        success: false,
        error: message
      };
    }
  }

  /**
   * Get video details
   */
  async getVideoDetails(videoId: string): Promise<unknown> {
    try {
      const response = await this.api.get(`/stream/${videoId}`);
      return response.data.result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to get video details: ${message}`);
      return null;
    }
  }

  /**
   * Delete video from Cloudflare
   */
  async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const response = await this.api.delete(`/stream/${videoId}`);
      return response.data.success;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to delete video: ${message}`);
      return false;
    }
  }

  /**
   * List all videos
   */
  async listVideos(limit = 100): Promise<unknown> {
    try {
      const response = await this.api.get('/stream', {
        params: { limit }
      });
      return response.data.result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to list videos: ${message}`);
      return [];
    }
  }

  /**
   * Get analytics for a video
   */
  async getAnalytics(videoId: string): Promise<unknown> {
    try {
      const response = await this.api.get(`/stream/${videoId}/analytics`);
      return response.data.result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to get analytics: ${message}`);
      return null;
    }
  }

  /**
   * Generate signed URL (for private videos)
   */
  async generateSignedUrl(videoId: string, expirationSeconds = 3600): Promise<string | null> {
    try {
      const response = await this.api.post(
        `/stream/${videoId}/token`,
        {
          ttl: expirationSeconds
        }
      );
      return response.data.result.token;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to generate signed URL: ${message}`);
      return null;
    }
  }

  /**
   * Batch upload videos (from Firebase URLs)
   * Each video: Import → Transcode → Upload to R2
   * 
   * Returns R2 asset path for database storage
   * Example: { success: true, assetPath: "srk/videos/video-id/master.m3u8" }
   */
  async batchUploadFromFirebase(
    videos: Array<{
      firebaseUrl: string;
      courseId: string;
      videoName: string;
    }>,
    onVideoProgress?: (videoIndex: number, progress: number) => void,
    onBatchProgress?: (completed: number, total: number) => void
  ): Promise<
    Array<{
      videoName: string;
      success: boolean;
      videoId?: string;
      streamUrl?: string;
      assetPath?: string;
      r2Url?: string;
      error?: string;
      duration: number;
    }>
  > {
    const results: Array<{
      videoName: string;
      success: boolean;
      videoId?: string;
      streamUrl?: string;
      assetPath?: string;
      r2Url?: string;
      error?: string;
      duration: number;
    }> = [];

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const startTime = Date.now();

      console.log(`\n[${i + 1}/${videos.length}] 📤 Processing: ${video.videoName}`);
      console.log('─'.repeat(60));

      const result = await this.uploadVideoFromUrl(
        video.firebaseUrl,
        video.videoName,
        video.courseId,
        (phase, progress) => {
          onVideoProgress?.(i, progress);
        }
      );

      const duration = (Date.now() - startTime) / 1000;

      results.push({
        videoName: video.videoName,
        success: result.success,
        videoId: result.videoId,
        streamUrl: result.streamUrl,
        assetPath: result.assetPath,
        r2Url: result.r2Url,
        error: result.error,
        duration
      });

      onBatchProgress?.(i + 1, videos.length);

      // Add delay to avoid rate limiting
      if (i < videos.length - 1) {
        console.log('\n⏳ Waiting 5 seconds before next video...');
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    return results;
  }
}

export default CloudflareStreamService;
