import axios from 'axios';
import { s3Client } from './r2Service';
import { env } from '../config/env';
import { PutObjectCommand } from '@aws-sdk/client-s3';

interface SegmentInfo {
  filename: string;
  duration: number;
  uri: string;
}

export const hlsService = {
  async downloadHLSManifest(cloudflareStreamUrl: string): Promise<string> {
    try {
      const response = await axios.get(cloudflareStreamUrl, {
        timeout: 30000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to download HLS manifest: ${message}`);
    }
  },

  async downloadHLSSegment(segmentUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(segmentUrl, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      return Buffer.from(response.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to download segment: ${message}`);
    }
  },

  async uploadHLSMasterToR2(videoId: string, masterPlaylistContent: string): Promise<string> {
    try {
      const key = `${env.R2_PREFIX_FOLDER}/videos/${videoId}/master.m3u8`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.R2_BUCKET,
          Key: key,
          Body: Buffer.from(masterPlaylistContent),
          ContentType: 'application/vnd.apple.mpegurl'
        })
      );

      return key;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to upload master.m3u8 to R2: ${message}`);
    }
  },

  async uploadHLSSegmentToR2(videoId: string, segmentFileName: string, segmentData: Buffer): Promise<string> {
    try {
      const key = `${env.R2_PREFIX_FOLDER}/videos/${videoId}/segments/${segmentFileName}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.R2_BUCKET,
          Key: key,
          Body: segmentData,
          ContentType: 'video/mp2t'
        })
      );

      return key;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to upload segment to R2: ${message}`);
    }
  },

  async parseVariantPlaylists(masterContent: string): Promise<string[]> {
    const lines = masterContent.split('\n');
    const variantUrls: string[] = [];

    for (const line of lines) {
      if (!line.startsWith('#') && line.trim()) {
        variantUrls.push(line.trim());
      }
    }

    return variantUrls;
  },

  async parseSegmentUrls(variantContent: string, baseUrl: string): Promise<SegmentInfo[]> {
    const lines = variantContent.split('\n');
    const segments: SegmentInfo[] = [];
    let currentDuration = 0;

    for (const line of lines) {
      if (line.startsWith('#EXTINF:')) {
        const durationStr = line.match(/EXTINF:([\d.]+)/)?.[1];
        currentDuration = durationStr ? parseFloat(durationStr) : 0;
      } else if (!line.startsWith('#') && line.trim()) {
        const uri = line.trim();
        segments.push({
          filename: uri.split('/').pop() || uri,
          duration: currentDuration,
          uri: new URL(uri, baseUrl).toString()
        });
      }
    }

    return segments;
  },

  async uploadHLSFilesToR2(
    videoId: string,
    cloudflareStreamUrl: string,
    onProgress?: (stage: string, progress: number) => void
  ): Promise<{ success: boolean; assetPath?: string; r2Url?: string; error?: string }> {
    try {
      onProgress?.('Downloading master playlist', 0);
      const masterContent = await this.downloadHLSManifest(cloudflareStreamUrl);

      // Upload master.m3u8
      onProgress?.('Uploading master playlist to R2', 0.1);
      const masterKey = await this.uploadHLSMasterToR2(videoId, masterContent);

      // Parse variant playlists
      onProgress?.('Parsing variants', 0.2);
      const baseUrl = cloudflareStreamUrl.substring(0, cloudflareStreamUrl.lastIndexOf('/') + 1);
      const variantUrls = await this.parseVariantPlaylists(masterContent);

      // Download and upload segments
      let totalSegments = 0;
      let uploadedSegments = 0;

      // Count total segments first
      for (const variantUrl of variantUrls) {
        const fullUrl = new URL(variantUrl, baseUrl).toString();
        const variantContent = await this.downloadHLSManifest(fullUrl);
        const segments = await this.parseSegmentUrls(variantContent, baseUrl);
        totalSegments += segments.length;
      }

      // Download and upload segments
      for (const variantUrl of variantUrls) {
        const fullUrl = new URL(variantUrl, baseUrl).toString();
        const variantContent = await this.downloadHLSManifest(fullUrl);
        const segments = await this.parseSegmentUrls(variantContent, baseUrl);

        for (const segment of segments) {
          const segmentData = await this.downloadHLSSegment(segment.uri);
          await this.uploadHLSSegmentToR2(videoId, segment.filename, segmentData);

          uploadedSegments++;
          const progress = 0.2 + (uploadedSegments / totalSegments) * 0.7;
          onProgress?.(`Uploading segments (${uploadedSegments}/${totalSegments})`, progress);
        }
      }

      const assetPath = masterKey;
      const r2Url = `${env.CDN_BASE_URL}/${assetPath}`;

      onProgress?.('Complete', 1.0);

      return {
        success: true,
        assetPath,
        r2Url
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: message
      };
    }
  },

  getHLSCDNUrl(assetPath: string): string {
    return `${env.CDN_BASE_URL}/${assetPath}`;
  }
};
