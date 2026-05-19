import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import CloudflareStreamService from './cloudflare-stream.service';

@Controller('api/cloudflare-stream')
export class CloudflareStreamController {
  private readonly logger = new Logger(CloudflareStreamController.name);
  private streamService: CloudflareStreamService;

  constructor() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;

    if (!accountId || !apiToken) {
      throw new Error('Missing Cloudflare credentials in environment variables');
    }

    this.streamService = new CloudflareStreamService(accountId, apiToken, zoneId);
  }

  /**
   * Upload video from Firebase URL to Cloudflare Stream
   * POST /api/cloudflare-stream/import-from-firebase
   */
  @Post('import-from-firebase')
  async importFromFirebase(
    @Body()
    dto: {
      firebaseUrl: string;
      courseId: string;
      videoName: string;
    }
  ) {
    this.logger.log(
      `Importing video from Firebase: ${dto.videoName} (Course: ${dto.courseId})`
    );

    const result = await this.streamService.uploadVideoFromUrl(
      dto.firebaseUrl,
      dto.videoName,
      dto.courseId
    );

    return {
      success: result.success,
      videoId: result.videoId,
      streamUrl: result.streamUrl,
      assetPath: result.assetPath,
      r2Url: result.r2Url,
      message: result.success
        ? `Video uploaded successfully: Asset path ${result.assetPath}`
        : `Upload failed: ${result.error}`,
      error: result.error
    };
  }

  /**
   * Batch import multiple videos from Firebase to Cloudflare
   * Workflow: Firebase → Cloudflare Stream (transcode) → R2 Bucket (storage)
   * POST /api/cloudflare-stream/batch-import
   * 
   * Returns results with R2 asset paths:
   * Example: { videoId: "...", assetPath: "srk/videos/video-id/master.m3u8", r2Url: "https://cdn..." }
   */
  @Post('batch-import')
  async batchImportFromFirebase(
    @Body()
    dto: {
      videos: Array<{
        firebaseUrl: string;
        courseId: string;
        videoName: string;
      }>;
    }
  ) {
    this.logger.log(`Batch importing ${dto.videos.length} videos (Firebase → Cloudflare → R2)`);

    const results = await this.streamService.batchUploadFromFirebase(
      dto.videos,
      (videoIndex, progress) => {
        this.logger.log(`Video ${videoIndex + 1}: ${Math.round(progress * 100)}%`);
      },
      (completed, total) => {
        this.logger.log(`Batch progress: ${completed}/${total} videos imported`);
      }
    );

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return {
      total: results.length,
      successful,
      failed,
      results,
      summary: `${successful}/${results.length} videos imported successfully to Cloudflare`
    };
  }

  /**
   * Get video details from Cloudflare
   * GET /api/cloudflare-stream/:videoId
   */
  @Get(':videoId')
  async getVideoDetails(@Param('videoId') videoId: string) {
    this.logger.log(`Fetching details for video: ${videoId}`);

    const details = await this.streamService.getVideoDetails(videoId);

    return {
      success: !!details,
      data: details,
      streamUrl: details
        ? `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/manifest/video.m3u8`
        : null
    };
  }

  /**
   * Get analytics for a video
   * GET /api/cloudflare-stream/:videoId/analytics
   */
  @Get(':videoId/analytics')
  async getAnalytics(@Param('videoId') videoId: string) {
    this.logger.log(`Fetching analytics for video: ${videoId}`);

    const analytics = await this.streamService.getAnalytics(videoId);

    return {
      success: !!analytics,
      analytics
    };
  }

  /**
   * Generate signed URL for private videos
   * POST /api/cloudflare-stream/:videoId/generate-signed-url
   */
  @Post(':videoId/generate-signed-url')
  async generateSignedUrl(
    @Param('videoId') videoId: string,
    @Body() dto: { expirationSeconds?: number }
  ) {
    this.logger.log(`Generating signed URL for video: ${videoId}`);

    const token = await this.streamService.generateSignedUrl(
      videoId,
      dto.expirationSeconds || 3600
    );

    return {
      success: !!token,
      token,
      signedUrl: token
        ? `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/manifest/video.m3u8?token=${token}`
        : null
    };
  }
}
