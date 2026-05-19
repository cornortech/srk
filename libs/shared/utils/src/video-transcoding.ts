import * as admin from 'firebase-admin';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Transcodes video to HLS format with multiple bitrate variants
 * This enables adaptive streaming - automatic quality adjustment based on bandwidth
 */
export async function transcodeVideoToHLS(
  inputPath: string,
  outputDir: string,
  videoId: string
): Promise<{ playlistUrl: string; variantsGenerated: number }> {
  return new Promise((resolve, reject) => {
    const playlistPath = path.join(outputDir, `${videoId}.m3u8`);
    
    // Create master playlist with multiple bitrates
    const bitrates = [
      { bitrate: '500k', resolution: '854x480', name: '480p' },
      { bitrate: '1500k', resolution: '1280x720', name: '720p' },
      { bitrate: '3000k', resolution: '1920x1080', name: '1080p' }
    ];

    let completed = 0;
    const variants: string[] = [];

    bitrates.forEach(({ bitrate, resolution, name }) => {
      const variantPath = path.join(outputDir, `${videoId}-${name}.m3u8`);
      
      ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .size(resolution)
        .videoBitrate(bitrate)
        .audioBitrate('128k')
        .audioChannels(2)
        .audioFrequency(44100)
        .outputOptions([
          '-hls_time 10',           // 10-second chunks
          '-hls_list_size 0',       // Keep all segments
          '-hls_segment_filename',
          `${videoId}-${name}-%03d.ts`
        ])
        .output(variantPath)
        .on('end', () => {
          completed++;
          variants.push(`${videoId}-${name}.m3u8`);
          
          if (completed === bitrates.length) {
            // Generate master playlist
            generateMasterPlaylist(playlistPath, videoId, bitrates);
            resolve({ playlistUrl: playlistPath, variantsGenerated: bitrates.length });
          }
        })
        .on('error', reject)
        .run();
    });
  });
}

function generateMasterPlaylist(
  playlistPath: string,
  videoId: string,
  bitrates: Array<{ bitrate: string; resolution: string; name: string }>
): void {
  let playlistContent = '#EXTM3U\n#EXT-X-VERSION:3\n';

  bitrates.forEach(({ bitrate, resolution, name }) => {
    const bandwidth = parseInt(bitrate) * 1000;
    playlistContent += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n`;
    playlistContent += `${videoId}-${name}.m3u8\n`;
  });

  fs.writeFileSync(playlistPath, playlistContent);
}

/**
 * Alternative: Use FFmpeg with streaming output directly to Firebase
 */
export async function transcodeLargeVideoToHLS(
  inputBuffer: Buffer,
  courseId: string,
  videoName: string,
  bucket: admin.storage.Bucket
): Promise<string> {
  const tempInputPath = `/tmp/${Date.now()}-input.mp4`;
  const tempOutputDir = `/tmp/hls-${Date.now()}`;

  try {
    // Write temp input file
    fs.writeFileSync(tempInputPath, inputBuffer);
    fs.mkdirSync(tempOutputDir, { recursive: true });

    // Transcode
    const result = await transcodeVideoToHLS(tempInputPath, tempOutputDir, videoName);

    // Upload HLS files to Firebase
    const masterPlaylistPath = `courses/${courseId}/videos/${videoName}/master.m3u8`;
    const manifestUrl = await uploadHLSFilesToFirebase(
      tempOutputDir,
      courseId,
      videoName,
      bucket,
      masterPlaylistPath
    );

    return manifestUrl;
  } finally {
    // Cleanup temp files
    if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
    if (fs.existsSync(tempOutputDir)) {
      fs.rmSync(tempOutputDir, { recursive: true });
    }
  }
}

async function uploadHLSFilesToFirebase(
  localDir: string,
  courseId: string,
  videoName: string,
  bucket: admin.storage.Bucket,
  remoteDir: string
): Promise<string> {
  const files = fs.readdirSync(localDir);
  const baseRemotePath = `courses/${courseId}/videos/${videoName}`;

  for (const file of files) {
    const localPath = path.join(localDir, file);
    const remotePath = `${baseRemotePath}/${file}`;

    await bucket.upload(localPath, {
      destination: remotePath,
      metadata: {
        cacheControl: 'public, max-age=86400' // 24-hour cache
      }
    });
  }

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(baseRemotePath + '/master.m3u8')}?alt=media`;
}
