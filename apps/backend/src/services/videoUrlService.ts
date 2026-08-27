/**
 * Utility functions for handling course video URLs
 * Handles both Firebase URLs and Cloudflare R2 keys
 */

import { getR2AssetUrl } from './r2Service';

/**
 * Convert a video URL (which might be an R2 key) to a full URL
 * If it's already a full URL, returns as-is
 * If it's an R2 key, converts to CDN URL
 * 
 * @param videoUrl - Either a full URL or an R2 key
 * @returns Full URL to the video
 */
export function getVideoUrl(videoUrl: string): string {
  if (!videoUrl) return '';
  
  // If it's already a full URL, return as-is
  if (/^https?:\/\//i.test(videoUrl)) {
    return videoUrl;
  }
  
  // Otherwise, treat it as an R2 key and convert to full URL
  return getR2AssetUrl(videoUrl);
}

/**
 * Check if a URL is a Cloudflare R2 URL
 * 
 * @param url - URL to check
 * @returns True if it's an R2 URL
 */
export function isR2Url(url: string): boolean {
  if (!url) return false;
  return /^https?:\/\/.*\.r2\.cloudflarestorage\.com|.*\.cdn\.example\.com/i.test(url);
}

/**
 * Check if a URL is a Firebase URL
 * 
 * @param url - URL to check
 * @returns True if it's a Firebase URL
 */
export function isFirebaseUrl(url: string): boolean {
  if (!url) return false;
  return /firebase|firebasestorage/i.test(url);
}

/**
 * Get status of video URL (whether it's been migrated)
 * 
 * @param url - URL to check
 * @returns 'r2' | 'firebase' | 'unknown'
 */
export function getVideoStorageType(url: string): 'r2' | 'firebase' | 'unknown' {
  if (isR2Url(url)) return 'r2';
  if (isFirebaseUrl(url)) return 'firebase';
  return 'unknown';
}
