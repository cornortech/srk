import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import axios from 'axios';

@Injectable()
export class VideoTranscodingService {
  private readonly logger = new Logger(VideoTranscodingService.name);
  private bucket = admin.storage().bucket();

  /**
   * Transcode a single video to HLS format
   * Creates 3 quality variants: 480p, 720p, 1080p
   */
  async transcodeVideoToHLS(
    firebaseUrl: string,
    courseId: string,
    videoName: string,
    onProgress?: (progress: number) => void
  ): Promise<{ success: boolean; hlsUrl: string; error?: string }> {
    const tempDir = `/tmp/hls-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      this.logger.log(`Starting transcode: ${videoName} for course ${courseId}`);
      
      // Create temp directory
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Step 1: Download video from Firebase
      this.logger.log('Downloading video from Firebase...');
      const inputFile = path.join(tempDir, 'input.mp4');
      await this.downloadVideoFromFirebase(firebaseUrl, inputFile, (progress) => {
        onProgress?.(progress * 0.2); // Download is 20% of total
      });

      // Step 2: Transcode to HLS
      this.logger.log('Transcoding video to HLS variants...');
      const hlsDir = path.join(tempDir, 'hls-output');
      fs.mkdirSync(hlsDir, { recursive: true });

      await this.transcodeWithFFmpeg(inputFile, hlsDir, videoName, (progress) => {
        onProgress?.(20 + progress * 0.7); // Transcoding is 70% of total
      });

      // Step 3: Upload HLS files to Firebase
      this.logger.log('Uploading HLS files to Firebase Storage...');
      const hlsUrl = await this.uploadHLSFilesToFirebase(
        hlsDir,
        courseId,
        videoName,
        (progress) => {
          onProgress?.(90 + progress * 0.1); // Upload is 10% of total
        }
      );

      this.logger.log(`✅ Transcode complete: ${hlsUrl}`);
      return { success: true, hlsUrl };
    } catch (error) {
      this.logger.error(`❌ Transcode failed: ${error.message}`);
      return {
        success: false,
        hlsUrl: '',
        error: error.message
      };
    } finally {
      // Cleanup temp files
      if (fs.existsSync(tempDir)) {
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
          this.logger.log(`Cleaned up temp directory: ${tempDir}`);
        } catch (cleanupError) {
          this.logger.warn(`Failed to cleanup temp dir: ${cleanupError.message}`);
        }
      }
    }
  }

  /**
   * Download video from Firebase Storage
   */
  private async downloadVideoFromFirebase(
    url: string,
    destination: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destination);
      let totalSize = 0;
      let downloadedSize = 0;

      https.get(url, (response) => {
        // Get total file size from headers
        const contentLength = parseInt(response.headers['content-length'] || '0', 10);
        totalSize = contentLength;

        response.on('data', (chunk) => {
          downloadedSize += chunk.length;
          if (totalSize > 0) {
            onProgress?.(downloadedSize / totalSize);
          }
        });

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve();
        });

        file.on('error', reject);
      }).on('error', reject);
    });
  }

  /**
   * Transcode video using FFmpeg to multiple quality levels
   */
  private async transcodeWithFFmpeg(
    inputPath: string,
    outputDir: string,
    videoName: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const variants = [
        { name: '480p', bitrate: '500k', scale: '854x480', bandwidth: 500000 },
        { name: '720p', bitrate: '1500k', scale: '1280x720', bandwidth: 1500000 },
        { name: '1080p', bitrate: '3000k', scale: '1920x1080', bandwidth: 3000000 }
      ];

      let completed = 0;
      const total = variants.length;

      variants.forEach((variant) => {
        this.logger.log(`Transcoding ${variant.name}...`);

        ffmpeg(inputPath)
          .videoCodec('libx264')
          .audioCodec('aac')
          .size(variant.scale)
          .videoBitrate(variant.bitrate)
          .audioBitrate('128k')
          .audioChannels(2)
          .audioFrequency(44100)
          .outputOptions([
            '-preset medium', // balance between speed and compression
            '-hls_time 10', // 10-second segments
            '-hls_list_size 0', // Keep all segments in playlist
            `-hls_segment_filename ${outputDir}/${videoName}-${variant.name}-%03d.ts`
          ])
          .output(`${outputDir}/${videoName}-${variant.name}.m3u8`)
          .on('progress', (progress) => {
            const variantProgress = (completed + progress.percent / 100) / total;
            onProgress?.(variantProgress);
          })
          .on('end', () => {
            this.logger.log(`✅ ${variant.name} transcoding complete`);
            completed++;

            if (completed === total) {
              // Generate master playlist
              this.generateMasterPlaylist(outputDir, videoName, variants);
              resolve();
            }
          })
          .on('error', (error) => {
            this.logger.error(`FFmpeg error for ${variant.name}: ${error.message}`);
            reject(error);
          })
          .run();
      });
    });
  }

  /**
   * Generate master M3U8 playlist pointing to quality variants
   */
  private generateMasterPlaylist(
    outputDir: string,
    videoName: string,
    variants: Array<{ name: string; bandwidth: number; scale: string }>
  ): void {
    let playlistContent = '#EXTM3U\n#EXT-X-VERSION:3\n';

    variants.forEach((variant) => {
      const [width] = variant.scale.split('x').map(Number);
      const height = (parseInt(variant.scale.split('x')[1]) || 480);

      playlistContent += `#EXT-X-STREAM-INF:BANDWIDTH=${variant.bandwidth},RESOLUTION=${width}x${height}\n`;
      playlistContent += `${videoName}-${variant.name}.m3u8\n`;
    });

    const masterPath = path.join(outputDir, `${videoName}.m3u8`);
    fs.writeFileSync(masterPath, playlistContent);
    this.logger.log(`✅ Master playlist created: ${masterPath}`);
  }

  /**
   * Upload all HLS files to Firebase Storage
   */
  private async uploadHLSFilesToFirebase(
    hlsDir: string,
    courseId: string,
    videoName: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const files = fs.readdirSync(hlsDir);
    const baseRemotePath = `courses/${courseId}/videos/${videoName}`;

    let uploaded = 0;

    for (const file of files) {
      const localPath = path.join(hlsDir, file);
      const remotePath = `${baseRemotePath}/${file}`;

      this.logger.log(`Uploading ${file}...`);

      await this.bucket.upload(localPath, {
        destination: remotePath,
        metadata: {
          cacheControl: 'public, max-age=2592000', // 30 days cache
          contentType: this.getMimeType(file)
        }
      });

      uploaded++;
      onProgress?.(uploaded / files.length);
      this.logger.log(`✅ Uploaded ${file} (${uploaded}/${files.length})`);
    }

    const bucket = this.bucket.name;
    const masterPlaylistPath = `${baseRemotePath}/${videoName}.m3u8`;
    const hlsUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(masterPlaylistPath)}?alt=media`;

    return hlsUrl;
  }

  /**
   * Get MIME type based on file extension
   */
  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.m3u8': 'application/x-mpegURL',
      '.ts': 'video/mp2t',
      '.mp4': 'video/mp4'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Batch transcode multiple videos
   */
  async batchTranscodeVideos(
    videos: Array<{ firebaseUrl: string; courseId: string; videoName: string }>,
    onVideoProgress?: (videoIndex: number, progress: number, videoName: string) => void,
    onBatchProgress?: (completed: number, total: number) => void
  ): Promise<
    Array<{
      videoName: string;
      success: boolean;
      hlsUrl?: string;
      error?: string;
    }>
  > {
    const results: Array<{
      videoName: string;
      success: boolean;
      hlsUrl?: string;
      error?: string;
    }> = [];

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      this.logger.log(
        `\n📹 Processing video ${i + 1}/${videos.length}: ${video.videoName}`
      );

      const result = await this.transcodeVideoToHLS(
        video.firebaseUrl,
        video.courseId,
        video.videoName,
        (progress) => {
          onVideoProgress?.(i, progress, video.videoName);
        }
      );

      results.push({
        videoName: video.videoName,
        success: result.success,
        hlsUrl: result.hlsUrl,
        error: result.error
      });

      onBatchProgress?.(i + 1, videos.length);

      // Small delay between videos to avoid overload
      if (i < videos.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    return results;
  }
}
