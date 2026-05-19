import { Controller, Post, Body, Logger } from '@nestjs/common';
import { VideoTranscodingService } from './video-transcoding.service';

@Controller('api/videos')
export class VideoController {
  private readonly logger = new Logger(VideoController.name);

  constructor(private videoTranscodingService: VideoTranscodingService) {}

  /**
   * Transcode a single video to HLS
   * POST /api/videos/transcode
   * Body: {
   *   firebaseUrl: string,
   *   courseId: string,
   *   videoName: string
   * }
   */
  @Post('transcode')
  async transcodeVideo(
    @Body()
    dto: {
      firebaseUrl: string;
      courseId: string;
      videoName: string;
    }
  ) {
    this.logger.log(
      `Transcode request: ${dto.videoName} for course ${dto.courseId}`
    );

    const result = await this.videoTranscodingService.transcodeVideoToHLS(
      dto.firebaseUrl,
      dto.courseId,
      dto.videoName
    );

    return {
      success: result.success,
      hlsUrl: result.hlsUrl,
      message: result.success
        ? `Video transcoded successfully: ${result.hlsUrl}`
        : `Transcode failed: ${result.error}`,
      error: result.error
    };
  }

  /**
   * Batch transcode multiple videos
   * POST /api/videos/transcode-batch
   * Body: {
   *   videos: Array<{
   *     firebaseUrl: string,
   *     courseId: string,
   *     videoName: string
   *   }>
   * }
   */
  @Post('transcode-batch')
  async batchTranscodeVideos(
    @Body() dto: { videos: Array<{ firebaseUrl: string; courseId: string; videoName: string }> }
  ) {
    this.logger.log(
      `Batch transcode request: ${dto.videos.length} videos`
    );

    const results = await this.videoTranscodingService.batchTranscodeVideos(
      dto.videos,
      (videoIndex, progress, videoName) => {
        this.logger.log(
          `[${videoIndex + 1}/${dto.videos.length}] ${videoName}: ${Math.round(progress * 100)}%`
        );
      },
      (completed, total) => {
        this.logger.log(
          `\n📊 Batch progress: ${completed}/${total} videos completed`
        );
      }
    );

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return {
      total: results.length,
      successful,
      failed,
      results,
      summary: `${successful}/${results.length} videos transcoded successfully`
    };
  }
}
