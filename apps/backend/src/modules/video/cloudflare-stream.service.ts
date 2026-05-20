import axios from 'axios';
import mongoose from 'mongoose';
import { env } from '../../config/env';
import { hlsService } from '../../services/hlsService';

export class CloudflareStreamService {
  async uploadVideoFromUrl(
    sourceUrl: string,
    videoName: string,
    courseId: string,
    onProgress?: (stage: string, progress: number) => void
  ) {
    try {
      onProgress?.('Importing to Cloudflare Stream', 0.1);

      if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) {
        throw new Error('Cloudflare credentials not configured in .env: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN');
      }

      // Step 1: Import video to Cloudflare Stream
      const streamResponse = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/stream/copy`,
        { url: sourceUrl },
        {
          headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      if (!streamResponse.data.success) {
        const errorMsg = streamResponse.data.errors?.[0]?.message || JSON.stringify(streamResponse.data);
        throw new Error(`Cloudflare Stream failed: ${errorMsg}`);
      }

      const videoId = streamResponse.data.result?.uid;
      if (!videoId) {
        throw new Error('No video ID returned from Cloudflare');
      }

      onProgress?.('Waiting for Cloudflare transcoding', 0.3);

      // Step 2: Wait for transcoding to complete (check status)
      let isReady = false;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes with 5-second intervals

      while (!isReady && attempts < maxAttempts) {
        const statusResponse = await axios.get(
          `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/stream/${videoId}`,
          {
            headers: { 'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}` }
          }
        );

        const readyToStream = statusResponse.data.result?.readyToStream;
        if (readyToStream) {
          isReady = true;
          break;
        }

        attempts++;
        const progress = 0.3 + (0.3 * attempts) / maxAttempts;
        onProgress?.('Transcoding in progress', Math.min(progress, 0.59));
        
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      if (!isReady) {
        throw new Error('Cloudflare transcoding timeout (5+ minutes)');
      }

      onProgress?.('Downloading HLS from Cloudflare', 0.6);

      // Step 3: Download HLS manifest and upload to R2
      const cloudflareHlsUrl = `https://customer-${env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
      
      const uploadResult = await hlsService.uploadHLSFilesToR2(
        videoId,
        cloudflareHlsUrl,
        (stage: string, progress: number) => {
          const adjustedProgress = 0.6 + progress * 0.35;
          onProgress?.(stage, adjustedProgress);
        }
      );

      const r2AssetPath = `srk/videos/${videoId}/master.m3u8`;
      const r2CdnUrl = `${env.CDN_BASE_URL}/${r2AssetPath}`;

      onProgress?.('Updating database', 0.95);

      // Step 4: Update database with asset path
      const database = mongoose.connection.db;
      if (!database) {
        console.warn('MongoDB connection not ready, skipping database update');
      } else {
        const courseVideosCollection = database.collection('coursevideos');
        await courseVideosCollection.updateOne(
          { _id: new mongoose.Types.ObjectId(courseId) },
          { $set: { videoUrl: r2AssetPath } }
        );
      }

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
      let fullError = message;
      
      // If it's an axios error, log the response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        fullError = `${message}. Status: ${axiosError.response?.status}. Data: ${JSON.stringify(axiosError.response?.data)}`;
      }
      
      console.error(`\n❌ Error: ${fullError}`);
      return {
        success: false,
        error: fullError
      };
    }
  }

  async batchUploadFromFirebase(videoIds: string[]) {
    const results = [];
    const delayBetweenUploads = 5000; // 5 seconds

    for (let i = 0; i < videoIds.length; i++) {
      try {
        const database = mongoose.connection.db;
        if (!database) {
          results.push({ videoId: videoIds[i], error: 'MongoDB not connected' });
          continue;
        }

        const courseVideosCollection = database.collection('coursevideos');
        const video = await courseVideosCollection.findOne({
          _id: new mongoose.Types.ObjectId(videoIds[i])
        });
        
        if (!video) {
          results.push({ videoId: videoIds[i], error: 'Video not found' });
          continue;
        }

        const result = await this.uploadVideoFromUrl(
          video.videoUrl,
          video.name,
          videoIds[i]
        );

        results.push(result);

        if (i < videoIds.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenUploads));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        results.push({ videoId: videoIds[i], error: message });
      }
    }

    return results;
  }

  async getVideoDetails(videoId: string) {
    try {
      const response = await axios.get(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/stream/${videoId}`,
        {
          headers: { 'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}` }
        }
      );
      return response.data.result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to get video details: ${message}`);
      return null;
    }
  }

  async deleteVideo(videoId: string) {
    try {
      await axios.delete(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/stream/${videoId}`,
        {
          headers: { 'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}` }
        }
      );
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, error: message };
    }
  }

  async listVideos() {
    try {
      const response = await axios.get(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/stream?status=ready`,
        {
          headers: { 'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}` }
        }
      );
      return response.data.result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to list videos: ${message}`);
      return [];
    }
  }

  async getAnalytics(videoId: string) {
    try {
      const response = await axios.get(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/stream/${videoId}/statistics`,
        {
          headers: { 'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}` }
        }
      );
      return response.data.result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to get analytics: ${message}`);
      return null;
    }
  }

  async generateSignedUrl(videoId: string, expirationHours = 1): Promise<string | null> {
    try {
      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/stream/${videoId}/token`,
        { exp: Math.floor(Date.now() / 1000) + expirationHours * 3600 },
        {
          headers: { 'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}` }
        }
      );
      return response.data.result?.token || null;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to generate signed URL: ${message}`);
      return null;
    }
  }
}

