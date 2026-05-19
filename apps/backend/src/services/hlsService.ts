import { s3Client } from './r2Service';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env';
import axios from 'axios';
import * as path from 'path';

const R2_BUCKET = env.R2_BUCKET;
const CDN_BASE_URL = env.CDN_BASE_URL;
const R2_PREFIX_FOLDER = env.R2_PREFIX_FOLDER;

/**
 * Video HLS Service - Manages HLS video uploads to R2
 * 
 * Workflow:
 * 1. Video uploaded to Cloudflare Stream (auto-transcodes)
 * 2. Download HLS manifest and segments from Cloudflare
 * 3. Upload to R2 bucket with asset path format
 * 4. Store asset path in database (e.g., "srk/videos/video-id")
 * 5. CDN serves videos from R2
 */

/**
 * Download HLS master playlist from Cloudflare Stream
 * @param cloudflareStreamUrl - Full HLS URL from Cloudflare Stream
 * @returns Master playlist content
 */
export async function downloadHLSManifest(cloudflareStreamUrl: string): Promise<string> {
  try {
    const response = await axios.get(cloudflareStreamUrl, {
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to download HLS manifest: ${message}`);
    throw error;
  }
}

/**
 * Download HLS segment from Cloudflare Stream
 * @param segmentUrl - Full URL to segment (.ts file)
 * @returns Segment data as buffer
 */
export async function downloadHLSSegment(segmentUrl: string): Promise<Buffer> {
  try {
    const response = await axios.get(segmentUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    });
    return Buffer.from(response.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to download HLS segment: ${message}`);
    throw error;
  }
}

/**
 * Upload HLS master playlist to R2
 * @param videoId - Cloudflare Stream video ID
 * @param masterPlaylistContent - Content of master.m3u8
 * @returns Asset path (e.g., "srk/videos/video-id/master.m3u8")
 */
export async function uploadHLSMasterToR2(
  videoId: string,
  masterPlaylistContent: string
): Promise<string> {
  try {
    const assetPath = `${R2_PREFIX_FOLDER}/videos/${videoId}/master.m3u8`;
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: assetPath,
      Body: Buffer.from(masterPlaylistContent),
      ContentType: 'application/vnd.apple.mpegurl'
    });

    await s3Client.send(command);
    console.log(`HLS master uploaded to R2: ${assetPath}`);
    
    return assetPath;
  } catch (error) {
    console.error('Error uploading HLS master to R2:', error);
    throw error;
  }
}

/**
 * Upload HLS segment to R2
 * @param videoId - Cloudflare Stream video ID
 * @param segmentFileName - Name of segment file (e.g., "0001.ts")
 * @param segmentData - Segment data buffer
 * @returns Asset path in R2
 */
export async function uploadHLSSegmentToR2(
  videoId: string,
  segmentFileName: string,
  segmentData: Buffer
): Promise<string> {
  try {
    const assetPath = `${R2_PREFIX_FOLDER}/videos/${videoId}/${segmentFileName}`;
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: assetPath,
      Body: segmentData,
      ContentType: 'video/mp2t'
    });

    await s3Client.send(command);
    return assetPath;
  } catch (error) {
    console.error('Error uploading HLS segment to R2:', error);
    throw error;
  }
}

/**
 * Batch upload all HLS files (master + segments) to R2
 * @param videoId - Cloudflare Stream video ID
 * @param cloudflareStreamUrl - Full HLS manifest URL from Cloudflare
 * @param onProgress - Progress callback
 * @returns Asset path to master playlist
 */
export async function uploadHLSFilesToR2(
  videoId: string,
  cloudflareStreamUrl: string,
  onProgress?: (phase: string, progress: number) => void
): Promise<string> {
  try {
    // Step 1: Download master playlist
    onProgress?.('Downloading master playlist', 0.1);
    console.log(`Downloading HLS master from Cloudflare...`);
    
    const masterContent = await downloadHLSManifest(cloudflareStreamUrl);
    
    // Step 2: Parse variant playlists from master
    onProgress?.('Parsing variant playlists', 0.2);
    const variantUrls = parseVariantPlaylists(masterContent, cloudflareStreamUrl);
    console.log(`Found ${variantUrls.length} variant playlists`);

    // Step 3: Download variant playlists and segments
    onProgress?.('Downloading segments', 0.3);
    const allSegmentUrls = new Set<string>();
    
    for (const variantUrl of variantUrls) {
      const variantContent = await downloadHLSManifest(variantUrl);
      const segmentUrls = parseSegmentUrls(variantContent, variantUrl);
      segmentUrls.forEach(url => allSegmentUrls.add(url));
    }

    const segmentUrlsArray = Array.from(allSegmentUrls);
    console.log(`Found ${segmentUrlsArray.length} segments to upload`);

    // Step 4: Upload master to R2
    onProgress?.('Uploading master to R2', 0.4);
    const masterAssetPath = await uploadHLSMasterToR2(videoId, masterContent);

    // Step 5: Upload segments to R2
    let uploadedSegments = 0;
    for (const segmentUrl of segmentUrlsArray) {
      const segmentFileName = path.basename(new URL(segmentUrl).pathname);
      const segmentData = await downloadHLSSegment(segmentUrl);
      await uploadHLSSegmentToR2(videoId, segmentFileName, segmentData);
      
      uploadedSegments++;
      const progress = 0.4 + (uploadedSegments / segmentUrlsArray.length) * 0.5;
      onProgress?.('Uploading segments', progress);
    }

    onProgress?.('Complete', 1.0);
    console.log(`✅ All HLS files uploaded to R2: ${masterAssetPath}`);
    
    return masterAssetPath;
  } catch (error) {
    console.error('Error uploading HLS files to R2:', error);
    throw error;
  }
}

/**
 * Parse variant playlist URLs from master playlist
 */
function parseVariantPlaylists(masterContent: string, baseUrl: string): string[] {
  const lines = masterContent.split('\n');
  const variantUrls: string[] = [];
  let baseUrlPath = baseUrl.substring(0, baseUrl.lastIndexOf('/'));

  for (const line of lines) {
    if (!line.startsWith('#') && line.trim()) {
      if (!line.startsWith('http')) {
        variantUrls.push(`${baseUrlPath}/${line.trim()}`);
      } else {
        variantUrls.push(line.trim());
      }
    }
  }

  return variantUrls;
}

/**
 * Parse segment URLs from variant playlist
 */
function parseSegmentUrls(playlistContent: string, baseUrl: string): string[] {
  const lines = playlistContent.split('\n');
  const segmentUrls: string[] = [];
  let baseUrlPath = baseUrl.substring(0, baseUrl.lastIndexOf('/'));

  for (const line of lines) {
    if (!line.startsWith('#') && line.trim()) {
      if (!line.startsWith('http')) {
        segmentUrls.push(`${baseUrlPath}/${line.trim()}`);
      } else {
        segmentUrls.push(line.trim());
      }
    }
  }

  return segmentUrls;
}

/**
 * Convert R2 asset path to CDN URL
 * @param assetPath - Asset path (e.g., "srk/videos/video-id/master.m3u8")
 * @returns Full CDN URL
 */
export function getHLSCDNUrl(assetPath: string): string {
  if (!assetPath) return '';
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  return `${CDN_BASE_URL}/${assetPath.replace(/^\/+/, '')}`;
}
